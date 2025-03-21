import type { QuickPickItem } from 'vscode'
import { defineExtension } from 'reactive-vscode'
import { commands, StatusBarAlignment, window, workspace } from 'vscode'
import { EDITOR_FONT_FAMILY_CONFIG, FONT_BLACKLIST_CONFIG, getFontBlacklist, setFontBlacklist, setFontFamilyConfig, setTerminalFontFamilyConfig, TERMINAL_FONT_FAMILY_CONFIG } from './config'
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

const { activate, deactivate } = defineExtension(() => {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100)

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
    const blacklist = await getFontBlacklist()
    const filteredFonts = fontFamilies.filter(font => !blacklist.includes(font))

    const fontItems: QuickPickItem[] = filteredFonts.map(font => ({
      label: font,
      description: blacklist.includes(font) ? 'Blacklisted' : undefined,
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

  async function manageFontBlacklist() {
    const fontFamilies = await getSystemFontFamilies()
    const currentBlacklist = await getFontBlacklist()

    const fontItems: QuickPickItem[] = fontFamilies.map(font => ({
      label: font,
      picked: currentBlacklist.includes(font),
      description: currentBlacklist.includes(font) ? 'Blacklisted' : undefined,
    }))

    const selected = await window.showQuickPick(fontItems, {
      placeHolder: 'Select fonts to blacklist (press Enter to confirm)',
      matchOnDescription: true,
      matchOnDetail: true,
      canPickMany: true,
    })

    if (selected) {
      const newBlacklist = selected.map(item => item.label)
      await setFontBlacklist(newBlacklist)
      window.showInformationMessage(`Updated font blacklist: ${newBlacklist.length} fonts blacklisted`)
    }
  }

  async function switchFontFamilyWithConfig(config: FontConfig) {
    const fontFamilies = await getSystemFontFamilies()
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
  const switchFontFamily = () => switchFontFamilyWithConfig({
    configKey: EDITOR_FONT_FAMILY_CONFIG,
    setConfig: setFontFamilyConfig,
    messagePrefix: 'Font',
  })

  // Switch terminal font family
  const switchTerminalFontFamily = () => switchFontFamilyWithConfig({
    configKey: TERMINAL_FONT_FAMILY_CONFIG,
    setConfig: setTerminalFontFamilyConfig,
    messagePrefix: 'Terminal font',
  })

  // Register commands
  commands.registerCommand('vscode-family-switcher.switchFontFamily', switchFontFamily)
  commands.registerCommand('vscode-family-switcher.switchTerminalFontFamily', switchTerminalFontFamily)
  commands.registerCommand('vscode-family-switcher.manageFontBlacklist', manageFontBlacklist)

  return {
    dispose: () => {
      statusBarItem.dispose()
    },
  }
})

export { activate, deactivate }
