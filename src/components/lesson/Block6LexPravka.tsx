'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  PenLine,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { useLessonStore } from '@/lib/store'
import { BLOCK6_PLEONASMS, BLOCK6_COLLOCATIONS, BLOCK6_PRACTICE, BLOCK6_TRAINING_EXAMPLES, block6Content } from '@/lib/lesson-data'

// ─── Types ───────────────────────────────────────────────────────────────────

type ErrorTypeOption = 'pleonasm' | 'collocation'

interface PracticeState {
  answer: string
  errorType: ErrorTypeOption | ''
  explanation: string
  checked: boolean
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PleonasmExample({
  item,
}: {
  item: (typeof BLOCK6_PLEONASMS)[number]
}) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-base font-semibold text-foreground">{item.phrase}</span>
        <Badge variant="outline" className="text-xs border-rose-300 text-rose-600 dark:border-rose-700 dark:text-rose-400">
          лишнее: {item.extraWord}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-rose-600 dark:text-rose-400 line-through">{item.extraWord}</span>
        <ArrowRight className="size-4 text-muted-foreground shrink-0" />
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{item.correct}</span>
      </div>
      <p className="text-xs text-muted-foreground">{item.explanation}</p>
    </div>
  )
}

function CollocationExample({
  item,
}: {
  item: (typeof BLOCK6_COLLOCATIONS)[number]
}) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-base font-semibold text-foreground">{item.phrase}</span>
        <Badge variant="outline" className="text-xs border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400">
          замена
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-rose-600 dark:text-rose-400 line-through">{item.wrongWord}</span>
        <ArrowRight className="size-4 text-muted-foreground shrink-0" />
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{item.correctWord}</span>
      </div>
      <p className="text-xs text-muted-foreground">{item.explanation}</p>
    </div>
  )
}

