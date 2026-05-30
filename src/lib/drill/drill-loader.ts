import type { DrillImportFile } from './drill-types'

let _cache: DrillImportFile | null = null

export async function loadDrillImport(): Promise<DrillImportFile> {
  if (_cache) return _cache

  const response = await fetch('/data/ege-drill-items.json')

  if (!response.ok) {
    throw new Error('Не удалось загрузить базу заданий')
  }

  const data: DrillImportFile = await response.json()
  _cache = data
  return data
}

/** Clear the in-memory cache (useful for testing) */
export function clearDrillCache(): void {
  _cache = null
}
