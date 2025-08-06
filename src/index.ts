import type { ExtensionContext, QuickPickItem } from 'vscode'
import type { FontTreeItem } from './fontTreeProvider'
import { commands, ProgressLocation, StatusBarAlignment, window, workspace } from 'vscode'
import {
  EDITOR_FONT_FAMILY_CONFIG,
  getFontCache,
  getFontWhitelist,
  hasFontCache,
  setExtensionContext,
  setFontCache,
  setFontFamilyConfig,
  setFontWhitelist,
  setTerminalFontFamilyConfig,
  TERMINAL_FONT_FAMILY_CONFIG,
} from './config'
import { FontViewManager } from './fontViewManager'
import { getSystemFontFamilies } from './utils'

interface FontPosition {
  label: string
  description: string
}

interface FontConfig {
  configKey: string
  setConfig: (fontFamily: string | string[]) => Promise<void>
  messagePrefix: string
}

const FONT_POSITIONS: FontPosition[] = [
  { label: 'Primary Font', description: 'Main font' },
  { label: 'Secondary Font', description: 'First fallback font' },
  { label: 'Tertiary Font', description: 'Second fallback font' },
  { label: 'Quaternary Font', description: 'Third fallback font' },
  { label: 'Quinary Font', description: 'Fourth fallback font' },
]

let statusBarItem: any
let fontViewManager: FontViewManager

async function selectFontPosition(): Promise<number | undefined> {
  const positionSelected = await window.showQuickPick(FONT_POSITIONS, {
    placeHolder: 'Select font position to set',
    matchOnDescription: true,
  })

  if (!positionSelected)
    return undefined

  return FONT_POSITIONS.findIndex(item => item.label === positionSelected.label)
}

async function selectFont(fontFamilies: string[], config: FontConfig, fontFamilyArray: string[], positionIndex: number): Promise<QuickPickItem | undefined> {
  const whitelist = await getFontWhitelist()
  const filteredFonts = whitelist.length > 0 ? fontFamilies.filter(font => whitelist.includes(font)) : fontFamilies

  const fontItems: QuickPickItem[] = filteredFonts.map(font => ({
    label: font,
    description: whitelist.includes(font) ? 'Whitelisted' : undefined,
  }))

  return await window.showQuickPick(fontItems, {
    placeHolder: 'Search or select a font to use',
    matchOnDescription: true,
    matchOnDetail: true,
    onDidSelectItem: async (item) => {
      // Preview font
      const newFontFamilyArray = [...fontFamilyArray]
      newFontFamilyArray[positionIndex] = (item as QuickPickItem).label
      await config.setConfig(newFontFamilyArray)
    },
  })
}

// Ensure font cache exists, load fonts if needed
async function ensureFontCache(): Promise<boolean> {
  const hasCached = await hasFontCache()
  if (!hasCached) {
    const result = await window.showInformationMessage(
      'Font cache not found. You need to load fonts first.',
      'Load Fonts',
    )

    if (result === 'Load Fonts') {
      await loadFonts()
      return true
    }
    return false
  }
  return true
}

async function manageFontWhitelist() {
  // Check if font cache exists
  if (!await ensureFontCache())
    return

  const fontFamilies = await getFontCache()
  const currentWhitelist = await getFontWhitelist()

  const fontItems: QuickPickItem[] = fontFamilies.map(font => ({
    label: font,
    picked: currentWhitelist.includes(font),
    description: currentWhitelist.includes(font) ? 'Whitelisted' : undefined,
  }))

  const selected = await window.showQuickPick(fontItems, {
    placeHolder: 'Select fonts to whitelist (press Enter to confirm)',
    matchOnDescription: true,
    matchOnDetail: true,
    canPickMany: true,
  })

  if (selected) {
    const newWhitelist = selected.map(item => item.label)
    await setFontWhitelist(newWhitelist)

    // 刷新视图以显示更新后的白名单
    fontViewManager.refreshViews()

    window.showInformationMessage(`Updated font whitelist: ${newWhitelist.length} fonts whitelisted`)
  }
}

