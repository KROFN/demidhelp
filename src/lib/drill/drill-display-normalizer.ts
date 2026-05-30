/**
 * Display normalizer for /drill.
 *
 * Handles:
 * - №5 context masking (uppercase Cyrillic fragments → ____)
 * - Stable seeded shuffle of answerChoices
 * - Creating DisplayDrillItem wrappers that never mutate original items
 */

import type { DrillChoice, DrillItem } from './drill-types'

// ─── Display item type ─────────────────────────────────────────────────────

export type DisplayDrillItem = DrillItem & {
  displayContext: string
  displayTarget: string
  displayPrompt: string
  displayAnswerChoices: DrillChoice[]
  maskedFragments: string[]
}

// ─── Seeded random ─────────────────────────────────────────────────────────

function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Stable seeded shuffle — same seed always produces the same order.
 * Returns a new array; does NOT mutate input.
 */
export function shuffleChoicesStable(choices: DrillChoice[], seed: string): DrillChoice[] {
  const random = mulberry32(hashString(seed))
  const result = [...choices]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Create a session seed — generated once per session, not per render.
 */
export function createSessionSeed(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

// ─── №5 context masking ────────────────────────────────────────────────────

/**
 * Uppercase Cyrillic/Latin fragment detector.
 * Matches sequences of 3+ uppercase letters (Cyrillic + Latin + hyphen).
 * Uses the safe fallback regex (no lookbehind).
 */
const UPPERCASE_FRAGMENT_RE = /(^|[^А-ЯЁA-Z])([А-ЯЁA-Z][А-ЯЁA-Z\-]{2,})(?=$|[^А-ЯЁA-Z])/gu

/**
 * Mask uppercase paronym fragments in context for task №5.
 * Returns { masked, fragments }.
 */
export function maskParonymContext(
  context: string,
  target: string
): { masked: string; fragments: string[] } {
  if (!context) return { masked: context, fragments: [] }

  const fragments: string[] = []
  let result = context

  // Strategy 1: Try exact target replacement (case-sensitive)
  if (target.length >= 3 && context.includes(target)) {
    fragments.push(target)
    result = result.split(target).join('____')
    return { masked: result, fragments }
  }

  // Strategy 2: Try case-insensitive target replacement
  if (target.length >= 3) {
    const targetLower = target.toLowerCase()
    const contextLower = result.toLowerCase()
    const idx = contextLower.indexOf(targetLower)
    if (idx >= 0) {
      const originalFragment = result.slice(idx, idx + target.length)
      fragments.push(originalFragment)
      result = result.slice(0, idx) + '____' + result.slice(idx + target.length)
      return { masked: result, fragments }
    }
  }

  // Strategy 3: Replace all uppercase fragments >= 3 chars
  const matches = [...context.matchAll(UPPERCASE_FRAGMENT_RE)]
  if (matches.length > 0) {
    for (const match of matches) {
      const prefix = match[1] // character before the fragment (or empty for start)
      const fragment = match[2] // the uppercase fragment itself
      fragments.push(fragment)
    }
    // Replace from end to start to preserve indices
    result = context
    for (const match of [...matches].reverse()) {
      const fullMatch = match[0]
      const fragment = match[2]
      result = result.replace(fullMatch, match[1] + '____')
    }
    return { masked: result, fragments }
  }

  // Nothing found — return as-is
  return { masked: context, fragments: [] }
}

// ─── Per-field display getters ─────────────────────────────────────────────

export function getDisplayContext(item: DrillItem): string {
  if (item.taskNumber === 5 && item.context) {
    return maskParonymContext(item.context, item.target).masked
  }
  return item.context
}

export function getDisplayTarget(item: DrillItem): string {
  // For task №5 (paronyms), the target IS the answer — hide it so the
  // student must pick from answerChoices. Context masking replaces the
  // uppercase word with ____; showing the target would give it away.
  if (item.taskNumber === 5) return ''
  return item.target
}

export function getDisplayPrompt(item: DrillItem): string {
  if (item.taskNumber === 5) {
    return 'Вставьте подходящий пароним в пропуск и выберите механизм.'
  }
  return item.prompt
}

// ─── Create full display item ──────────────────────────────────────────────

/**
 * Create a DisplayDrillItem from a raw DrillItem.
 * This is the main entry point for the session flow.
 *
 * @param item — Original DrillItem (never mutated)
 * @param sessionSeed — Stable seed for the session
 * @param itemIndex — Index of the item in the session
 */
export function createDisplayItem(
  item: DrillItem,
  sessionSeed: string,
  itemIndex: number
): DisplayDrillItem {
  const shuffleSeed = `${sessionSeed}:${item.id}:${itemIndex}:answers`
  const shuffledChoices = shuffleChoicesStable(item.answerChoices, shuffleSeed)

  const { masked, fragments } =
    item.taskNumber === 5 && item.context
      ? maskParonymContext(item.context, item.target)
      : { masked: item.context, fragments: [] }

  return {
    ...item,
    displayContext: item.taskNumber === 5 ? masked : item.context,
    displayTarget: getDisplayTarget(item),
    displayPrompt: getDisplayPrompt(item),
    displayAnswerChoices: shuffledChoices,
    maskedFragments: fragments,
  }
}
