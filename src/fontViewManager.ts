import type { ExtensionContext } from 'vscode'
import type { FontTreeItem } from './fontTreeProvider'
import { ProgressLocation, window, workspace } from 'vscode'
import { getFontWhitelist, setFontFamilyConfig, setFontWhitelist, setTerminalFontFamilyConfig } from './config'
import { FontAllProvider, FontWhitelistProvider } from './fontTreeProvider'
import { getSystemFontFamilies } from './utils'

/**
 * 字体视图管理器，负责管理GUI面板的操作
 */
export class FontViewManager {
  private whitelistProvider: FontWhitelistProvider
  private allFontsProvider: FontAllProvider

  constructor(private context: ExtensionContext) {
    this.whitelistProvider = new FontWhitelistProvider(context)
    this.allFontsProvider = new FontAllProvider(context)
  }

  /**
   * 获取白名单字体提供器
   */
  getWhitelistProvider(): FontWhitelistProvider {
    return this.whitelistProvider
  }

  /**
   * 获取全部字体提供器
   */
  getAllFontsProvider(): FontAllProvider {
    return this.allFontsProvider
  }

  /**
   * 刷新所有视图
   */
  refreshViews(): void {
    this.whitelistProvider.refresh()
    this.allFontsProvider.refresh()
  }

  /**
   * 从视图加载字体
   */
  async loadFontsFromView(): Promise<void> {
    return window.withProgress({
      location: ProgressLocation.Notification,
      title: 'Loading fonts...',
      cancellable: false,
    }, async () => {
      try {
        // 获取系统字体
        const fontFamilies = await getSystemFontFamilies()

        // 过滤掉以点开头的字体
        const filteredFonts = fontFamilies.filter(font => !font.startsWith('.'))

        // 缓存字体
        await this.context.globalState.update('vfs.fontCache', filteredFonts)

        // 刷新视图
        this.refreshViews()

        window.showInformationMessage(`Successfully loaded and cached ${filteredFonts.length} fonts.`)
      }
      catch (error) {
        window.showErrorMessage(`Failed to load fonts: ${error}`)
      }
    })
  }

  /**
   * 预览字体
   */
  async previewFont(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName

      // 获取当前编辑器字体配置
      const config = workspace.getConfiguration()
      const currentFontFamily = config.get<string>('editor.fontFamily') || ''

      // 设置新字体为主要字体
      const fontFamilyArray = currentFontFamily.split(',').map(f => f.trim())
      fontFamilyArray[0] = fontName

      // 应用字体预览
      await setFontFamilyConfig(fontFamilyArray)

      window.showInformationMessage(`Previewing font: ${fontName}`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to preview font: ${error}`)
    }
  }

  /**
   * 应用字体到编辑器
   */
  async applyEditorFont(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName

      // 获取当前编辑器字体配置
      const config = workspace.getConfiguration()
      const currentFontFamily = config.get<string>('editor.fontFamily') || ''
      const fontFamilyArray = currentFontFamily.split(',').map(f => f.trim())

      // 显示字体位置选择
      const FONT_POSITIONS = [
        { label: 'Primary Font', description: 'Main font' },
        { label: 'Secondary Font', description: 'First fallback font' },
        { label: 'Tertiary Font', description: 'Second fallback font' },
        { label: 'Quaternary Font', description: 'Third fallback font' },
        { label: 'Quinary Font', description: 'Fourth fallback font' },
      ]

      const positionSelected = await window.showQuickPick(FONT_POSITIONS, {
        placeHolder: 'Select font position to set',
        matchOnDescription: true,
      })

      if (!positionSelected) {
        return
      }

      const positionIndex = FONT_POSITIONS.findIndex(item => item.label === positionSelected.label)

      // 设置字体到指定位置
      fontFamilyArray[positionIndex] = fontName
      await setFontFamilyConfig(fontFamilyArray)

      window.showInformationMessage(`Set ${fontName} as ${positionSelected.label.toLowerCase()} for editor`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to apply editor font: ${error}`)
    }
  }

  /**
   * 应用字体到终端
   */
  async applyTerminalFont(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName

      // 获取当前终端字体配置
      const config = workspace.getConfiguration()
      const currentFontFamily = config.get<string>('terminal.integrated.fontFamily') || ''
      const fontFamilyArray = currentFontFamily.split(',').map(f => f.trim())

      // 显示字体位置选择
      const FONT_POSITIONS = [
        { label: 'Primary Font', description: 'Main font' },
        { label: 'Secondary Font', description: 'First fallback font' },
        { label: 'Tertiary Font', description: 'Second fallback font' },
        { label: 'Quaternary Font', description: 'Third fallback font' },
        { label: 'Quinary Font', description: 'Fourth fallback font' },
      ]

      const positionSelected = await window.showQuickPick(FONT_POSITIONS, {
        placeHolder: 'Select font position to set',
        matchOnDescription: true,
      })

      if (!positionSelected) {
        return
      }

      const positionIndex = FONT_POSITIONS.findIndex(item => item.label === positionSelected.label)

      // 设置字体到指定位置
      fontFamilyArray[positionIndex] = fontName
      await setTerminalFontFamilyConfig(fontFamilyArray)

      window.showInformationMessage(`Set ${fontName} as ${positionSelected.label.toLowerCase()} for terminal`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to apply terminal font: ${error}`)
    }
  }

  /**
   * 添加到白名单
   */
  async addToWhitelist(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName
      const currentWhitelist = await getFontWhitelist()

      if (currentWhitelist.includes(fontName)) {
        window.showInformationMessage(`${fontName} is already in the whitelist`)
        return
      }

      const newWhitelist = [...currentWhitelist, fontName]
      await setFontWhitelist(newWhitelist)

      // 刷新视图
      this.refreshViews()

      window.showInformationMessage(`Added ${fontName} to whitelist`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to add font to whitelist: ${error}`)
    }
  }

  /**
   * 从白名单移除
   */
  async removeFromWhitelist(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName
      const currentWhitelist = await getFontWhitelist()

      const newWhitelist = currentWhitelist.filter(font => font !== fontName)
      await setFontWhitelist(newWhitelist)

      // 刷新视图
      this.refreshViews()

      window.showInformationMessage(`Removed ${fontName} from whitelist`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to remove font from whitelist: ${error}`)
    }
  }
}
