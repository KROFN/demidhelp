'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { FadeUp } from '@/lib/motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import type { DrillItem, DrillResultStatus } from '@/lib/drill/drill-types'
import { TASK_META, computeResultStatus } from '@/lib/drill/drill-types'
import { useDrillProgressStore } from '@/lib/drill/drill-store'
import {
  getVisibleMechanismChoices,
  isMechanismCorrect,
  getCorrectNormalizedMechanismText,
  getSelectedNormalizedMechanismText,
  getMechanismSupplementaryHint,
} from '@/lib/drill/drill-mechanism-normalizer'

type Props = {
  item: DrillItem
  index: number
  totalInSession: number
  onCheck: (status: DrillResultStatus) => void
}

export default function DrillCard({ item, index, totalInSession, onCheck }: Props) {
  const { recordResult } = useDrillProgressStore()
  const meta = TASK_META[item.taskNumber]

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [selectedMechanismId, setSelectedMechanismId] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [resultStatus, setResultStatus] = useState<DrillResultStatus | null>(null)

  // Use normalized mechanism choices
  const visibleMechanisms = useMemo(() => getVisibleMechanismChoices(item), [item])
  const correctMechNorm = useMemo(() => getCorrectNormalizedMechanismText(item), [item])
  const supplementaryHint = useMemo(() => getMechanismSupplementaryHint(item), [item])

  const canCheck = selectedAnswerId !== null && selectedMechanismId !== null && !checked

  const handleCheck = useCallback(() => {
    if (!selectedAnswerId || !selectedMechanismId) return

    const answerCorrect = selectedAnswerId === item.correctAnswerId
    const mechanismCorrect = isMechanismCorrect(item, selectedMechanismId)
    const status = computeResultStatus(answerCorrect, mechanismCorrect)

    recordResult({
      itemId: item.id,
      taskNumber: item.taskNumber,
      selectedAnswerId,
      selectedMechanismId,
      status,
      checkedAt: Date.now(),
    })

    setResultStatus(status)
    setChecked(true)
    onCheck(status)
  }, [selectedAnswerId, selectedMechanismId, item, recordResult, onCheck])

  // Get selected mechanism display text for results
  const selectedMechDisplayText = selectedMechanismId
    ? getSelectedNormalizedMechanismText(item, selectedMechanismId)
    : ''

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs shrink-0">
            №{item.taskNumber}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {index + 1}/{totalInSession}
          </Badge>
          <CardTitle className="text-sm font-medium">{meta.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Context */}
        {item.context && (
          <p className="text-sm text-muted-foreground italic">
            {item.context}
          </p>
        )}

        {/* Target */}
        <div className="text-lg sm:text-xl font-bold text-center py-2">
          {item.target}
        </div>

        {/* Prompt */}
        <p className="text-sm text-muted-foreground text-center">
          {item.prompt}
        </p>

        {/* Answer choices */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Выбери ответ
          </label>
          <div className="flex flex-wrap gap-2">
            {item.answerChoices.map((choice) => {
              const isSelected = selectedAnswerId === choice.id
              const isCorrect = checked && choice.id === item.correctAnswerId
              const isWrong = checked && isSelected && choice.id !== item.correctAnswerId

              let className = 'transition-all text-sm '
              if (isCorrect) {
                className += 'bg-emerald-100 border-emerald-400 text-emerald-800 '
              } else if (isWrong) {
                className += 'bg-rose-100 border-rose-400 text-rose-800 '
              } else if (isSelected) {
                className += 'bg-emerald-50 border-emerald-300 text-emerald-700 ring-2 ring-emerald-200 '
              } else {
                className += 'bg-white hover:bg-slate-50 border-slate-200 '
              }

              return (
                <button
                  key={choice.id}
                  disabled={checked}
                  onClick={() => setSelectedAnswerId(choice.id)}
                  className={`px-3 py-2 rounded-lg border cursor-pointer font-medium ${className}`}
                >
                  {choice.text}
                </button>
              )
            })}
          </div>
        </div>

        {/* Mechanism choices (normalized) */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Почему?
          </label>
          <div className="flex flex-wrap gap-2">
            {visibleMechanisms.map((choice) => {
              const isSelected = selectedMechanismId === choice.id
              const isCorrect = checked && choice.text === correctMechNorm
              const isWrong = checked && isSelected && choice.text !== correctMechNorm

              let className = 'transition-all text-xs '
              if (isCorrect) {
                className += 'bg-emerald-100 border-emerald-400 text-emerald-800 '
              } else if (isWrong) {
                className += 'bg-rose-100 border-rose-400 text-rose-800 '
              } else if (isSelected) {
                className += 'bg-amber-50 border-amber-300 text-amber-700 ring-2 ring-amber-200 '
              } else {
                className += 'bg-white hover:bg-slate-50 border-slate-200 '
              }

              return (
                <button
                  key={choice.id}
                  disabled={checked}
                  onClick={() => setSelectedMechanismId(choice.id)}
                  className={`px-2.5 py-1.5 rounded-lg border cursor-pointer ${className}`}
                >
                  {choice.text}
                </button>
              )
            })}
          </div>
        </div>

        {/* Check button */}
        {!checked && (
          <Button
            onClick={handleCheck}
            disabled={!canCheck}
            className="w-full"
          >
            Проверить
          </Button>
        )}

        {/* Result feedback */}
        {checked && resultStatus && (
          <FadeUp duration={0.3} className="space-y-3">
            {/* Known */}
            {resultStatus === 'known' && (
              <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Полный зачёт
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Ответ: <strong>{item.correctAnswerText}</strong>
                  </p>
                  <p className="text-xs text-emerald-600">
                    Механизм: <strong>{correctMechNorm}</strong>
                  </p>
                  {supplementaryHint && (
                    <p className="text-xs text-emerald-500 mt-0.5 italic">
                      {supplementaryHint}
                    </p>
                  )}
                  {item.explanation && (
                    <p className="text-xs text-emerald-600 mt-1">
                      {item.explanation}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Guessed */}
            {resultStatus === 'guessed' && (
              <div className="space-y-2">
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-700">
                      Ответ угадан, механизм не доказан
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Ответ верный: <strong>{item.correctAnswerText}</strong>
                    </p>
                    <p className="text-xs text-amber-600">
                      Твой механизм:{' '}
                      <strong>{selectedMechDisplayText}</strong>
                    </p>
                    <p className="text-xs text-amber-600">
                      Правильный механизм: <strong>{correctMechNorm}</strong>
                    </p>
                    {supplementaryHint && (
                      <p className="text-xs text-amber-500 mt-0.5 italic">
                        {supplementaryHint}
                      </p>
                    )}
                  </div>
                </div>
                {item.explanation && (
                  <div className="rounded-lg bg-amber-50/50 border border-amber-100 p-2.5">
                    <p className="text-xs text-amber-800">{item.explanation}</p>
                  </div>
                )}
                {item.wrongPathHint && (
                  <div className="rounded-lg bg-rose-50/50 border border-rose-100 p-2.5">
                    <p className="text-xs text-rose-700">{item.wrongPathHint}</p>
                  </div>
                )}
              </div>
            )}

            {/* Wrong */}
            {resultStatus === 'wrong' && (
              <div className="space-y-2">
                <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3">
                  <XCircle className="size-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-rose-700">Ошибка</p>
                    <p className="text-xs text-rose-600 mt-0.5">
                      Твой ответ:{' '}
                      <strong>
                        {item.answerChoices.find((c) => c.id === selectedAnswerId)?.text}
                      </strong>
                    </p>
                    <p className="text-xs text-rose-600">
                      Правильный ответ: <strong>{item.correctAnswerText}</strong>
                    </p>
                    <p className="text-xs text-rose-600">
                      Правильный механизм: <strong>{correctMechNorm}</strong>
                    </p>
                    {supplementaryHint && (
                      <p className="text-xs text-rose-500 mt-0.5 italic">
                        {supplementaryHint}
                      </p>
                    )}
                  </div>
                </div>
                {item.explanation && (
                  <div className="rounded-lg bg-rose-50/50 border border-rose-100 p-2.5">
                    <p className="text-xs text-rose-800">{item.explanation}</p>
                  </div>
                )}
                {item.wrongPathHint && (
                  <div className="rounded-lg bg-amber-50/50 border border-amber-100 p-2.5">
                    <p className="text-xs text-amber-700">{item.wrongPathHint}</p>
                  </div>
                )}
              </div>
            )}
          </FadeUp>
        )}
      </CardContent>
    </Card>
  )
}
