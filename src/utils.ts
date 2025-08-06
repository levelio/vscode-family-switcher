import * as fontList from 'font-list'

export async function getSystemFontFamilies(): Promise<string[]> {
  try {
    return await fontList.getFonts({ disableQuoting: true })
  }
  catch (error) {
    console.error('getSystemFontFamilies error:', error)
    return []
  }
}
