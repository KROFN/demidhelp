'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Lightbulb,
  ListOrdered,
  PencilLine,
  RotateCcw,
  Route,
  XCircle,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useLesson30Store, type BlockId30 } from '@/lib/store-30'

type MechanismOption = {
  value: string
  label: string
}

type LessonExample = {
  id: string
  word?: string
  prompt?: string
  answer: string
  explanation: string
  mechanism: string
  mechanismLabel?: string
}

type LessonTask = {
  id: string
  sourceId: string
  taskNumber: number
  word?: string
  prompt?: string
  answer: string
  explanation: string
  mechanism: string
  mechanismLabel?: string
}

type Draft = {
  answer: string
  mechanism: string
  note: string
  editing: boolean
}

type SectionKey = 'theory' | 'algorithm' | 'practice'

type MechanismTrainerProps = {
  blockId: BlockId30
  title: string
  goal: string
  mainThought: string
  algorithm: readonly string[]
  examples: readonly LessonExample[]
  tasks: readonly LessonTask[]
  mechanismOptions: readonly MechanismOption[]
  minToComplete?: number
  answerLabel: string
  mechanismPrompt: string
  promptLabel: string
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ')
}

function answerCandidates(answer: string) {
  const normalized = normalizeAnswer(answer)
  const primary = normalizeAnswer(answer.split(/\s+[—–-]\s+/)[0] ?? answer)
  return Array.from(new Set([normalized, primary]))
}

function isAnswerCorrect(given: string, expected: string) {
  const normalizedGiven = normalizeAnswer(given)
  return answerCandidates(expected).includes(normalizedGiven)
}

function shortExpectedAnswer(answer: string) {
  return answer.split(/\s+[—–-]\s+/)[0] ?? answer
}

function getPrompt(task: Pick<LessonTask, 'word' | 'prompt'>) {
  return task.word ?? task.prompt ?? ''
}

