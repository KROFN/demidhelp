// ─── Drill data types (matches ege-drill-items.json shape) ──────────────────

export type DrillChoice = {
  id: string
  text: string
}

export type DrillItem = {
  id: string
  taskNumber: 4 | 5 | 9 | 11 | 12 | 14
  title: string
  target: string
  context: string
  prompt: string
  answerChoices: DrillChoice[]
  mechanismChoices: DrillChoice[]
  correctAnswerId: string
  correctMechanismId: string
  correctAnswerText: string
  correctMechanismText: string
  explanation: string
  wrongPathHint: string
  source: {
    type: string
    rawId: string
    sourceDocument: string
    sourceTaskNumber: number
  }
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  confidence: 'high' | 'medium' | 'low'
  needsManualReview: boolean
}

export type DrillImportMeta = {
  source: string
  generatedAt: string
  purpose: string
  totalInputItems: number
  finalCleanCount: number
  targetTaskNumbers: number[]
  includedTaskNumbers: number[]
  [key: string]: unknown
}

export type DrillImportFile = {
  meta: DrillImportMeta
  drillItems: DrillItem[]
}

// ─── Session / mode types ──────────────────────────────────────────────────

export type DrillMode = 'quick' | 'normal' | 'massacre' | 'errors'

export const DRILL_MODE_CONFIG: Record<DrillMode, { label: string; size: number }> = {
  quick: { label: 'Быстро', size: 10 },
  normal: { label: 'Норма', size: 15 },
  massacre: { label: 'Мясорубка', size: 30 },
  errors: { label: 'Ошибки', size: 15 },
}

// ─── Scoring ───────────────────────────────────────────────────────────────

export type DrillResultStatus = 'known' | 'guessed' | 'wrong'

export function computeResultStatus(
  answerCorrect: boolean,
  mechanismCorrect: boolean
): DrillResultStatus {
  if (!answerCorrect) return 'wrong'
  if (!mechanismCorrect) return 'guessed'
  return 'known'
}

// ─── Task metadata ─────────────────────────────────────────────────────────

export type TaskMeta = {
  number: 4 | 5 | 9 | 11 | 12 | 14
  title: string
  description: string
  emoji: string
}

export const TASK_META: Record<number, TaskMeta> = {
  4: { number: 4, title: 'Ударения', description: 'Орфоэпические нормы: ударение в слове', emoji: '🗣️' },
  5: { number: 5, title: 'Паронимы', description: 'Лексические нормы: паронимы', emoji: '📝' },
  9: { number: 9, title: 'Корни', description: 'Орфографические нормы: корни', emoji: '🌱' },
  11: { number: 11, title: 'Суффиксы', description: 'Орфографические нормы: суффиксы различных частей речи', emoji: '🔧' },
  12: { number: 12, title: 'Глаголы и причастия', description: 'Правописание личных окончаний глаголов и суффиксов причастий/деепричастий', emoji: '⚡' },
  14: { number: 14, title: 'Слитно/раздельно/дефис', description: 'Орфографические нормы: слитное, раздельное, дефисное написание', emoji: '🔗' },
}

// ─── Session item (item + user answer) ─────────────────────────────────────

export type SessionItemResult = {
  itemId: string
  taskNumber: number
  selectedAnswerId: string
  selectedMechanismId: string
  status: DrillResultStatus
  checkedAt: number
}

export type DrillSessionSummary = {
  id: string
  taskNumber: number
  mode: DrillMode
  startedAt: number
  completedAt: number
  totalItems: number
  knownCount: number
  guessedCount: number
  wrongCount: number
  results: SessionItemResult[]
}

// ─── Item progress (persisted) ─────────────────────────────────────────────

export type DrillItemProgress = {
  itemId: string
  taskNumber: number
  attempts: number
  knownCount: number
  guessedCount: number
  wrongCount: number
  lastStatus: DrillResultStatus
  lastReviewedAt: string
  mechanismMistakes: Record<string, number>
}
