import { defineConfigObject } from 'reactive-vscode'
import { workspace } from 'vscode'
import * as Meta from './generated/meta'

export const config = defineConfigObject<Meta.ScopedConfigKeyTypeMap>(
  Meta.scopedConfigs.scope,
  Meta.scopedConfigs.defaults,
)

export const EDITOR_FONT_FAMILY_CONFIG = 'editor.fontFamily'
export const TERMINAL_FONT_FAMILY_CONFIG = 'terminal.integrated.fontFamily'
export const FONT_BLACKLIST_CONFIG = 'vfs.blacklist'

export interface FontFamilyConfig {
  editorFontFamily: string
  terminalFontFamily: string
  blacklist: string[]
}

export function getFontFamilyConfig(): FontFamilyConfig {
  const config = workspace.getConfiguration()
  return {
    editorFontFamily: config.get<string>(EDITOR_FONT_FAMILY_CONFIG) || 'monospace',
    terminalFontFamily: config.get<string>(TERMINAL_FONT_FAMILY_CONFIG) || 'monospace',
    blacklist: config.get<string[]>(FONT_BLACKLIST_CONFIG) || [],
  }
}

export async function setFontFamilyConfig(fontFamily: string | string[]) {
  const config = workspace.getConfiguration()
  const fontFamilyString = Array.isArray(fontFamily) ? fontFamily.filter(Boolean).join(', ') : fontFamily
  await config.update(EDITOR_FONT_FAMILY_CONFIG, fontFamilyString, true)
}

export async function setTerminalFontFamilyConfig(fontFamily: string | string[]) {
  const config = workspace.getConfiguration()
  const fontFamilyString = Array.isArray(fontFamily) ? fontFamily.filter(Boolean).join(', ') : fontFamily
  await config.update(TERMINAL_FONT_FAMILY_CONFIG, fontFamilyString, true)
}

export async function setFontBlacklist(blacklist: string[]) {
  const config = workspace.getConfiguration()
  await config.update(FONT_BLACKLIST_CONFIG, blacklist, true)
}

export async function getFontBlacklist(): Promise<string[]> {
  const config = workspace.getConfiguration()
  return config.get<string[]>(FONT_BLACKLIST_CONFIG) || []
}
