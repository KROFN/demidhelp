'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { useLessonStore } from '@/lib/store'
import { BLOCK4_ORIENTIRS, BLOCK4_TRAINING_EXAMPLES, BLOCK4_PRACTICE, block4Content } from '@/lib/lesson-data'

// ─── Sub-components ─────────────────────────────────────────────────────────

function OrientirCard({
  orientir,
}: {
  orientir: (typeof BLOCK4_ORIENTIRS)[number]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-foreground">
                  {orientir.title}
                </CardTitle>
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="size-5 text-muted-foreground" />
                </motion.div>
              </div>
              <CardDescription className="mt-1">{orientir.rule}</CardDescription>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2 space-y-3">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                  Правильно
                </p>
                <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                  {orientir.correct}
                </p>
              </div>
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3">
                <p className="text-xs font-medium text-rose-700 dark:text-rose-400 mb-1">
                  Неправильно
                </p>
                <p className="text-sm text-rose-900 dark:text-rose-200 font-medium">
                  {orientir.wrong}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  {orientir.explanation}
                </p>
              </div>
            </motion.div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

function PracticeQuestion({
  question,
  index,
}: {
  question: (typeof BLOCK4_PRACTICE)[number]
  index: number
}) {
  const {
    practiceAnswers,
    setPracticeAnswer,
    errorNotes,
    setErrorNote,
  } = useLessonStore()

  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [errorInput, setErrorInput] = useState('')

  const existingAnswer = practiceAnswers[question.id]
  const existingNote = errorNotes[question.id] ?? ''

  // All options: correct + wrong
  const allOptions = [question.correctStress, ...question.wrongOptions]

  const handleCheck = useCallback(() => {
    if (!selected) return
    const isCorrect = selected === question.correctStress
    setChecked(true)

    setPracticeAnswer({
      questionId: question.id,
      blockId: 'block4',
      answer: selected,
      status: isCorrect ? 'correct' : 'incorrect',
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [selected, question, setPracticeAnswer])

  const handleSaveErrorNote = useCallback(() => {
    if (errorInput.trim()) {
      setErrorNote(question.id, errorInput.trim())
    }
  }, [question.id, errorInput, setErrorNote])

  // Reset when re-attempting
  const handleRetry = useCallback(() => {
    setSelected(null)
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
            {index + 1}/{BLOCK4_PRACTICE.length}
          </Badge>
          <CardTitle className="text-lg">Поставьте ударение</CardTitle>
          <div className="ml-auto">{statusIcon}</div>
        </div>
        <CardDescription className="mt-2">
          <span className="text-base font-medium text-foreground">
            {question.word}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="grid gap-2 sm:grid-cols-2">
          {allOptions.map((option) => {
            const isSelected = selected === option
            const isCorrectOption = option === question.correctStress

            let optionClass =
              'rounded-lg border-2 p-3 text-center font-medium cursor-pointer transition-all text-sm '
            if (!checked) {
              optionClass += isSelected
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/40 hover:bg-accent/50'
            } else if (isCorrectOption) {
              optionClass +=
                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
            } else if (isSelected && !isCorrectOption) {
              optionClass +=
                'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
            } else {
              optionClass += 'border-border opacity-50'
            }

            return (
              <button
                key={option}
                className={optionClass}
                onClick={() => !checked && setSelected(option)}
                disabled={checked}
                type="button"
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Check button */}
        {!checked && (
          <Button
            onClick={handleCheck}
            disabled={!selected}
            className="w-full"
          >
            <Volume2 className="size-4 mr-2" />
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
                      {question.hint}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3">
                    <XCircle className="size-5 text-rose-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        Неправильно
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                        Правильный ответ: <strong>{question.correctStress}</strong>
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                        {question.hint}
                      </p>
                    </div>
                  </div>


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
                      value={errorInput || existingNote}
                      onChange={(e) => setErrorInput(e.target.value)}
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

export default function Block4Udareniya() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLessonStore()

  const [activeSection, setActiveSection] = useState<'theory' | 'practice'>('theory')

  const isCompleted = completedBlocks.includes('block4')
  const progress = blockProgress['block4']
  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b4p')
  ).length
  const allAnswered = answeredCount >= BLOCK4_PRACTICE.length

  const handleComplete = useCallback(() => {
    markBlockCompleted('block4')
  }, [markBlockCompleted])

  const sections = [
    { key: 'theory' as const, label: 'Теория', shortLabel: 'Теор.', icon: BookOpen },
    { key: 'practice' as const, label: 'Тренировка', shortLabel: 'Трен.', icon: Sparkles },
  ]

  const allSectionsVisited = sections.every((s) => (visitedSections['block4'] ?? []).includes(s.key))

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
                markSectionVisited('block4', section.key)
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

      {/* Theory Section */}
      <AnimatePresence mode="wait">
        {activeSection === 'theory' && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                {block4Content.warnings?.[0]?.title}
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                {block4Content.warnings?.[0]?.text}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BLOCK4_ORIENTIRS.map((orientir) => (
                <OrientirCard key={orientir.id} orientir={orientir} />
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
                {block4Content.examples?.[0]?.text}
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4" />
              <span>
                Выберите правильную постановку ударения в каждом слове
              </span>
            </div>

            <div className="space-y-4">
              {BLOCK4_PRACTICE.map((question, i) => (
                <PracticeQuestion key={question.id} question={question} index={i} />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="rounded-lg border bg-accent/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Прогресс тренировки</span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} из {BLOCK4_TRAINING_EXAMPLES.length} мини-примеров
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(answeredCount / BLOCK4_PRACTICE.length) * 100}%`,
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
              : `Осталось пройти ${BLOCK4_TRAINING_EXAMPLES.length - answeredCount} мини-примеров`}
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
