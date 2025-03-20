import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { useLogger } from 'reactive-vscode'
import { displayName } from './generated/meta'

export const logger = useLogger(displayName)

const execAsync = promisify(exec)

export async function getSystemFontFamilies(): Promise<string[]> {
  try {
    const { stdout } = await execAsync('fc-list :lang=zh : family | sort -u')
    return stdout.split('\n').filter(Boolean)
  }
  catch (error) {
    console.error('获取系统字体列表失败:', error)
    return []
  }
}
