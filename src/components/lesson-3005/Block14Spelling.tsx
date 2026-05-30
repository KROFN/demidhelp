'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  XCircle,
  AlertTriangle,
  Sparkles,
  ListChecks,
  PenLine,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLesson30Store } from '@/lib/store-30'
import {
  BLOCK14_ALGORITHM,
  BLOCK14_WORKED_EXAMPLES,
  BLOCK14_PRACTICE,
  type Block14Mechanism,
} from '@/lib/lesson-data-30'

// ─── Mechanism label mapping ─────────────────────────────────────────────────

const MECHANISM_LABELS: Record<Block14Mechanism, string> = {
  conjunction: 'союз',
  adverb: 'наречие',
  preposition: 'предлог',
  'pronoun-preposition': 'местоимение с предлогом',
  particle: 'частица',
  hyphen: 'дефисная модель',
  pol: 'пол-',
}

const MECHANISM_KEYS = Object.keys(MECHANISM_LABELS) as Block14Mechanism[]

// ─── Algorithm step grouping ─────────────────────────────────────────────────

const ALGORITHM_GROUPS: { label: string; icon: string; stepIndices: number[] }[] = [
  { label: 'Союз', icon: '🔗', stepIndices: [1] },
  { label: 'Наречие', icon: '📍', stepIndices: [4] },
  { label: 'Предлог', icon: '📐', stepIndices: [3] },
  { label: 'Местоимение с предлогом / частицей', icon: '👤', stepIndices: [2] },
  { label: 'Частица', icon: '✨', stepIndices: [] },
  { label: 'Дефисная модель', icon: '➖', stepIndices: [5] },
  { label: 'Пол-', icon: '🔤', stepIndices: [6] },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function ExampleCard({
  example,
}: {
  example: (typeof BLOCK14_WORKED_EXAMPLES)[number]
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs shrink-0">
            {MECHANISM_LABELS[example.mechanism]}
          </Badge>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4 text-muted-foreground" />
          </motion.div>
        </div>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {example.prompt}
        </CardDescription>
      </CardHeader>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardContent className="pt-0 space-y-3">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                  Слово / конструкция
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                  {example.word}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                  Ответ
                </p>
                <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                  {example.answer}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                  Механизм
                </p>
                <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
                  {example.mechanismLabel}
                </p>
              </div>
              <div className="rounded-lg bg-muted border p-3">
                <p className="text-sm text-foreground">
                  {example.explanation}
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function PracticeTask({
  task,
  index,
}: {
  task: (typeof BLOCK14_PRACTICE)[number]
  index: number
}) {
  const {
    practiceAnswers,
    setPracticeAnswer,
    errorNotes,
    setErrorNote,
  } = useLesson30Store()

  const [answerInput, setAnswerInput] = useState('')
  const [mechanismInput, setMechanismInput] = useState<Block14Mechanism | ''>('')
  const [checked, setChecked] = useState(false)
  const [errorNoteInput, setErrorNoteInput] = useState('')

  const existingAnswer = practiceAnswers[task.id]
  const existingNote = errorNotes[task.id] ?? ''

  const answerIsCorrect =
    answerInput.trim().toLowerCase() === task.answer.toLowerCase()
  const mechanismIsCorrect = mechanismInput === task.mechanism
  const isCorrect = answerIsCorrect && mechanismIsCorrect

  const handleCheck = useCallback(() => {
    if (!answerInput.trim() || !mechanismInput) return
    setChecked(true)

    setPracticeAnswer({
      questionId: task.id,
      blockId: 'block14',
      answer: answerInput.trim(),
      mechanism: mechanismInput,
      status: isCorrect ? 'correct' : 'incorrect',
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [answerInput, mechanismInput, task, isCorrect, setPracticeAnswer])

  const handleSaveErrorNote = useCallback(() => {
    if (errorNoteInput.trim()) {
      setErrorNote(task.id, errorNoteInput.trim())
    }
  }, [task.id, errorNoteInput, setErrorNote])

  const handleRetry = useCallback(() => {
    setAnswerInput('')
    setMechanismInput('')
    setChecked(false)
  }, [])

  const statusIcon = checked ? (
    existingAnswer?.status === 'correct' ? (
      <CheckCircle2 className="size-5 text-emerald-500" />
    ) : (
      <XCircle className="size-5 text-rose-500" />
    )
  ) : null

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs shrink-0">
            {index + 1}/{BLOCK14_PRACTICE.length}
          </Badge>
          <CardTitle className="text-base">Задание №14</CardTitle>
          <div className="ml-auto">{statusIcon}</div>
        </div>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {task.prompt}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Answer input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Напишите слово / конструкцию с правильным написанием
          </label>
          <Input
            placeholder="например: так же — раздельно"
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            disabled={checked}
            className="text-sm"
          />
        </div>

        {/* Mechanism selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Выберите механизм
          </label>
          <Select
            value={mechanismInput}
            onValueChange={(val) => setMechanismInput(val as Block14Mechanism)}
            disabled={checked}
          >
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Выберите тип..." />
            </SelectTrigger>
            <SelectContent>
              {MECHANISM_KEYS.map((key) => (
                <SelectItem key={key} value={key}>
                  {MECHANISM_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check button */}
        {!checked && (
          <Button
            onClick={handleCheck}
            disabled={!answerInput.trim() || !mechanismInput}
            className="w-full"
          >
            <PenLine className="size-4 mr-2" />
            Проверить
          </Button>
        )}

        {/* Result */}
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {existingAnswer?.status === 'correct' ? (
                <div className="flex items-start gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Правильно!
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {task.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3">
                    <XCircle className="size-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        Неправильно
                      </p>
                      {!answerIsCorrect && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                          Правильный ответ: <strong>{task.answer}</strong>
                        </p>
                      )}
                      {!mechanismIsCorrect && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                          Механизм: <strong>{MECHANISM_LABELS[task.mechanism]}</strong>
                        </p>
                      )}
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                        {task.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error note — only for incorrect answers */}
              {existingAnswer?.status === 'incorrect' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Моя ошибка / что запомнить
                  </label>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Запишите, в чём ошиблись и как запомнить..."
                      value={errorNoteInput || existingNote}
                      onChange={(e) => setErrorNoteInput(e.target.value)}
                      onBlur={handleSaveErrorNote}
                      className="text-sm min-h-[60px]"
                    />
                  </div>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={handleRetry}>
                Попробовать снова
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Block14Spelling() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLesson30Store()

  const [activeSection, setActiveSection] = useState<
    'algorithm' | 'examples' | 'practice'
  >('algorithm')

  const isCompleted = completedBlocks.includes('block14')
  const progress = blockProgress['block14']

  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b14p')
  ).length

  const correctCount = progress.correctCount
  const incorrectCount = progress.incorrectCount

  const canComplete = answeredCount >= 6

  const handleComplete = useCallback(() => {
    markBlockCompleted('block14')
  }, [markBlockCompleted])

  const sections = [
    {
      key: 'algorithm' as const,
      label: 'Алгоритм',
      shortLabel: 'Алг.',
      icon: BookOpen,
    },
    {
      key: 'examples' as const,
      label: 'Примеры',
      shortLabel: 'Прим.',
      icon: ListChecks,
    },
    {
      key: 'practice' as const,
      label: 'Практика',
      shortLabel: 'Практ.',
      icon: Sparkles,
    },
  ]

  const allSectionsVisited = sections.every((s) =>
    (visitedSections['block14'] ?? []).includes(s.key)
  )

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.key}
              onClick={() => {
                setActiveSection(section.key)
                markSectionVisited('block14', section.key)
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors flex-1 justify-center ${
                activeSection === section.key
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              <span className="sm:hidden text-xs">{section.shortLabel}</span>
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          )
        })}
      </div>

      {/* Section content */}
      <AnimatePresence mode="wait">
        {/* ── Algorithm Section ── */}
        {activeSection === 'algorithm' && (
          <motion.div
            key="algorithm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                Алгоритм: Слитно, раздельно, дефис
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Сначала определи часть речи, потом решай написание.
              </AlertDescription>
            </Alert>

            {/* General steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Шаги алгоритма</CardTitle>
                <CardDescription>
                  Общий порядок определения написания
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {BLOCK14_ALGORITHM.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Grouped rules */}
            <div className="space-y-3">
              {ALGORITHM_GROUPS.filter((g) => g.stepIndices.length > 0).map(
                (group) => (
                  <Card key={group.label}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <span>{group.icon}</span>
                        {group.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {group.stepIndices.map((idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span className="text-primary font-medium shrink-0">
                              Шаг {idx + 1}:
                            </span>
                            <span>{BLOCK14_ALGORITHM[idx]}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </motion.div>
        )}

        {/* ── Examples Section ── */}
        {activeSection === 'examples' && (
          <motion.div
            key="examples"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800">
              <ListChecks className="size-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
                Разбор примеров: нажмите на карточку, чтобы увидеть ответ и объяснение.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BLOCK14_WORKED_EXAMPLES.map((example) => (
                <ExampleCard key={example.id} example={example} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Practice Section ── */}
        {activeSection === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
                Определите написание и механизм для каждого задания. Нужно пройти минимум 6 из 8.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4" />
              <span>
                Напишите правильный ответ и выберите механизм
              </span>
            </div>

            <div className="space-y-4">
              {BLOCK14_PRACTICE.map((task, i) => (
                <PracticeTask key={task.id} task={task} index={i} />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="rounded-lg border bg-accent/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Прогресс практики</span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} из {BLOCK14_PRACTICE.length} заданий
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(answeredCount / BLOCK14_PRACTICE.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  {correctCount} правильно
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="size-3 text-rose-500" />
                  {incorrectCount} неправильно
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Separator />

      {/* Complete Block */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {canComplete
              ? 'Минимум 6 заданий пройдено. Готовы завершить блок?'
              : `Осталось пройти ещё ${Math.max(0, 6 - answeredCount)} заданий для завершения`}
          </p>
          {canComplete && !allSectionsVisited && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Совет: посетите все вкладки блока перед завершением
            </p>
          )}
        </div>
        <Button
          onClick={handleComplete}
          disabled={isCompleted || !canComplete}
          variant={isCompleted ? 'outline' : 'default'}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              Блок пройден
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              Завершить блок
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
