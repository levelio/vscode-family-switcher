import type { ExtensionContext } from 'vscode'
import { defineConfigObject } from 'reactive-vscode'
import { workspace } from 'vscode'
import * as Meta from './generated/meta'

export const config = defineConfigObject<Meta.ScopedConfigKeyTypeMap>(
  Meta.scopedConfigs.scope,
  Meta.scopedConfigs.defaults,
)

export const EDITOR_FONT_FAMILY_CONFIG = 'editor.fontFamily'
export const TERMINAL_FONT_FAMILY_CONFIG = 'terminal.integrated.fontFamily'
export const FONT_WHITELIST_CONFIG = 'vfs.whitelist'
export const FONT_CACHE_KEY = 'vfs.fontCache'

// Global extension context to store state
let extensionContext: ExtensionContext

export function setExtensionContext(context: ExtensionContext) {
  extensionContext = context
}

export interface FontFamilyConfig {
  whitelist: string[]
  fontCache: string[]
}

export function getFontFamilyConfig(): FontFamilyConfig {
  const config = workspace.getConfiguration()
  return {
    whitelist: config.get<string[]>(FONT_WHITELIST_CONFIG) || [],
    fontCache: extensionContext ? (extensionContext.globalState.get<string[]>(FONT_CACHE_KEY) || []) : [],
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

export async function setFontWhitelist(whitelist: string[]) {
  const config = workspace.getConfiguration()
  await config.update(FONT_WHITELIST_CONFIG, whitelist, true)
}

export async function getFontWhitelist(): Promise<string[]> {
  const config = workspace.getConfiguration()
  return config.get<string[]>(FONT_WHITELIST_CONFIG) || []
}

export async function setFontCache(fonts: string[]) {
  if (!extensionContext) {
    console.error('Extension context not initialized')
    return
  }
  await extensionContext.globalState.update(FONT_CACHE_KEY, fonts)
}

export async function getFontCache(): Promise<string[]> {
  if (!extensionContext) {
    console.error('Extension context not initialized')
    return []
  }
  return extensionContext.globalState.get<string[]>(FONT_CACHE_KEY) || []
}

export async function hasFontCache(): Promise<boolean> {
  const cache = await getFontCache()
  return cache.length > 0
}
