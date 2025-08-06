import type { Event, ExtensionContext, TreeDataProvider } from 'vscode'
import { EventEmitter, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode'
import { getFontCache, getFontWhitelist, hasFontCache } from './config'

/**
 * 字体树项类，表示树形视图中的单个字体项
 */
export class FontTreeItem extends TreeItem {
  constructor(
    public readonly fontName: string,
    public readonly isWhitelisted: boolean,
    public readonly viewType: 'whitelist' | 'all',
  ) {
    super(fontName, TreeItemCollapsibleState.None)

    this.label = fontName
    this.tooltip = `Font Family: ${fontName}${isWhitelisted ? ' (Whitelisted)' : ''}`
    this.description = isWhitelisted ? 'Whitelisted' : undefined

    // 设置图标
    if (isWhitelisted) {
      this.iconPath = new ThemeIcon('star-full')
    }
    else {
      this.iconPath = new ThemeIcon('symbol-text')
    }

    // 设置上下文值，用于控制菜单显示
    if (viewType === 'whitelist') {
      this.contextValue = 'whitelistedFont'
    }
    else {
      this.contextValue = isWhitelisted ? 'whitelistedFontInAll' : 'availableFont'
    }

    // 设置命令，双击时预览字体
    this.command = {
      command: 'familySwitcher.previewFont',
      title: 'Preview Font',
      arguments: [this],
    }
  }
}

/**
 * 白名单字体树数据提供器
 */
export class FontWhitelistProvider implements TreeDataProvider<FontTreeItem> {
  private _onDidChangeTreeData: EventEmitter<FontTreeItem | undefined | null | void> = new EventEmitter<FontTreeItem | undefined | null | void>()
  readonly onDidChangeTreeData: Event<FontTreeItem | undefined | null | void> = this._onDidChangeTreeData.event

  constructor(private context: ExtensionContext) {}

  /**
   * 刷新树形视图
   */
  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  /**
   * 获取树项
   */
  getTreeItem(element: FontTreeItem): TreeItem {
    return element
  }

  /**
   * 获取子项列表
   */
  async getChildren(element?: FontTreeItem): Promise<FontTreeItem[]> {
    if (element) {
      return []
    }

    try {
      // 检查是否有字体缓存
      if (!await hasFontCache()) {
        return []
      }

      const whitelist = await getFontWhitelist()
      return whitelist.map(font => new FontTreeItem(font, true, 'whitelist'))
    }
    catch (error) {
      console.error('Error getting whitelisted fonts:', error)
      return []
    }
  }
}

/**
 * 全部字体树数据提供器
 */
export class FontAllProvider implements TreeDataProvider<FontTreeItem> {
  private _onDidChangeTreeData: EventEmitter<FontTreeItem | undefined | null | void> = new EventEmitter<FontTreeItem | undefined | null | void>()
  readonly onDidChangeTreeData: Event<FontTreeItem | undefined | null | void> = this._onDidChangeTreeData.event

  constructor(private context: ExtensionContext) {}

  /**
   * 刷新树形视图
   */
  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  /**
   * 获取树项
   */
  getTreeItem(element: FontTreeItem): TreeItem {
    return element
  }

  /**
   * 获取子项列表
   */
  async getChildren(element?: FontTreeItem): Promise<FontTreeItem[]> {
    if (element) {
      return []
    }

    try {
      // 检查是否有字体缓存
      if (!await hasFontCache()) {
        return []
      }

      const allFonts = await getFontCache()
      const whitelist = await getFontWhitelist()

      return allFonts.map(font => new FontTreeItem(
        font,
        whitelist.includes(font),
        'all',
      ))
    }
    catch (error) {
      console.error('Error getting all fonts:', error)
      return []
    }
  }
}
