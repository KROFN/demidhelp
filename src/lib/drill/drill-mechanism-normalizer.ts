/**
 * Mechanism normalization layer for /drill.
 *
 * Interposes between raw JSON data and UI/scoring to:
 * - Hide internal-only mechanism labels ("личная мина") from students
 * - Reduce overly granular mechanism choices for specific tasks
 * - Ensure scoring compares student-facing mechanism text, not raw IDs
 *
 * CRITICAL: This module never mutates original DrillItem objects.
 */

import type { DrillItem, DrillChoice } from './drill-types'

// ─── Normalization maps ────────────────────────────────────────────────────

const TASK4_NORMALIZE: Record<string, string> = {
  'личная мина': 'словарное ударение',
}

const TASK5_NORMALIZE: Record<string, string> = {
  'значение слова': 'значение слова',
  'лексическая сочетаемость': 'лексическая сочетаемость',
  'профессия/лицо': 'значение слова',
  'предмет/признак': 'значение слова',
  'действие/результат': 'значение слова',
  'личная мина': 'значение слова',
}

/** Visible mechanism choices for task 4 (order preserved, no "личная мина") */
const TASK4_VISIBLE_MECHANISMS: string[] = [
  'словарное ударение',
  'глагол прошедшего времени женского рода',
  'краткое причастие',
  'сравнительная степень',
  '-опровод',
  'заимствованное слово',
]

/** Visible mechanism choices for task 5 */
const TASK5_VISIBLE_MECHANISMS: string[] = [
  'значение слова',
  'лексическая сочетаемость',
]

/** Raw mechanisms that are subtypes (not shown as buttons, optionally shown in results) */
const TASK5_SUBTYPES = new Set(['профессия/лицо', 'предмет/признак', 'действие/результат', 'личная мина'])
const TASK4_SUBTYPES = new Set(['личная мина'])

// ─── Virtual choice ID helper ──────────────────────────────────────────────

function canonicalId(text: string): string {
  return `canonical:${text}`
}

// ─── Core exports ──────────────────────────────────────────────────────────

/**
 * Normalize a raw mechanism text into student-facing text.
 * For tasks without normalization rules, returns the original text unchanged.
 */
export function normalizeMechanismText(taskNumber: number, mechanismText: string): string {
  if (taskNumber === 4) {
    return TASK4_NORMALIZE[mechanismText] ?? mechanismText
  }
  if (taskNumber === 5) {
    return TASK5_NORMALIZE[mechanismText] ?? mechanismText
  }
  return mechanismText
}

/**
 * Get the list of visible mechanism choices for an item.
 * Returns virtual DrillChoice objects with canonical IDs.
 * For tasks without normalization, returns the original choices.
 */
export function getVisibleMechanismChoices(item: DrillItem): DrillChoice[] {
  if (item.taskNumber === 4) {
    return TASK4_VISIBLE_MECHANISMS.map((text) => ({
      id: canonicalId(text),
      text,
    }))
  }

  if (item.taskNumber === 5) {
    return TASK5_VISIBLE_MECHANISMS.map((text) => ({
      id: canonicalId(text),
      text,
    }))
  }

  // No normalization — return original choices
  return item.mechanismChoices
}

/**
 * Get the student-facing correct mechanism text for an item.
 */
export function getCorrectNormalizedMechanismText(item: DrillItem): string {
  return normalizeMechanismText(item.taskNumber, item.correctMechanismText)
}

/**
 * Get the student-facing text for a selected mechanism ID.
 * Handles both canonical IDs (normalized) and raw IDs (passthrough).
 */
export function getSelectedNormalizedMechanismText(
  item: DrillItem,
  selectedMechanismId: string
): string {
  // If it's a canonical ID, extract the text directly
  if (selectedMechanismId.startsWith('canonical:')) {
    return selectedMechanismId.slice('canonical:'.length)
  }

  // Otherwise look up in original mechanism choices (non-normalized tasks)
  const choice = item.mechanismChoices.find((c) => c.id === selectedMechanismId)
  if (choice) {
    // Still normalize the text for tasks 4/5
    return normalizeMechanismText(item.taskNumber, choice.text)
  }

  return selectedMechanismId
}

/**
 * Check whether the selected mechanism is correct using normalized comparison.
 */
export function isMechanismCorrect(item: DrillItem, selectedMechanismId: string): boolean {
  const selectedNorm = getSelectedNormalizedMechanismText(item, selectedMechanismId)
  const correctNorm = getCorrectNormalizedMechanismText(item)
  return selectedNorm === correctNorm
}

/**
 * Get the raw mechanism subtype for an item, if applicable.
 * Returns null for items where the raw mechanism is the same as the normalized one,
 * or for tasks without normalization.
 */
export function getRawMechanismSubtype(item: DrillItem): string | null {
  if (item.taskNumber === 4) {
    if (TASK4_SUBTYPES.has(item.correctMechanismText)) {
      return item.correctMechanismText
    }
    return null
  }

  if (item.taskNumber === 5) {
    if (TASK5_SUBTYPES.has(item.correctMechanismText)) {
      return item.correctMechanismText
    }
    return null
  }

  return null
}

/**
 * Get a supplementary hint for the result display when the raw mechanism
 * was a subtype that got normalized.
 */
export function getMechanismSupplementaryHint(item: DrillItem): string | null {
  const subtype = getRawMechanismSubtype(item)
  if (!subtype) return null

  if (item.taskNumber === 4 && subtype === 'личная мина') {
    return 'Это слово лучше учить как орфоэпическую норму.'
  }

  if (item.taskNumber === 5 && subtype) {
    return `Подтип: ${subtype}`
  }

  return null
}
