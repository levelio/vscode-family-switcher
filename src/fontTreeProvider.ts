import type { Event, ExtensionContext, TreeDataProvider } from 'vscode'
import { EventEmitter, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode'
import { getFontCache, getFontFavorites, hasFontCache } from './config'

/**
 * Font tree item class, represents a single font item in the tree view
 */
export class FontTreeItem extends TreeItem {
  constructor(
    public readonly fontName: string,
    public readonly isFavorited: boolean,
    public readonly viewType: 'favorites' | 'all',
  ) {
    super(fontName, TreeItemCollapsibleState.None)

    this.label = fontName
    this.tooltip = `Font Family: ${fontName}${isFavorited ? ' (Favorited)' : ''}`
    this.description = isFavorited ? 'Favorited' : undefined

    // Set icon
    if (isFavorited) {
      this.iconPath = new ThemeIcon('star-full')
    }
    else {
      this.iconPath = new ThemeIcon('symbol-text')
    }

    // Set context value for menu control
    if (viewType === 'favorites') {
      this.contextValue = 'favoritedFont'
    }
    else {
      this.contextValue = isFavorited ? 'favoritedFontInAll' : 'availableFont'
    }

    // Set command for font preview on double click
    this.command = {
      command: 'familySwitcher.previewFont',
      title: 'Preview Font',
      arguments: [this],
    }
  }
}

/**
 * Favorites font tree data provider
 */
export class FontFavoritesProvider implements TreeDataProvider<FontTreeItem> {
  private _onDidChangeTreeData: EventEmitter<FontTreeItem | undefined | null | void> = new EventEmitter<FontTreeItem | undefined | null | void>()
  readonly onDidChangeTreeData: Event<FontTreeItem | undefined | null | void> = this._onDidChangeTreeData.event

  constructor(private context: ExtensionContext) {}

  /**
   * Refresh tree view
   */
  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  /**
   * Get tree item
   */
  getTreeItem(element: FontTreeItem): TreeItem {
    return element
  }

  /**
   * Get children list
   */
  async getChildren(element?: FontTreeItem): Promise<FontTreeItem[]> {
    if (element) {
      return []
    }

    try {
      // Check if font cache exists
      if (!await hasFontCache()) {
        return []
      }

      const favorites = await getFontFavorites()
      return favorites.map(font => new FontTreeItem(font, true, 'favorites'))
    }
    catch (error) {
      console.error('Error getting favorited fonts:', error)
      return []
    }
  }
}

/**
 * All fonts tree data provider
 */
export class FontAllProvider implements TreeDataProvider<FontTreeItem> {
  private _onDidChangeTreeData: EventEmitter<FontTreeItem | undefined | null | void> = new EventEmitter<FontTreeItem | undefined | null | void>()
  readonly onDidChangeTreeData: Event<FontTreeItem | undefined | null | void> = this._onDidChangeTreeData.event

  constructor(private context: ExtensionContext) {}

  /**
   * Refresh tree view
   */
  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  /**
   * Get tree item
   */
  getTreeItem(element: FontTreeItem): TreeItem {
    return element
  }

  /**
   * Get children list
   */
  async getChildren(element?: FontTreeItem): Promise<FontTreeItem[]> {
    if (element) {
      return []
    }

    try {
      // Check if font cache exists
      if (!await hasFontCache()) {
        return []
      }

      const allFonts = await getFontCache()
      const favorites = await getFontFavorites()

      return allFonts.map(font => new FontTreeItem(
        font,
        favorites.includes(font),
        'all',
      ))
    }
    catch (error) {
      console.error('Error getting all fonts:', error)
      return []
    }
  }
}
