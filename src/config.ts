import type { ExtensionContext } from 'vscode'
import { workspace } from 'vscode'

export const EDITOR_FONT_FAMILY_CONFIG = 'editor.fontFamily'
export const TERMINAL_FONT_FAMILY_CONFIG = 'terminal.integrated.fontFamily'
export const FONT_FAVORITES_CONFIG = 'vfs.favorites'
export const FONT_CACHE_KEY = 'vfs.fontCache'

// Global extension context to store state
let extensionContext: ExtensionContext

export function setExtensionContext(context: ExtensionContext) {
  extensionContext = context
}

export interface FontFamilyConfig {
  favorites: string[]
  fontCache: string[]
}

export function getFontFamilyConfig(): FontFamilyConfig {
  const config = workspace.getConfiguration()
  return {
    favorites: config.get<string[]>(FONT_FAVORITES_CONFIG) || [],
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

export async function setFontFavorites(favorites: string[]) {
  const config = workspace.getConfiguration()
  await config.update(FONT_FAVORITES_CONFIG, favorites, true)
}

export async function getFontFavorites(): Promise<string[]> {
  const config = workspace.getConfiguration()
  return config.get<string[]>(FONT_FAVORITES_CONFIG) || []
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
