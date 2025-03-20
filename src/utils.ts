import { useLogger } from 'reactive-vscode'
import { displayName } from './generated/meta'
// @ts-ignore
import { allFamilies } from './lib/font-finder.node'

export const logger = useLogger(displayName)

export async function getSystemFontFamilies(): Promise<string[]> {
  try {
    return await allFamilies()
  }
  catch (error) {
    console.error('获取系统字体列表失败:', error)
    return []
  }
}
