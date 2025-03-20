import type { QuickPickItem } from 'vscode'
import { defineExtension } from 'reactive-vscode'
import { commands, StatusBarAlignment, window, workspace } from 'vscode'
import { setFontFamilyConfig } from './config'
import { getSystemFontFamilies } from './utils'

const STORAGE_KEY = 'fontFamilies'

const { activate, deactivate } = defineExtension((context) => {
  let fontFamilies: string[] = context.globalState.get<string[]>(STORAGE_KEY) || []
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100)

  // Load system font families
  const loadFontFamilies = async () => {
    statusBarItem.text = '$(loading~spin) Loading local fonts...'
    statusBarItem.show()

    try {
      fontFamilies = await getSystemFontFamilies()
      // Save to global state
      await context.globalState.update(STORAGE_KEY, fontFamilies)
      statusBarItem.text = `$(check) Loaded ${fontFamilies.length} fonts`
      setTimeout(() => statusBarItem.hide(), 3000)
    }
    catch {
      statusBarItem.text = '$(error) Failed to load fonts'
      setTimeout(() => statusBarItem.hide(), 3000)
    }
  }

  // Switch font family
  const switchFontFamily = async () => {
    if (fontFamilies.length === 0) {
      await loadFontFamilies()
    }

    // Save original font setting
    const originalFontFamily = workspace.getConfiguration().get<string>('editor.fontFamily')

    const items: QuickPickItem[] = fontFamilies.map(font => ({
      label: font,
    }))

    const selected = await window.showQuickPick(items, {
      placeHolder: 'Select a font to use',
      onDidSelectItem: async (item) => {
        // Preview font
        await setFontFamilyConfig((item as QuickPickItem).label)
      },
    })

    if (selected) {
      // Confirm selection
      await setFontFamilyConfig(selected.label)
      window.showInformationMessage(`Font set to: ${selected.label}`)
    }
    else {
      // Restore original font setting
      await setFontFamilyConfig(originalFontFamily || 'monospace')
    }
  }

  // Register commands
  commands.registerCommand('vscode-font-family.loadFontFamilies', loadFontFamilies)
  commands.registerCommand('vscode-font-family.switchFontFamily', switchFontFamily)

  return {
    dispose: () => {
      statusBarItem.dispose()
    },
  }
})

export { activate, deactivate }
