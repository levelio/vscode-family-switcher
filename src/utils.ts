import fontList from 'font-list'
import { useLogger } from 'reactive-vscode'
import { displayName } from './generated/meta'

export const logger = useLogger(displayName)

export async function getSystemFontFamilies(): Promise<string[]> {
  try {
    return await fontList.getFonts({ disableQuoting: true })
  }
  catch (error) {
    logger.error('getSystemFontFamilies error:', error)
    return []
  }
}