function optionLabel(options: readonly MechanismOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

export default function MechanismTrainer({
  blockId,
  title,
  goal,
  mainThought,
  algorithm,
  examples,
  tasks,
  mechanismOptions,
  minToComplete = 6,
  answerLabel,
  mechanismPrompt,
  promptLabel,
}: MechanismTrainerProps) {
  const {
    completedBlocks,
    blockProgress,
    practiceAnswers,
    errorNotes,
    markBlockCompleted,
    setPracticeAnswer,
    setErrorNote,
  } = useLesson30Store()

  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [activeSection, setActiveSection] = useState<SectionKey>('theory')

  const progress = blockProgress[blockId]
  const isCompleted = completedBlocks.includes(blockId)
  const answeredTasks = tasks.filter((task) => practiceAnswers[task.id])
  const answeredCount = answeredTasks.length
  const canComplete = answeredCount >= minToComplete
  const completionProgress = Math.min(100, Math.round((answeredCount / minToComplete) * 100))

  const updateDraft = useCallback((taskId: string, patch: Partial<Draft>) => {
    setDrafts((current) => {
      const previous = current[taskId] ?? {
        answer: '',
        mechanism: '',
        note: '',
        editing: false,
      }

      return {
        ...current,
        [taskId]: {
          ...previous,
          ...patch,
        },
      }
    })
  }, [])

  useEffect(() => {
    tasks.forEach((task) => {
      const existing = practiceAnswers[task.id]
      if (!existing) return

      const nextStatus =
        isAnswerCorrect(existing.answer, task.answer) && existing.mechanism === task.mechanism
          ? 'correct'
          : 'incorrect'

      if (existing.status !== nextStatus) {
        setPracticeAnswer({
          ...existing,
          status: nextStatus,
          timestamp: Date.now(),
        })
      }
    })
  }, [practiceAnswers, setPracticeAnswer, tasks])

  const handleCheck = useCallback(
    (task: LessonTask) => {
      const draft = drafts[task.id]
      if (!draft?.answer.trim() || !draft.mechanism) return

      const answerCorrect = isAnswerCorrect(draft.answer, task.answer)
      const mechanismCorrect = draft.mechanism === task.mechanism
      const status = answerCorrect && mechanismCorrect ? 'correct' : 'incorrect'

      setPracticeAnswer({
        questionId: task.id,
        blockId,
        answer: draft.answer.trim(),
        mechanism: draft.mechanism,
        status,
        errorNote: '',
        timestamp: Date.now(),
      })

      updateDraft(task.id, { editing: false })
    },
    [blockId, drafts, setPracticeAnswer, updateDraft]
  )

  const handleSaveNote = useCallback(
    (taskId: string) => {
      const note = drafts[taskId]?.note?.trim()
      if (note) setErrorNote(taskId, note)
    },
    [drafts, setErrorNote]
  )

  const handleComplete = useCallback(() => {
    markBlockCompleted(blockId)
  }, [blockId, markBlockCompleted])

  const sections: { key: SectionKey; label: string; icon: React.ElementType }[] = [
    { key: 'theory', label: 'Теория', icon: Lightbulb },
    { key: 'algorithm', label: 'Алгоритм', icon: ListOrdered },
    { key: 'practice', label: 'Практика', icon: PencilLine },
  ]

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            форма → механизм → ответ
          </Badge>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{goal}</p>
        </div>

        <Alert className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40">
          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-900 dark:text-amber-300">
            Не угадываем букву
          </AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-400">
            {mainThought}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === section.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-4" />
                <span>{section.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeSection === 'theory' && (
          <motion.section
            key="theory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-amber-600" />
              <h3 className="text-base font-semibold">Теория и разборы</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {examples.map((example) => (
                <Card key={example.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base leading-snug">
                      {getPrompt(example)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        {example.answer}
                      </Badge>
                      <Badge variant="outline">
                        {example.mechanismLabel ?? optionLabel(mechanismOptions, example.mechanism)}
                      </Badge>
                    </div>
                    <p className="leading-relaxed text-muted-foreground">{example.explanation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {activeSection === 'algorithm' && (
          <motion.section
            key="algorithm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Route className="size-5 text-primary" />
              <h3 className="text-base font-semibold">Маршрут решения</h3>
            </div>
            <div className="grid gap-2">
              {algorithm.map((step, index) => (
                <div key={`${blockId}-step-${index}`} className="flex gap-3 rounded-lg border bg-background p-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {activeSection === 'practice' && (
          <motion.section
            key="practice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <PencilLine className="size-5 text-primary" />
                <h3 className="text-base font-semibold">Практика</h3>
              </div>
              <Badge variant="outline">
                минимум {minToComplete} из {tasks.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {tasks.map((task, index) => {
            const existing = practiceAnswers[task.id]
            const draft = drafts[task.id]
            const editing = draft?.editing ?? !existing
            const answerValue = editing ? draft?.answer ?? '' : existing?.answer ?? ''
            const mechanismValue = editing ? draft?.mechanism ?? '' : existing?.mechanism ?? ''
            const answerCorrect = existing ? isAnswerCorrect(existing.answer, task.answer) : false
            const mechanismCorrect = existing ? existing.mechanism === task.mechanism : false
            const noteValue = draft?.note ?? errorNotes[task.id] ?? ''

            return (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{index + 1}/{tasks.length}</Badge>
                        <Badge variant="secondary">№{task.taskNumber}</Badge>
                      </div>
                      <CardTitle className="text-base leading-snug">{promptLabel}</CardTitle>
                    </div>
                    {existing?.status === 'correct' && <CheckCircle2 className="size-5 text-emerald-500" />}
                    {existing?.status === 'incorrect' && <XCircle className="size-5 text-rose-500" />}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border bg-muted/40 p-3 text-base font-medium leading-relaxed">
                    {getPrompt(task)}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      {answerLabel}
                    </label>
                    <Input
                      value={answerValue}
                      onChange={(event) => updateDraft(task.id, { answer: event.target.value, editing: true })}
                      disabled={!editing}
                      placeholder="Введите ответ"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{mechanismPrompt}</p>
                    <div className="flex flex-wrap gap-2">
                      {mechanismOptions.map((option) => {
                        const active = mechanismValue === option.value
                        return (
                          <button
                            key={option.value}
                            type="button"
                            disabled={!editing}
                            onClick={() => updateDraft(task.id, { mechanism: option.value, editing: true })}
                            className={`rounded-md border px-3 py-2 text-left text-xs font-medium transition-colors ${
                              active
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'bg-background hover:bg-accent'
                            } ${!editing ? 'cursor-default opacity-80' : ''}`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {editing ? (
                    <Button
                      onClick={() => handleCheck(task)}
                      disabled={!answerValue.trim() || !mechanismValue}
                      className="w-full sm:w-auto"
                    >
                      <ClipboardCheck className="mr-2 size-4" />
                      Проверить
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateDraft(task.id, {
                        answer: existing?.answer ?? '',
                        mechanism: existing?.mechanism ?? '',
                        editing: true,
                      })}
                    >
                      <RotateCcw className="mr-2 size-4" />
                      Исправить ответ
                    </Button>
                  )}

                  <AnimatePresence>
                    {existing && !editing && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-3"
                      >
                        <div
                          className={`rounded-lg border p-3 ${
                            existing.status === 'correct'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                              : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200'
                          }`}
                        >
                          <p className="text-sm font-semibold">
                            {existing.status === 'correct' ? 'Цепочка собрана верно' : 'Цепочка дала сбой'}
                          </p>
                          <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                            <p>
                              Ответ: {answerCorrect ? 'верно' : `нужно "${shortExpectedAnswer(task.answer)}"`}
                            </p>
                            <p>
                              Механизм: {mechanismCorrect
                                ? 'верно'
                                : `нужно "${task.mechanismLabel ?? optionLabel(mechanismOptions, task.mechanism)}"`}
                            </p>
                          </div>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                          <p className="text-xs font-medium text-muted-foreground">Разбор</p>
                          <p className="mt-1 text-sm leading-relaxed">{task.explanation}</p>
                        </div>
                        {existing.status === 'incorrect' && (
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                              Моя ошибка в одном предложении
                            </label>
                            <Textarea
                              value={noteValue}
                              onChange={(event) => updateDraft(task.id, { note: event.target.value })}
                              onBlur={() => handleSaveNote(task.id)}
                              placeholder="Например: перепутал спряжение или не определил часть речи"
                              className="min-h-20"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            )
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Готовность блока</p>
            <p className="text-xs text-muted-foreground">
              Решено {answeredCount} из {tasks.length}. Для завершения нужно минимум {minToComplete}.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="text-emerald-600">{progress.correctCount} верно</span>
            <span className="text-rose-600">{progress.incorrectCount} с ошибкой</span>
          </div>
        </div>
        <Progress value={completionProgress} className="h-2" />
        <div className="flex justify-end">
          <Button
            onClick={handleComplete}
            disabled={isCompleted || !canComplete}
            variant={isCompleted ? 'outline' : 'default'}
          >
            <CheckCircle2 className="mr-2 size-4" />
            {isCompleted ? 'Блок пройден' : 'Завершить блок'}
          </Button>
        </div>
      </section>
    </div>
  )
}
