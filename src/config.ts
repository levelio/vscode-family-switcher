import { defineConfigObject } from 'reactive-vscode'
import { workspace } from 'vscode'
import * as Meta from './generated/meta'

export const config = defineConfigObject<Meta.ScopedConfigKeyTypeMap>(
  Meta.scopedConfigs.scope,
  Meta.scopedConfigs.defaults,
)

export const CONFIG_SECTION = 'fontFamily'

export interface FontFamilyConfig {
  fontFamily: string
}

export function getFontFamilyConfig(): FontFamilyConfig {
  return workspace.getConfiguration().get<FontFamilyConfig>(CONFIG_SECTION) || {
    fontFamily: 'monospace',
  }
}

export async function setFontFamilyConfig(fontFamily: string) {
  await workspace.getConfiguration().update(
    'editor.fontFamily',
    fontFamily,
    true,
  )
}
