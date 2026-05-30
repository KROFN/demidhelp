'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ListOrdered,
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLesson30Store } from '@/lib/store-30'
import {
  BLOCK11_ALGORITHM,
  BLOCK11_WORKED_EXAMPLES,
  BLOCK11_PRACTICE,
  type Block11Mechanism,
} from '@/lib/lesson-data-30'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MECHANISM_LABELS: Record<Block11Mechanism, string> = {
  adjective: 'прилагательное',
  noun: 'существительное',
  verb: 'глагол',
  adverb: 'наречие',
  trap: 'исключение / мина',
}

const MECHANISM_OPTIONS: { value: Block11Mechanism; label: string }[] = [
  { value: 'adjective', label: 'прилагательное' },
  { value: 'noun', label: 'существительное' },
  { value: 'verb', label: 'глагол' },
  { value: 'adverb', label: 'наречие' },
  { value: 'trap', label: 'исключение / мина' },
]

/** Map algorithm steps to a part-of-speech group based on keywords */
function getStepGroup(step: string): string {
  if (step.includes('прилагательное')) return 'прилагательное'
  if (step.includes('существительное')) return 'существительное'
  if (step.includes('глагол')) return 'глагол'
  if (step.includes('наречие')) return 'наречие'
  return 'общее'
}

const GROUP_ORDER = ['общее', 'прилагательное', 'существительное', 'глагол', 'наречие']
const GROUP_ICONS: Record<string, string> = {
  общее: '🔍',
  прилагательное: '📎',
  существительное: '📦',
  глагол: '🏃',
  наречие: '🧭',
}

// ─── Practice Task Sub-component ─────────────────────────────────────────────