async function switchFontFamilyWithConfig(config: FontConfig) {
  // Check if font cache exists
  if (!await ensureFontCache())
    return

  const fontFamilies = await getFontCache()
  const positionIndex = await selectFontPosition()

  if (positionIndex === undefined)
    return

  // Get current font settings
  const currentFontFamily = workspace.getConfiguration().get<string>(config.configKey) || ''
  const fontFamilyArray = currentFontFamily.split(',').map(f => f.trim())

  const fontSelected = await selectFont(fontFamilies, config, fontFamilyArray, positionIndex)
  if (!fontSelected) {
    // Restore original font settings
    await config.setConfig(currentFontFamily)
    return
  }

  // Update font settings
  const newFontFamilyArray = [...fontFamilyArray]
  newFontFamilyArray[positionIndex] = fontSelected.label
  await config.setConfig(newFontFamilyArray)
  window.showInformationMessage(`${config.messagePrefix} position ${positionIndex + 1} set to: ${fontSelected.label}`)
}

// Switch font family
function switchFontFamily() {
  return switchFontFamilyWithConfig({
    configKey: EDITOR_FONT_FAMILY_CONFIG,
    setConfig: setFontFamilyConfig,
    messagePrefix: 'Font',
  })
}

// Switch terminal font family
function switchTerminalFontFamily() {
  return switchFontFamilyWithConfig({
    configKey: TERMINAL_FONT_FAMILY_CONFIG,
    setConfig: setTerminalFontFamilyConfig,
    messagePrefix: 'Terminal font',
  })
}

// Load and cache system fonts
async function loadFonts() {
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

      // Cache the fonts
      await setFontCache(filteredFonts)

      window.showInformationMessage(`Successfully loaded and cached ${filteredFonts.length} fonts.`)

      return filteredFonts
    }
    catch (error) {
      window.showErrorMessage(`Failed to load fonts: ${error}`)
      return []
    }
  })
}

export function activate(context: ExtensionContext) {
  // Set extension context for font cache storage
  setExtensionContext(context)

  // Initialize font view manager
  fontViewManager = new FontViewManager(context)

  // Create status bar item
  statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100)

  // Register tree data providers
  window.registerTreeDataProvider('fontWhitelistView', fontViewManager.getWhitelistProvider())
  window.registerTreeDataProvider('fontAllView', fontViewManager.getAllFontsProvider())

  // Register original commands
  context.subscriptions.push(commands.registerCommand('familySwitcher.switchFontFamily', switchFontFamily))
  context.subscriptions.push(commands.registerCommand('familySwitcher.switchTerminalFontFamily', switchTerminalFontFamily))
  context.subscriptions.push(commands.registerCommand('familySwitcher.manageFontWhitelist', manageFontWhitelist))
  context.subscriptions.push(commands.registerCommand('familySwitcher.loadFonts', loadFonts))

  // Register GUI-related commands
  context.subscriptions.push(commands.registerCommand('familySwitcher.refreshFonts', () => fontViewManager.refreshViews()))
  context.subscriptions.push(commands.registerCommand('familySwitcher.loadFontsFromView', () => fontViewManager.loadFontsFromView()))
  context.subscriptions.push(commands.registerCommand('familySwitcher.previewFont', (item: FontTreeItem) => fontViewManager.previewFont(item)))
  context.subscriptions.push(commands.registerCommand('familySwitcher.applyEditorFont', (item: FontTreeItem) => fontViewManager.applyEditorFont(item)))
  context.subscriptions.push(commands.registerCommand('familySwitcher.applyTerminalFont', (item: FontTreeItem) => fontViewManager.applyTerminalFont(item)))
  context.subscriptions.push(commands.registerCommand('familySwitcher.addToWhitelist', (item: FontTreeItem) => fontViewManager.addToWhitelist(item)))
  context.subscriptions.push(commands.registerCommand('familySwitcher.removeFromWhitelist', (item: FontTreeItem) => fontViewManager.removeFromWhitelist(item)))
  context.subscriptions.push(commands.registerCommand('familySwitcher.searchFonts', manageFontWhitelist))
}

export function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose()
  }
}
