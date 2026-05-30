'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLesson30Store } from '@/lib/store-30'
import {
  BLOCK2325_REMINDERS,
  BLOCK2325_MACROTEXT,
  BLOCK2325_PRACTICE,
} from '@/lib/lesson-data-30'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve the correct answer text for a practice item.
 *  If `answer` is a digit string (e.g. '2'), treat it as 1-based index into `options`.
 *  Otherwise, return `answer` directly (it is already the correct option text).
 */
function resolveCorrectAnswer(
  answer: string,
  options?: readonly string[]
): string {
  if (/^\d+$/.test(answer) && options && options.length > 0) {
    const idx = parseInt(answer, 10) - 1
    return options[idx] ?? answer
  }
  return answer
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MacrotextPracticeTask({
  task,
  index,
}: {
  task: (typeof BLOCK2325_PRACTICE)[number]
  index: number
}) {
  const { practiceAnswers, setPracticeAnswer } = useLesson30Store()

  const isMultipleChoice = 'options' in task && task.options && task.options.length > 0
  const existingAnswer = practiceAnswers[task.id]

  const [selected, setSelected] = useState<string | null>(null)
  const [openAnswer, setOpenAnswer] = useState('')
  const [checked, setChecked] = useState(false)

  const correctAnswer = resolveCorrectAnswer(task.answer, isMultipleChoice ? task.options : undefined)

  const handleCheck = useCallback(() => {
    const givenAnswer = isMultipleChoice ? selected : openAnswer.trim()
    if (!givenAnswer) return

    const isCorrect = isMultipleChoice
      ? givenAnswer === correctAnswer
      : givenAnswer.toLowerCase() === correctAnswer.toLowerCase()

    setChecked(true)
    setPracticeAnswer({
      questionId: task.id,
      blockId: 'block2325',
      answer: givenAnswer,
      mechanism: `Задание №${task.taskNumber}`,
      status: isCorrect ? 'correct' : 'incorrect',
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [selected, openAnswer, isMultipleChoice, correctAnswer, task, setPracticeAnswer])

  const handleRetry = useCallback(() => {
    setSelected(null)
    setOpenAnswer('')
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
            {task.taskNumber}
          </Badge>
          <CardTitle className="text-base flex-1">
            {task.question}
          </CardTitle>
          <div className="ml-auto shrink-0">{statusIcon}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Multiple choice — RadioGroup */}
        {isMultipleChoice && !checked && (
          <RadioGroup
            value={selected ?? undefined}
            onValueChange={setSelected}
            className="gap-2"
          >
            {task.options.map((option, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <RadioGroupItem value={option} id={`${task.id}-opt-${i}`} />
                <Label
                  htmlFor={`${task.id}-opt-${i}`}
                  className="text-sm font-normal cursor-pointer leading-snug"
                >
                  {i + 1}) {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {/* Multiple choice — checked result */}
        {isMultipleChoice && checked && (
          <div className="space-y-2">
            {task.options.map((option, i) => {
              const isCorrectOption = option === correctAnswer
              const wasSelected = selected === option

              let cls = 'rounded-lg border-2 p-3 text-sm transition-colors '
              if (isCorrectOption) {
                cls +=
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
              } else if (wasSelected && !isCorrectOption) {
                cls +=
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
              } else {
                cls += 'border-border opacity-50'
              }

              return (
                <div key={i} className={cls}>
                  {i + 1}) {option}
                </div>
              )
            })}
          </div>
        )}

        {/* Open answer — Input */}
        {!isMultipleChoice && !checked && (
          <div className="space-y-2">
            <Label htmlFor={`${task.id}-input`} className="text-sm text-muted-foreground">
              Введите ответ:
            </Label>
            <Input
              id={`${task.id}-input`}
              placeholder="Ваш ответ..."
              value={openAnswer}
              onChange={(e) => setOpenAnswer(e.target.value)}
              className="max-w-md"
            />
          </div>
        )}

        {/* Open answer — checked result */}
        {!isMultipleChoice && checked && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ваш ответ:</span>
              <span
                className={`text-sm font-medium ${
                  existingAnswer?.status === 'correct'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {existingAnswer?.answer}
              </span>
              {existingAnswer?.status === 'incorrect' && (
                <span className="text-sm text-muted-foreground">
                  (правильно: <strong className="text-emerald-600 dark:text-emerald-400">{correctAnswer}</strong>)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Check button */}
        {!checked && (
          <Button
            onClick={handleCheck}
            disabled={isMultipleChoice ? !selected : !openAnswer.trim()}
            className="w-full sm:w-auto"
          >
            Проверить
          </Button>
        )}

        {/* Result feedback */}
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
                <div className="flex items-start gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3">
                  <XCircle className="size-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                      Неправильно
                    </p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                      {task.explanation}
                    </p>
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Block2325MacrotextControl() {
  const {
    completedBlocks,
    markBlockCompleted,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLesson30Store()

  const [activeSection, setActiveSection] = useState<'reminders' | 'practice'>('reminders')

  const isCompleted = completedBlocks.includes('block2325')

  const answeredCount = BLOCK2325_PRACTICE.filter(
    (q) => practiceAnswers[q.id]
  ).length
  const allAnswered = answeredCount >= BLOCK2325_PRACTICE.length

  const handleComplete = useCallback(() => {
    markBlockCompleted('block2325')
  }, [markBlockCompleted])

  const sections = [
    { key: 'reminders' as const, label: 'Напоминания', shortLabel: 'Напом.', icon: Lightbulb },
    { key: 'practice' as const, label: 'Практика', shortLabel: 'Практ.', icon: Sparkles },
  ]

  const allSectionsVisited = sections.every((s) =>
    (visitedSections['block2325'] ?? []).includes(s.key)
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
                markSectionVisited('block2325', section.key)
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

      {/* Reminders Section */}
      <AnimatePresence mode="wait">
        {activeSection === 'reminders' && (
          <motion.div
            key="reminders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                Напоминания перед макротекстом
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Запомните эти правила перед выполнением заданий 23–25.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BLOCK2325_REMINDERS.map((reminder, i) => (
                <Card key={i} className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">
                        {i + 1}
                      </Badge>
                      <p className="text-sm font-medium leading-relaxed">{reminder}</p>
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
            {/* Macrotext */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="size-5" />
                  Текст для заданий 23–25
                </CardTitle>
                <CardDescription>
                  Внимательно прочитайте текст перед выполнением заданий
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-72 rounded-lg border p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {BLOCK2325_MACROTEXT.text}
                  </p>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Practice tasks */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4" />
              <span>Ответьте на вопросы по тексту</span>
            </div>

            <div className="space-y-4">
              {BLOCK2325_PRACTICE.map((task, i) => (
                <MacrotextPracticeTask key={task.id} task={task} index={i} />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="rounded-lg border bg-accent/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Прогресс практики</span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} из {BLOCK2325_PRACTICE.length} заданий
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(answeredCount / BLOCK2325_PRACTICE.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
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
            {allAnswered
              ? 'Все задания пройдены. Готовы завершить блок?'
              : `Осталось пройти ${BLOCK2325_PRACTICE.length - answeredCount} заданий`}
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
