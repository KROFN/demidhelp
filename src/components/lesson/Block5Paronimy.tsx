'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Shuffle,
  Lightbulb,
  ListOrdered,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { useLessonStore } from '@/lib/store'
import { BLOCK5_PAIRS, BLOCK5_PRACTICE, BLOCK5_TRAINING_EXAMPLES, block5Content } from '@/lib/lesson-data'

// ─── Sub-components ─────────────────────────────────────────────────────────

function ParonymPairCard({
  pair,
  index,
}: {
  pair: (typeof BLOCK5_PAIRS)[number]
  index: number
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs shrink-0">
            Пара {index + 1}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-lg font-bold text-primary">{pair.word1}</span>
          <ArrowRight className="size-4 text-muted-foreground shrink-0" />
          <span className="text-lg font-bold text-primary">{pair.word2}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {pair.word1}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              {pair.meaning1}
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2 italic">
              Пример: {pair.example1}
            </p>
          </div>
          <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3">
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              {pair.word2}
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
              {pair.meaning2}
            </p>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-2 italic">
              Пример: {pair.example2}
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-3">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
            <Lightbulb className="size-3" />
            Пояснение
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {pair.explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function AlgorithmSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListOrdered className="size-5" />
          {block5Content.algorithms?.[0]?.title}
        </CardTitle>
        <CardDescription>
          Следуйте этим шагам для каждого задания
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {block5Content.algorithms?.[0]?.steps.map((stepText, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="flex items-center gap-3 rounded-lg border bg-accent/30 p-3"
            >
              <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-sm font-medium">{stepText}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PracticeAnswerFields {
  correctWord: string
  pair: string
}

function PracticeQuestion({
  question,
  index,
}: {
  question: (typeof BLOCK5_PRACTICE)[number]
  index: number
}) {
  const { practiceAnswers, setPracticeAnswer, errorNotes, setErrorNote } = useLessonStore()

  const [answers, setAnswers] = useState<PracticeAnswerFields>({
    correctWord: '',
    pair: '',
  })
  const [checked, setChecked] = useState(false)
  const [errorInput, setErrorInput] = useState('')

  const existingAnswer = practiceAnswers[question.id]
  const existingNote = errorNotes[question.id] ?? ''

  const updateField = useCallback(
    (field: keyof PracticeAnswerFields, value: string) => {
      setAnswers((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleCheck = useCallback(() => {
    const correctWordMatch =
      answers.correctWord.trim().toLowerCase() ===
      question.correctWord.toLowerCase()
    const pairMatch =
      answers.pair.trim().toLowerCase().includes(question.pair.split(' / ')[0].toLowerCase()) &&
      answers.pair.trim().toLowerCase().includes(question.pair.split(' / ')[1].toLowerCase())

    // Must have the correct word and pair to be "correct"
    const isCorrect = correctWordMatch && pairMatch

    setChecked(true)

    const status: 'correct' | 'incorrect' = isCorrect ? 'correct' : 'incorrect'

    setPracticeAnswer({
      questionId: question.id,
      blockId: 'block5',
      answer: `${answers.correctWord} | ${answers.pair}`,
      status,
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [answers, question, setPracticeAnswer])

  const handleRetry = useCallback(() => {
    setChecked(false)
  }, [])

  const handleSaveErrorNote = useCallback(() => {
    if (errorInput.trim()) {
      setErrorNote(question.id, errorInput.trim())
    }
  }, [question.id, errorInput, setErrorNote])

  // Highlight the word in context
  const renderContext = useCallback(() => {
    const regex = new RegExp(`(${question.highlightedWord})`, 'gi')
    const parts = question.context.split(regex)
    return parts.map((part, i) =>
      part.toLowerCase() === question.highlightedWord.toLowerCase() ? (
        <mark
          key={i}
          className="bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded px-0.5 font-semibold"
        >
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }, [question.context, question.highlightedWord])

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs shrink-0">
            {index + 1}/{BLOCK5_PRACTICE.length}
          </Badge>
          <CardTitle className="text-base">Задание</CardTitle>
          {checked && existingAnswer && (
            <div className="ml-auto">
              {existingAnswer.status === 'correct' ? (
                <CheckCircle2 className="size-5 text-emerald-500" />
              ) : (
                <XCircle className="size-5 text-rose-500" />
              )}
            </div>
          )}
        </div>
        <div className="mt-2 rounded-lg bg-accent/50 p-3">
          <p className="text-sm leading-relaxed">{renderContext()}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input fields — only 2 essential ones */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Правильное слово
            </label>
            <Input
              placeholder="Введите правильное слово..."
              value={answers.correctWord}
              onChange={(e) => updateField('correctWord', e.target.value)}
              disabled={checked}
              className={
                checked
                  ? answers.correctWord.trim().toLowerCase() ===
                    question.correctWord.toLowerCase()
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : ''
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Паронимическая пара
            </label>
            <Input
              placeholder="слово1 / слово2"
              value={answers.pair}
              onChange={(e) => updateField('pair', e.target.value)}
              disabled={checked}
              className={
                checked
                  ? answers.pair.trim().toLowerCase().includes(question.pair.split(' / ')[0].toLowerCase()) &&
                    answers.pair.trim().toLowerCase().includes(question.pair.split(' / ')[1].toLowerCase())
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : ''
              }
            />
          </div>
        </div>

        {/* Check button */}
        {!checked && (
          <Button
            onClick={handleCheck}
            disabled={!answers.correctWord.trim() || !answers.pair.trim()}
            className="w-full"
          >
            <Shuffle className="size-4 mr-2" />
            Проверить
          </Button>
        )}

        {/* Results */}
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* Status message */}
              {existingAnswer?.status === 'correct' ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Отлично! Вы правильно определили слово и пару.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3">
                  <XCircle className="size-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                    Ответ неполный или неверный
                  </p>
                </div>
              )}

              {/* Correct answers */}
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Правильные ответы
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Правильное слово</p>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {question.correctWord}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Паронимическая пара</p>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {question.pair}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Связано с</p>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {question.relatedWord}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Почему исходное не подходит</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {question.whyWrong}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error note — only for incorrect answers */}
              {existingAnswer?.status === 'incorrect' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Моя ошибка / что запомнить
                  </label>
                  <Textarea
                    placeholder="Запишите, в чём ошиблись и как запомнить..."
                    value={errorInput || existingNote}
                    onChange={(e) => setErrorInput(e.target.value)}
                    onBlur={handleSaveErrorNote}
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

export default function Block5Paronimy() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLessonStore()

  const [activeSection, setActiveSection] = useState<'theory' | 'algorithm' | 'practice'>('theory')

  const isCompleted = completedBlocks.includes('block5')
  const progress = blockProgress['block5']
  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b5p')
  ).length
  const allAnswered = answeredCount >= BLOCK5_PRACTICE.length

  const handleComplete = useCallback(() => {
    markBlockCompleted('block5')
  }, [markBlockCompleted])

  const sections = [
    { key: 'theory' as const, label: 'Теория', shortLabel: 'Теор.', icon: BookOpen },
    { key: 'algorithm' as const, label: 'Алгоритм', shortLabel: 'Алг.', icon: ListOrdered },
    { key: 'practice' as const, label: 'Тренировка', shortLabel: 'Трен.', icon: Shuffle },
  ]

  const allSectionsVisited = sections.every((s) => (visitedSections['block5'] ?? []).includes(s.key))

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
                markSectionVisited('block5', section.key)
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
                Важно!
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                {block5Content.definition}
              </AlertDescription>
            </Alert>

            {/* Pairs as accordion for mobile, grid for desktop */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4">
              {BLOCK5_PAIRS.map((pair, i) => (
                <ParonymPairCard key={pair.id} pair={pair} index={i} />
              ))}
            </div>

            <div className="sm:hidden">
              <Accordion type="single" collapsible className="space-y-2">
                {BLOCK5_PAIRS.map((pair, i) => (
                  <AccordionItem
                    key={pair.id}
                    value={pair.id}
                    className="border rounded-lg px-0"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs shrink-0">
                          Пара {i + 1}
                        </Badge>
                        <span className="text-sm font-medium">
                          {pair.word1} / {pair.word2}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3">
                          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                            {pair.word1}
                          </p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                            {pair.meaning1}
                          </p>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2 italic">
                            Пример: {pair.example1}
                          </p>
                        </div>
                        <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3">
                          <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                            {pair.word2}
                          </p>
                          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                            {pair.meaning2}
                          </p>
                          <p className="text-xs text-rose-700 dark:text-rose-300 mt-2 italic">
                            Пример: {pair.example2}
                          </p>
                        </div>
                        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-3">
                          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                            <Lightbulb className="size-3" />
                            Пояснение
                          </p>
                          <p className="text-sm text-amber-800 dark:text-amber-300">
                            {pair.explanation}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        )}

        {/* Algorithm Section */}
        {activeSection === 'algorithm' && (
          <motion.div
            key="algorithm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AlgorithmSection />
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
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                Тренировочные мини-примеры
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                {block5Content.trainingHint}{' '}
                {block5Content.controlPhrase}
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shuffle className="size-4" />
              <span>
                Для каждого задания укажите правильное слово и паронимическую пару
              </span>
            </div>

            <div className="space-y-4">
              {BLOCK5_PRACTICE.map((question, i) => (
                <PracticeQuestion
                  key={question.id}
                  question={question}
                  index={i}
                />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="rounded-lg border bg-accent/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Прогресс тренировки</span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} из {BLOCK5_TRAINING_EXAMPLES.length} мини-примеров
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(answeredCount / BLOCK5_PRACTICE.length) * 100}%`,
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
              : `Осталось пройти ${BLOCK5_TRAINING_EXAMPLES.length - answeredCount} мини-примеров`}
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
