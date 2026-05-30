'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLesson30Store, type BlockId30 } from '@/lib/store-30'
import {
  BLOCK12_ALGORITHM,
  BLOCK12_WORKED_EXAMPLES,
  BLOCK12_PRACTICE,
  type Block12Mechanism,
} from '@/lib/lesson-data-30'

// ─── Mechanism label mapping ─────────────────────────────────────────────────

const MECHANISM_OPTIONS: { value: Block12Mechanism; label: string }[] = [
  { value: 'conjugation', label: 'спряжение' },
  { value: 'present-participle-active', label: 'причастие наст. времени (действ.)' },
  { value: 'present-participle-passive', label: 'причастие наст. времени (страд.)' },
  { value: 'past-infinitive', label: 'прошедшее / инфинитив' },
  { value: 'imperative', label: 'повелительное наклонение' },
  { value: 'trap', label: 'исключение / мина' },
]

function mechanismLabel(value: Block12Mechanism): string {
  return MECHANISM_OPTIONS.find((m) => m.value === value)?.label ?? value
}

// ─── Algorithm Step Card ─────────────────────────────────────────────────────

function AlgorithmStepCard({
  step,
  index,
}: {
  step: string
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                    {index + 1}
                  </span>
                  <CardTitle className="text-base font-semibold text-foreground">
                    Шаг {index + 1}
                  </CardTitle>
                </div>
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="size-5 text-muted-foreground" />
                </motion.div>
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-3">
                <p className="text-sm text-sky-900 dark:text-sky-200">
                  {step}
                </p>
              </div>
            </motion.div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Worked Example Card ─────────────────────────────────────────────────────

function WorkedExampleCard({
  example,
}: {
  example: (typeof BLOCK12_WORKED_EXAMPLES)[number]
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
                  {example.word}
                </CardTitle>
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="size-5 text-muted-foreground" />
                </motion.div>
              </div>
              <CardDescription className="mt-1">
                Ответ: <strong>{example.answer}</strong>
              </CardDescription>
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
                  Ответ
                </p>
                <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                  {example.answer}
                </p>
              </div>
              <div className="rounded-lg bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 p-3">
                <p className="text-xs font-medium text-violet-700 dark:text-violet-400 mb-1">
                  Механизм
                </p>
                <p className="text-sm text-violet-900 dark:text-violet-200 font-medium">
                  {example.mechanismLabel}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  {example.explanation}
                </p>
              </div>
            </motion.div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Practice Question ───────────────────────────────────────────────────────

function PracticeQuestion({
  question,
  index,
}: {
  question: (typeof BLOCK12_PRACTICE)[number]
  index: number
}) {
  const {
    practiceAnswers,
    setPracticeAnswer,
    errorNotes,
    setErrorNote,
  } = useLesson30Store()

  const [answerInput, setAnswerInput] = useState('')
  const [selectedMechanism, setSelectedMechanism] = useState<string>('')
  const [checked, setChecked] = useState(false)
  const [errorInput, setErrorInput] = useState('')

  const existingAnswer = practiceAnswers[question.id]
  const existingNote = errorNotes[question.id] ?? ''

  const isAnswerCorrect = answerInput.trim().toLowerCase() === question.answer.toLowerCase()
  const isMechanismCorrect = selectedMechanism === question.mechanism

  const handleCheck = useCallback(() => {
    if (!answerInput.trim() || !selectedMechanism) return
    setChecked(true)

    const isCorrect = isAnswerCorrect && isMechanismCorrect

    setPracticeAnswer({
      questionId: question.id,
      blockId: 'block12' as BlockId30,
      answer: answerInput.trim(),
      mechanism: selectedMechanism,
      status: isCorrect ? 'correct' : 'incorrect',
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [answerInput, selectedMechanism, question, setPracticeAnswer, isAnswerCorrect, isMechanismCorrect])

  const handleSaveErrorNote = useCallback(() => {
    if (errorInput.trim()) {
      setErrorNote(question.id, errorInput.trim())
    }
  }, [question.id, errorInput, setErrorNote])

  const handleRetry = useCallback(() => {
    setAnswerInput('')
    setSelectedMechanism('')
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
            {index + 1}/{BLOCK12_PRACTICE.length}
          </Badge>
          <CardTitle className="text-lg">Вставьте букву и определите механизм</CardTitle>
          <div className="ml-auto">{statusIcon}</div>
        </div>
        <CardDescription className="mt-2">
          <span className="text-base font-medium text-foreground">
            {question.word}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Answer input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Вставьте пропущенную букву (напишите полное слово)
          </label>
          <Input
            placeholder={question.word.replace('..', '…')}
            value={answerInput}
            onChange={(e) => !checked && setAnswerInput(e.target.value)}
            disabled={checked}
            className="text-sm"
          />
        </div>

        {/* Mechanism selector */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Выберите механизм
          </label>
          <Select
            value={selectedMechanism}
            onValueChange={(val) => !checked && setSelectedMechanism(val)}
            disabled={checked}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите механизм…" />
            </SelectTrigger>
            <SelectContent>
              {MECHANISM_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check button */}
        {!checked && (
          <Button
            onClick={handleCheck}
            disabled={!answerInput.trim() || !selectedMechanism}
            className="w-full"
          >
            <Sparkles className="size-4 mr-2" />
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
                      {question.explanation}
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
                        Правильный ответ: <strong>{question.answer}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Mechanism feedback */}
                  {!isMechanismCorrect && (
                    <div className="flex items-center gap-2 rounded-lg bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 p-3">
                      <AlertTriangle className="size-5 text-violet-500 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-violet-700 dark:text-violet-400">
                          Механизм: <strong>{mechanismLabel(question.mechanism)}</strong>
                        </p>
                        <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
                          Вы выбрали: {mechanismLabel(selectedMechanism as Block12Mechanism)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      {question.explanation}
                    </p>
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

// ─── Section tabs type ───────────────────────────────────────────────────────

type SectionKey = 'algorithm' | 'examples' | 'practice'

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Block12VerbsParticiples() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLesson30Store()

  const [activeSection, setActiveSection] = useState<SectionKey>('algorithm')

  const isCompleted = completedBlocks.includes('block12')
  const progress = blockProgress['block12']
  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b12p')
  ).length
  const canComplete = answeredCount >= 6

  const handleComplete = useCallback(() => {
    markBlockCompleted('block12')
  }, [markBlockCompleted])

  const sections: { key: SectionKey; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { key: 'algorithm', label: 'Алгоритм', shortLabel: 'Алг.', icon: BookOpen },
    { key: 'examples', label: 'Примеры', shortLabel: 'Прим.', icon: Sparkles },
    { key: 'practice', label: 'Практика', shortLabel: 'Практ.', icon: CheckCircle2 },
  ]

  const allSectionsVisited = sections.every((s) =>
    (visitedSections['block12'] ?? []).includes(s.key)
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
                markSectionVisited('block12', section.key)
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
                Алгоритм определения буквы
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Не спрашивай «какая буква?». Сначала спроси: «что это за форма?»
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BLOCK12_ALGORITHM.map((step, i) => (
                <AlgorithmStepCard key={i} step={step} index={i} />
              ))}
            </div>
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
            <Alert className="border-sky-300 bg-sky-50 dark:bg-sky-950/40 dark:border-sky-800">
              <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />
              <AlertDescription className="text-sky-700 dark:text-sky-400 text-sm">
                Разобранные примеры: раскройте карточку, чтобы увидеть механизм и объяснение.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BLOCK12_WORKED_EXAMPLES.map((example) => (
                <WorkedExampleCard key={example.id} example={example} />
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
                Вставьте пропущенную букву и выберите механизм, по которому определяется гласная.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4" />
              <span>
                Заполните пропуски и определите механизм для каждого слова
              </span>
            </div>

            <div className="space-y-4">
              {BLOCK12_PRACTICE.map((question, i) => (
                <PracticeQuestion key={question.id} question={question} index={i} />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="rounded-lg border bg-accent/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Прогресс практики</span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} из {BLOCK12_PRACTICE.length} заданий
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(answeredCount / BLOCK12_PRACTICE.length) * 100}%`,
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
            {canComplete
              ? 'Достаточно заданий пройдено. Готовы завершить блок?'
              : `Осталось пройти ещё ${6 - answeredCount > 0 ? 6 - answeredCount : 0} заданий (минимум 6 из ${BLOCK12_PRACTICE.length})`}
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
