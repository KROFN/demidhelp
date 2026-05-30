import type { DrillItem, DrillMode, DrillItemProgress, DrillImportMeta } from './drill-types'
import { DRILL_MODE_CONFIG } from './drill-types'

// ─── Basic selectors ───────────────────────────────────────────────────────

export function getItemsByTask(items: DrillItem[], taskNumber: number): DrillItem[] {
  return items.filter((i) => i.taskNumber === taskNumber)
}

export function getTaskCounts(items: DrillItem[]): Record<number, number> {
  const counts: Record<number, number> = {}
  for (const item of items) {
    counts[item.taskNumber] = (counts[item.taskNumber] || 0) + 1
  }
  return counts
}

export function getMechanismStats(
  items: DrillItem[],
  taskNumber: number
): Record<string, number> {
  const stats: Record<string, number> = {}
  const filtered = getItemsByTask(items, taskNumber)
  for (const item of filtered) {
    const mech = item.correctMechanismText
    stats[mech] = (stats[mech] || 0) + 1
  }
  return stats
}

// ─── Shuffle ───────────────────────────────────────────────────────────────

/** Fisher-Yates shuffle, returns a new array */
export function shuffleItems<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ─── Disabled items filter ─────────────────────────────────────────────────

function filterDisabled(items: DrillItem[], disabledIds: Record<string, true>): DrillItem[] {
  return items.filter((i) => !disabledIds[i.id])
}

// ─── Error items ───────────────────────────────────────────────────────────

export function getErrorItems(
  items: DrillItem[],
  taskNumber: number,
  progress: Record<string, DrillItemProgress>,
  disabledIds?: Record<string, true>
): DrillItem[] {
  let taskItems = getItemsByTask(items, taskNumber)
  if (disabledIds) {
    taskItems = filterDisabled(taskItems, disabledIds)
  }
  const wrong: DrillItem[] = []
  const guessed: DrillItem[] = []

  for (const item of taskItems) {
    const p = progress[item.id]
    if (!p) continue
    if (p.wrongCount > 0) {
      wrong.push(item)
    } else if (p.guessedCount > 0) {
      guessed.push(item)
    }
  }

  // Wrong first, then guessed
  return [...wrong, ...guessed]
}

// ─── Session creation ──────────────────────────────────────────────────────

export function createSession(
  items: DrillItem[],
  taskNumber: number,
  mode: DrillMode,
  progress: Record<string, DrillItemProgress>,
  disabledIds?: Record<string, true>
): DrillItem[] {
  const config = DRILL_MODE_CONFIG[mode]

  if (mode === 'errors') {
    const errorItems = getErrorItems(items, taskNumber, progress, disabledIds)
    // Shuffle error items, take up to config.size
    return shuffleItems(errorItems).slice(0, config.size)
  }

  // quick/normal/massacre: filter disabled + needsManualReview, shuffle, slice
  let taskItems = getItemsByTask(items, taskNumber)
    .filter((i) => !i.needsManualReview)

  if (disabledIds) {
    taskItems = filterDisabled(taskItems, disabledIds)
  }

  return shuffleItems(taskItems).slice(0, config.size)
}

// ─── Validation helpers ────────────────────────────────────────────────────

export function validateDrillData(meta: DrillImportMeta, items: DrillItem[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Total count
  if (items.length !== 1228) {
    errors.push(`Expected 1228 items, got ${items.length}`)
  }

  // Task counts
  const expectedCounts: Record<number, number> = {
    4: 300, 5: 87, 9: 120, 11: 214, 12: 128, 14: 379,
  }
  const counts = getTaskCounts(items)
  for (const [task, expected] of Object.entries(expectedCounts)) {
    if (counts[Number(task)] !== expected) {
      errors.push(`Task ${task}: expected ${expected}, got ${counts[Number(task)] ?? 0}`)
    }
  }

  // Duplicate IDs
  const ids = items.map((i) => i.id)
  const uniqueIds = new Set(ids)
  if (ids.length !== uniqueIds.size) {
    errors.push(`Duplicate IDs: ${ids.length - uniqueIds.size}`)
  }

  // needsManualReview
  const needsReview = items.filter((i) => i.needsManualReview)
  if (needsReview.length > 0) {
    errors.push(`needsManualReview: true count: ${needsReview.length}`)
  }

  // Linkage
  let linkageErrors = 0
  for (const item of items) {
    const answerChoice = item.answerChoices.find((c) => c.id === item.correctAnswerId)
    const mechChoice = item.mechanismChoices.find((c) => c.id === item.correctMechanismId)
    if (!answerChoice || answerChoice.text !== item.correctAnswerText) linkageErrors++
    if (!mechChoice || mechChoice.text !== item.correctMechanismText) linkageErrors++
  }
  if (linkageErrors > 0) {
    errors.push(`Linkage errors: ${linkageErrors}`)
  }

  return { valid: errors.length === 0, errors }
}