function PracticeQuestion({
  question,
  index,
}: {
  question: (typeof BLOCK6_PRACTICE)[number]
  index: number
}) {
  const {
    practiceAnswers,
    setPracticeAnswer,
    errorNotes,
    setErrorNote,
  } = useLessonStore()

  const existingAnswer = practiceAnswers[question.id]
  const existingNote = errorNotes[question.id] ?? ''

  // If already answered, initialize with restored state
  const [state, setState] = useState<PracticeState>(() => {
    if (existingAnswer) {
      return {
        answer: existingAnswer.answer,
        errorType: (existingAnswer as Record<string, unknown>).errorType as ErrorTypeOption ?? '',
        explanation: (existingAnswer as Record<string, unknown>).explanation as string ?? '',
        checked: true,
      }
    }
    return {
      answer: '',
      errorType: '',
      explanation: '',
      checked: false,
    }
  })

  const handleCheck = useCallback(() => {
    if (!state.answer.trim() || !state.errorType) return

    const answerCorrect = state.answer.trim().toLowerCase() === question.answer.toLowerCase()
    const typeCorrect =
      (question.errorType === 'pleonasm' && state.errorType === 'pleonasm') ||
      (question.errorType === 'collocation' && state.errorType === 'collocation')

    let status: 'correct' | 'incorrect' = 'incorrect'
    if (answerCorrect && typeCorrect) {
      status = 'correct'
    } else if (answerCorrect || typeCorrect) {
      status = 'incorrect'
    }

    setState((prev) => ({ ...prev, checked: true }))

    setPracticeAnswer({
      questionId: question.id,
      blockId: 'block6',
      answer: state.answer.trim(),
      status,
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [state, question, setPracticeAnswer])

  const handleRetry = useCallback(() => {
    setState({
      answer: '',
      errorType: '',
      explanation: '',
      checked: false,
    })
  }, [])

  const handleNoteChange = useCallback(
    (value: string) => {
      setErrorNote(question.id, value)
    },
    [question.id, setErrorNote]
  )

  const answerCorrect = existingAnswer?.status === 'correct'
  const answerIncorrect = existingAnswer?.status === 'incorrect'

  const statusIcon = state.checked ? (
    answerCorrect ? (
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
            {index + 1}/{BLOCK6_PRACTICE.length}
          </Badge>
          <CardTitle className="text-lg">Найдите и исправьте ошибку</CardTitle>
          <div className="ml-auto">{statusIcon}</div>
        </div>
        <CardDescription className="mt-2">
          <span className="text-base font-medium text-foreground leading-relaxed">
            {question.sentence}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Answer input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Слово, которое нужно выписать (убрать или заменить):
          </label>
          <Input
            placeholder="Введите слово..."
            value={state.answer}
            onChange={(e) => setState((prev) => ({ ...prev, answer: e.target.value }))}
            disabled={state.checked}
            className="text-sm"
          />
        </div>

        {/* Error type selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Тип ошибки:
          </label>
          <RadioGroup
            value={state.errorType}
            onValueChange={(value) =>
              setState((prev) => ({ ...prev, errorType: value as ErrorTypeOption }))
            }
            disabled={state.checked}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            {[
              { value: 'pleonasm', label: 'Плеоназм', desc: 'лишнее слово' },
              { value: 'collocation', label: 'Неверная сочетаемость', desc: 'замена слова' },
            ].map((option) => (
              <div key={option.value} className="flex items-start gap-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label
                  htmlFor={`${question.id}-${option.value}`}
                  className="text-sm font-normal cursor-pointer leading-tight"
                >
                  {option.label}
                  {option.desc && (
                    <span className="block text-xs text-muted-foreground">{option.desc}</span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Explanation textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Объясните, почему это ошибка:
          </label>
          <Textarea
            placeholder="Напишите объяснение..."
            value={state.explanation}
            onChange={(e) =>
              setState((prev) => ({ ...prev, explanation: e.target.value }))
            }
            disabled={state.checked}
            className="text-sm min-h-[60px]"
          />
        </div>

        {/* Check button */}
        {!state.checked && (
          <Button
            onClick={handleCheck}
            disabled={!state.answer.trim() || !state.errorType}
            className="w-full"
          >
            <Sparkles className="size-4 mr-2" />
            Проверить
          </Button>
        )}

        {/* Result */}
        <AnimatePresence>
          {state.checked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {answerCorrect ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Правильно!
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3">
                    <XCircle className="size-5 text-rose-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        Неправильно
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                        Правильный ответ: <strong>{question.answer}</strong>
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                        Тип ошибки:{' '}
                        <strong>
                          {question.errorType === 'pleonasm' ? 'плеоназм' : 'неверная сочетаемость'}
                        </strong>
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{question.explanation}</p>
                </div>
              )}

              {/* Error note — only for incorrect answers */}
              {existingAnswer?.status === 'incorrect' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Моя ошибка / что запомнить
                  </label>
                  <Textarea
                    placeholder="Запишите, в чём ошиблись и как запомнить..."
                    defaultValue={existingNote}
                    onBlur={(e) => handleNoteChange(e.target.value)}
                    className="text-sm min-h-[60px]"
                  />
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

export default function Block6LexPravka() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLessonStore()

  const [activeSection, setActiveSection] = useState<'theory' | 'practice'>('theory')

  const isCompleted = completedBlocks.includes('block6')
  const progress = blockProgress['block6']
  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b6p')
  ).length
  const allAnswered = answeredCount >= BLOCK6_PRACTICE.length

  const handleComplete = useCallback(() => {
    markBlockCompleted('block6')
  }, [markBlockCompleted])

  const sections = [
    { key: 'theory' as const, label: 'Теория', shortLabel: 'Теор.', icon: BookOpen },
    { key: 'practice' as const, label: 'Тренировка', shortLabel: 'Трен.', icon: PenLine },
  ]

  const allSectionsVisited = sections.every((s) => (visitedSections['block6'] ?? []).includes(s.key))

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
                markSectionVisited('block6', section.key)
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

      <AnimatePresence mode="wait">
        {/* Theory Section */}
        {activeSection === 'theory' && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Type 1: Pleonasm */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 border-rose-300">
                    Тип 1
                  </Badge>
                  <CardTitle className="text-lg">Плеоназм</CardTitle>
                </div>
                <CardDescription>
                  {block6Content.definitions.pleonasm}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {BLOCK6_PLEONASMS.map((item) => (
                    <PleonasmExample key={item.id} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Type 2: Collocation */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-amber-300">
                    Тип 2
                  </Badge>
                  <CardTitle className="text-lg">Неверная сочетаемость</CardTitle>
                </div>
                <CardDescription>
                  {block6Content.definitions.collocation}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3">
                  {BLOCK6_COLLOCATIONS.map((item) => (
                    <CollocationExample key={item.id} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Rule Alert */}
            <Alert className="border-rose-300 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800">
              <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
              <AlertTitle className="text-rose-800 dark:text-rose-300">
                {block6Content.warnings?.[0]?.title}
              </AlertTitle>
              <AlertDescription className="text-rose-700 dark:text-rose-400 space-y-1">
                <p>
                  {block6Content.whatToWriteRule.excludeInstruction}
                </p>
                <p>
                  {block6Content.whatToWriteRule.replaceInstruction}
                </p>
              </AlertDescription>
            </Alert>

            {/* Visual Hint */}
            <Alert className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800">
              <Lightbulb className="size-4 text-emerald-600 dark:text-emerald-400" />
              <AlertTitle className="text-emerald-800 dark:text-emerald-300">
                Подсказка-алгоритм
              </AlertTitle>
              <AlertDescription className="text-emerald-700 dark:text-emerald-400">
                {block6Content.searchAlgorithm}
              </AlertDescription>
            </Alert>
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
            {/* Visual Hint always visible during training */}
            <Alert className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800">
              <Lightbulb className="size-4 text-emerald-600 dark:text-emerald-400" />
              <AlertDescription className="text-emerald-700 dark:text-emerald-400 text-sm">
                {block6Content.searchAlgorithm}
              </AlertDescription>
            </Alert>

            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
                {block6Content.trainingHint}
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PenLine className="size-4" />
              <span>
                Найдите ошибку в каждом предложении: выписать слово и определить тип ошибки
              </span>
            </div>

            <div className="space-y-4">
              {BLOCK6_PRACTICE.map((question, i) => (
                <PracticeQuestion key={question.id} question={question} index={i} />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="rounded-lg border bg-accent/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Прогресс тренировки</span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} из {BLOCK6_TRAINING_EXAMPLES.length} мини-примеров
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(answeredCount / BLOCK6_PRACTICE.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  {progress.correctCount} правильно
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="size-3 text-rose-500" />
                  {progress.incorrectCount} неправильно
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
            {allAnswered
              ? 'Все мини-примеры пройдены. Готовы завершить блок?'
              : `Осталось пройти ${BLOCK6_TRAINING_EXAMPLES.length - answeredCount} мини-примеров`}
          </p>
          {allAnswered && !allSectionsVisited && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Совет: посетите все вкладки блока перед завершением
            </p>
          )}
        </div>
        <Button
          onClick={handleComplete}
          disabled={isCompleted || !allAnswered}
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
