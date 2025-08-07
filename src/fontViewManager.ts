import type { ExtensionContext } from 'vscode'
import type { FontTreeItem } from './fontTreeProvider'
import { ProgressLocation, window, workspace } from 'vscode'
import { getFontFavorites, setFontFamilyConfig, setFontFavorites, setTerminalFontFamilyConfig } from './config'
import { FontAllProvider, FontFavoritesProvider } from './fontTreeProvider'
import { getSystemFontFamilies } from './utils'

/**
 * Font view manager, responsible for managing GUI panel operations
 */
export class FontViewManager {
  private favoritesProvider: FontFavoritesProvider
  private allFontsProvider: FontAllProvider

  constructor(private context: ExtensionContext) {
    this.favoritesProvider = new FontFavoritesProvider(context)
    this.allFontsProvider = new FontAllProvider(context)
  }

  /**
   * Get favorites font provider
   */
  getFavoritesProvider(): FontFavoritesProvider {
    return this.favoritesProvider
  }

  /**
   * Get all fonts provider
   */
  getAllFontsProvider(): FontAllProvider {
    return this.allFontsProvider
  }

  /**
   * Refresh all views
   */
  refreshViews(): void {
    this.favoritesProvider.refresh()
    this.allFontsProvider.refresh()
  }

  /**
   * Load fonts from view
   */
  async loadFontsFromView(): Promise<void> {
    return window.withProgress({
      location: ProgressLocation.Notification,
      title: 'Loading fonts...',
      cancellable: false,
    }, async () => {
      try {
        // Get system fonts
        const fontFamilies = await getSystemFontFamilies()

        // Filter out fonts that start with a period
        const filteredFonts = fontFamilies.filter(font => !font.startsWith('.'))

        // Cache fonts
        await this.context.globalState.update('vfs.fontCache', filteredFonts)

        // Refresh views
        this.refreshViews()

        window.showInformationMessage(`Successfully loaded and cached ${filteredFonts.length} fonts.`)
      }
      catch (error) {
        window.showErrorMessage(`Failed to load fonts: ${error}`)
      }
    })
  }

  /**
   * Preview font
   */
  async previewFont(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName

      // Get current editor font configuration
      const config = workspace.getConfiguration()
      const currentFontFamily = config.get<string>('editor.fontFamily') || ''

      // Set new font as primary font
      const fontFamilyArray = currentFontFamily.split(',').map(f => f.trim())
      fontFamilyArray[0] = fontName

      // Apply font preview
      await setFontFamilyConfig(fontFamilyArray)

      window.showInformationMessage(`Previewing font: ${fontName}`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to preview font: ${error}`)
    }
  }

  /**
   * Apply font to editor
   */
  async applyEditorFont(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName

      // Get current editor font configuration
      const config = workspace.getConfiguration()
      const currentFontFamily = config.get<string>('editor.fontFamily') || ''
      const fontFamilyArray = currentFontFamily.split(',').map(f => f.trim())

      // Show font position selection
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

      // Set font to specified position
      fontFamilyArray[positionIndex] = fontName
      await setFontFamilyConfig(fontFamilyArray)

      window.showInformationMessage(`Set ${fontName} as ${positionSelected.label.toLowerCase()} for editor`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to apply editor font: ${error}`)
    }
  }

  /**
   * Apply font to terminal
   */
  async applyTerminalFont(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName

      // Get current terminal font configuration
      const config = workspace.getConfiguration()
      const currentFontFamily = config.get<string>('terminal.integrated.fontFamily') || ''
      const fontFamilyArray = currentFontFamily.split(',').map(f => f.trim())

      // Show font position selection
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

      // Set font to specified position
      fontFamilyArray[positionIndex] = fontName
      await setTerminalFontFamilyConfig(fontFamilyArray)

      window.showInformationMessage(`Set ${fontName} as ${positionSelected.label.toLowerCase()} for terminal`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to apply terminal font: ${error}`)
    }
  }

  /**
   * Add to favorites
   */
  async addToFavorites(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName
      const currentFavorites = await getFontFavorites()

      if (currentFavorites.includes(fontName)) {
        window.showInformationMessage(`${fontName} is already in favorites`)
        return
      }

      const newFavorites = [...currentFavorites, fontName]
      await setFontFavorites(newFavorites)

      // Refresh views
      this.refreshViews()

      window.showInformationMessage(`Added ${fontName} to favorites`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to add to favorites: ${error}`)
    }
  }

  /**
   * Remove from favorites
   */
  async removeFromFavorites(item: FontTreeItem): Promise<void> {
    try {
      const fontName = item.fontName
      const currentFavorites = await getFontFavorites()

      const newFavorites = currentFavorites.filter(font => font !== fontName)
      await setFontFavorites(newFavorites)

      // Refresh views
      this.refreshViews()

      window.showInformationMessage(`Removed ${fontName} from favorites`)
    }
    catch (error) {
      window.showErrorMessage(`Failed to remove from favorites: ${error}`)
    }
  }
}