function PracticeTask({
  task,
  index,
}: {
  task: (typeof BLOCK11_PRACTICE)[number]
  index: number
}) {
  const {
    practiceAnswers,
    setPracticeAnswer,
    errorNotes,
    setErrorNote,
  } = useLesson30Store()

  const [answerInput, setAnswerInput] = useState('')
  const [mechanismInput, setMechanismInput] = useState<Block11Mechanism | ''>('')
  const [checked, setChecked] = useState(false)
  const [errorNoteInput, setErrorNoteInput] = useState('')

  const existingAnswer = practiceAnswers[task.id]
  const existingNote = errorNotes[task.id] ?? ''

  const handleCheck = useCallback(() => {
    if (!answerInput.trim() || !mechanismInput) return

    const isAnswerCorrect = answerInput.trim().toLowerCase() === task.answer.toLowerCase()
    const isMechanismCorrect = mechanismInput === task.mechanism
    const isCorrect = isAnswerCorrect && isMechanismCorrect

    setChecked(true)

    setPracticeAnswer({
      questionId: task.id,
      blockId: 'block11',
      answer: answerInput.trim(),
      mechanism: mechanismInput,
      status: isCorrect ? 'correct' : 'incorrect',
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [answerInput, mechanismInput, task, setPracticeAnswer])

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
            {index + 1}/{BLOCK11_PRACTICE.length}
          </Badge>
          <CardTitle className="text-lg">Вставьте букву и выберите механизм</CardTitle>
          <div className="ml-auto">{statusIcon}</div>
        </div>
        <CardDescription className="mt-2">
          <span className="text-base font-medium text-foreground tracking-wide">
            {task.word}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input and Select row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Ответ (слово целиком)
            </label>
            <Input
              placeholder="издавна"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              disabled={checked}
              className="text-sm"
            />
          </div>
          <div className="sm:w-52 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Механизм
            </label>
            <Select
              value={mechanismInput}
              onValueChange={(val) => setMechanismInput(val as Block11Mechanism)}
              disabled={checked}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Выберите..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Часть речи / тип</SelectLabel>
                  {MECHANISM_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Check button */}
        {!checked && (
          <Button
            onClick={handleCheck}
            disabled={!answerInput.trim() || !mechanismInput}
            className="w-full"
          >
            <CheckCircle2 className="size-4 mr-2" />
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
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
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
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        Неправильно
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400">
                        Правильный ответ: <strong>{task.answer}</strong>
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400">
                        Механизм: <strong>{task.mechanismLabel}</strong>
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                        {task.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Mechanism feedback — if mechanism was wrong but answer was right or vice versa */}
                  {existingAnswer && existingAnswer.mechanism !== task.mechanism && (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        Механизм определён неверно
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                        Вы выбрали: {MECHANISM_LABELS[existingAnswer.mechanism as Block11Mechanism] ?? existingAnswer.mechanism}.
                        Правильно: {task.mechanismLabel}.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error note field — only for incorrect answers */}
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

// ─── Main Component ─────────────────────────────────────────────────────────

type SectionKey = 'algorithm' | 'examples' | 'practice'

export default function Block11Suffixes() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLesson30Store()

  const [activeSection, setActiveSection] = useState<SectionKey>('algorithm')

  const isCompleted = completedBlocks.includes('block11')
  const progress = blockProgress['block11']

  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b11p')
  ).length

  const correctCount = Object.values(practiceAnswers).filter(
    (a) => a.questionId.startsWith('b11p') && a.status === 'correct'
  ).length

  const incorrectCount = Object.values(practiceAnswers).filter(
    (a) => a.questionId.startsWith('b11p') && a.status === 'incorrect'
  ).length

  const canComplete = answeredCount >= 6

  const handleComplete = useCallback(() => {
    markBlockCompleted('block11')
  }, [markBlockCompleted])

  const sections: { key: SectionKey; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { key: 'algorithm', label: 'Алгоритм', shortLabel: 'Алг.', icon: ListOrdered },
    { key: 'examples', label: 'Примеры', shortLabel: 'Прим.', icon: BookOpen },
    { key: 'practice', label: 'Практика', shortLabel: 'Прак.', icon: Sparkles },
  ]

  const allSectionsVisited = sections.every((s) =>
    (visitedSections['block11'] ?? []).includes(s.key)
  )

  // Group algorithm steps by part of speech
  const groupedSteps: Record<string, string[]> = {}
  BLOCK11_ALGORITHM.forEach((step, i) => {
    const group = getStepGroup(step)
    if (!groupedSteps[group]) groupedSteps[group] = []
    groupedSteps[group].push(`${i + 1}. ${step}`)
  })

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
                markSectionVisited('block11', section.key)
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

      {/* Sections */}
      <AnimatePresence mode="wait">
        {/* Algorithm Section */}
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
                Сначала часть речи!
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Не спрашивай &laquo;какая буква?&raquo;. Сначала спроси: &laquo;что это за форма?&raquo;
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Алгоритм решения задания №11</CardTitle>
                <CardDescription>
                  Определи часть речи → примени правило → запиши ответ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {GROUP_ORDER.map((group) => {
                  const steps = groupedSteps[group]
                  if (!steps || steps.length === 0) return null
                  return (
                    <div key={group} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{GROUP_ICONS[group]}</span>
                        <h4 className="text-sm font-semibold text-foreground capitalize">
                          {group}
                        </h4>
                      </div>
                      <ol className="space-y-1.5 pl-2">
                        {steps.map((step) => (
                          <li
                            key={step}
                            className="text-sm text-muted-foreground leading-relaxed"
                          >
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Examples Section */}
        {activeSection === 'examples' && (
          <motion.div
            key="examples"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="size-4" />
              <span>Разобранные примеры — изучите ход рассуждения</span>
            </div>

            <div className="space-y-3">
              {BLOCK11_WORKED_EXAMPLES.map((example) => (
                <Card key={example.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {example.mechanismLabel}
                      </Badge>
                      <CardTitle className="text-base font-semibold">
                        {example.word} → <span className="text-emerald-600 dark:text-emerald-400">{example.answer}</span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {example.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Practice Section */}
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
                Вставьте пропущенную букву и выберите механизм (часть речи / тип). Нужно правильно заполнить и то, и другое.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PenLine className="size-4" />
              <span>
                Впишите слово целиком и выберите механизм для каждого задания
              </span>
            </div>

            <div className="space-y-4">
              {BLOCK11_PRACTICE.map((task, i) => (
                <PracticeTask key={task.id} task={task} index={i} />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="rounded-lg border bg-accent/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Прогресс практики</span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} из {BLOCK11_PRACTICE.length} заданий
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(answeredCount / BLOCK11_PRACTICE.length) * 100}%`,
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {canComplete
              ? 'Достаточно заданий пройдено. Готовы завершить блок?'
              : `Осталось пройти минимум ${6 - answeredCount} заданий из 8`}
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
