'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { FadeUp, AnimatedWidth } from '@/lib/motion'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLesson30Store, type BlockId30, type PracticeAnswer30 } from '@/lib/store-30'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MechanismOption {
  value: string
  label: string
}

export interface PracticeItem {
  id: string
  word?: string
  prompt?: string
  answer: string
  mechanism: string
  mechanismLabel: string
  explanation: string
}

export interface MechanismTrainerProps {
  blockId: BlockId30
  items: PracticeItem[]
  mechanismOptions: MechanismOption[]
  totalItems: number
  minToComplete: number
  /** Label shown in the answer input placeholder */
  answerPlaceholder?: string
  /** Label for the answer input field */
  answerLabel?: string
}

// ─── Normalization ────────────────────────────────────────────────────────────

/**
 * Normalize a reference answer: if it contains " — " (em-dash separator),
 * only the part before " — " is the core answer.
 * E.g. "так же — раздельно" → "так же"
 */
function normalizeAnswer(raw: string): string {
  const idx = raw.indexOf(' — ')
  if (idx > 0) return raw.slice(0, idx)
  // also try regular dash with spaces
  const idx2 = raw.indexOf(' - ')
  if (idx2 > 0) return raw.slice(0, idx2)
  return raw
}

/** Check if user answer matches reference, using normalization */
function isAnswerMatch(userAnswer: string, referenceAnswer: string): boolean {
  const u = userAnswer.trim().toLowerCase()
  const r = referenceAnswer.trim().toLowerCase()
  if (u === r) return true
  const core = normalizeAnswer(r)
  if (u === core) return true
  return false
}

// ─── Practice Card ────────────────────────────────────────────────────────────

function PracticeCard({
  item,
  index,
  totalItems,
  blockId,
  mechanismOptions,
  answerPlaceholder,
  answerLabel,
}: {
  item: PracticeItem
  index: number
  totalItems: number
  blockId: BlockId30
  mechanismOptions: MechanismOption[]
  answerPlaceholder?: string
  answerLabel?: string
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

  const existingAnswer = practiceAnswers[item.id]
  const existingNote = errorNotes[item.id] ?? ''

  const answerIsCorrect = isAnswerMatch(answerInput, item.answer)
  const mechanismIsCorrect = selectedMechanism === item.mechanism

  const handleCheck = useCallback(() => {
    if (!answerInput.trim() || !selectedMechanism) return
    setChecked(true)

    const isCorrect = isAnswerMatch(answerInput, item.answer) && mechanismIsCorrect

    setPracticeAnswer({
      questionId: item.id,
      blockId,
      answer: answerInput.trim(),
      mechanism: selectedMechanism,
      status: isCorrect ? 'correct' : 'incorrect',
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [answerInput, selectedMechanism, item, blockId, setPracticeAnswer, mechanismIsCorrect])

  const handleSaveErrorNote = useCallback(() => {
    if (errorInput.trim()) {
      setErrorNote(item.id, errorInput.trim())
    }
  }, [item.id, errorInput, setErrorNote])

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

  const displayPrompt = item.word || item.prompt || ''

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs shrink-0">
            {index + 1}/{totalItems}
          </Badge>
          <CardTitle className="text-lg">
            Вставьте букву и определите механизм
          </CardTitle>
          <div className="ml-auto">{statusIcon}</div>
        </div>
        {displayPrompt && (
          <CardDescription className="mt-2">
            <span className="text-base font-medium text-foreground">
              {displayPrompt}
            </span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Answer input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            {answerLabel ?? 'Ответ (слово целиком)'}
          </label>
          <Input
            placeholder={answerPlaceholder ?? 'введите ответ...'}
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
              {mechanismOptions.map((opt) => (
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
        {checked && (
          <FadeUp duration={0.3} className="space-y-3">
              {/* Answer feedback */}
              {existingAnswer?.status === 'correct' ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Правильно!
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Answer correctness */}
                  <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3">
                    {answerIsCorrect ? (
                      <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="size-5 text-rose-500 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        {!answerIsCorrect ? 'Ответ неверен' : 'Ответ верен, но механизм нет'}
                      </p>
                      {!answerIsCorrect && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                          Правильный ответ: <strong>{item.answer}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mechanism feedback */}
                  {!mechanismIsCorrect && (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                      <AlertTriangle className="size-5 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                          Механизм: <strong>{item.mechanismLabel}</strong>
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                          Вы выбрали: {mechanismOptions.find(o => o.value === selectedMechanism)?.label ?? selectedMechanism}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      {item.explanation}
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
          </FadeUp>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Main MechanismTrainer ────────────────────────────────────────────────────

export default function MechanismTrainer({
  blockId,
  items,
  mechanismOptions,
  totalItems,
  minToComplete,
  answerPlaceholder,
  answerLabel,
}: MechanismTrainerProps) {
  const {
    practiceAnswers,
    setPracticeAnswer,
    blockProgress,
  } = useLesson30Store()

  // ─── Auto-recalc old saved answers on mount ──────────────────────────────
  useEffect(() => {
    let needsUpdate = false
    const updated: Record<string, PracticeAnswer30> = {}

    items.forEach((item) => {
      const saved = practiceAnswers[item.id]
      if (!saved) return

      // Recalculate correctness with current normalization
      const answerOk = isAnswerMatch(saved.answer, item.answer)
      const mechanismOk = saved.mechanism === item.mechanism
      const newStatus = answerOk && mechanismOk ? 'correct' : 'incorrect'

      if (saved.status !== newStatus) {
        needsUpdate = true
        updated[item.id] = { ...saved, status: newStatus }
      }
    })

    if (needsUpdate) {
      // Batch-update all changed answers
      Object.values(updated).forEach((ans) => {
        setPracticeAnswer(ans)
      })
    }
  }, [])

  const answeredCount = items.filter((item) => practiceAnswers[item.id]).length
  const progress = blockProgress[blockId]

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {items.map((item, i) => (
          <PracticeCard
            key={item.id}
            item={item}
            index={i}
            totalItems={totalItems}
            blockId={blockId}
            mechanismOptions={mechanismOptions}
            answerPlaceholder={answerPlaceholder}
            answerLabel={answerLabel}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="rounded-lg border bg-accent/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Прогресс практики</span>
          <span className="text-sm text-muted-foreground">
            {answeredCount} из {totalItems} заданий
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <AnimatedWidth
            percentage={(answeredCount / totalItems) * 100}
            duration={0.5}
            className="h-full rounded-full bg-emerald-500"
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
    </div>
  )
}
