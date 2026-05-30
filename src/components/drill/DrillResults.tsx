'use client'

import React from 'react'
import { FadeUp } from '@/lib/motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertTriangle, RotateCcw, ArrowRight, Home } from 'lucide-react'
import type { DrillItem, DrillMode, SessionItemResult, DrillResultStatus } from '@/lib/drill/drill-types'
import { TASK_META, DRILL_MODE_CONFIG } from '@/lib/drill/drill-types'
import { getCorrectNormalizedMechanismText } from '@/lib/drill/drill-mechanism-normalizer'

type Props = {
  items: DrillItem[]
  results: SessionItemResult[]
  taskNumber: number
  mode: DrillMode
  onRetryErrors: () => void
  onRetrySame: () => void
  onBackToDashboard: () => void
  onHome: () => void
}

export default function DrillResults({
  items,
  results,
  taskNumber,
  mode,
  onRetryErrors,
  onRetrySame,
  onBackToDashboard,
  onHome,
}: Props) {
  const meta = TASK_META[taskNumber]
  const modeConfig = DRILL_MODE_CONFIG[mode]

  const knownCount = results.filter((r) => r.status === 'known').length
  const guessedCount = results.filter((r) => r.status === 'guessed').length
  const wrongCount = results.filter((r) => r.status === 'wrong').length
  const total = results.length

  const answerAccuracy = total > 0 ? Math.round(((knownCount + guessedCount) / total) * 100) : 0
  const mechanismAccuracy = total > 0 ? Math.round((knownCount / total) * 100) : 0

  // Find weak mechanisms (using normalized mechanism text)
  const mechanismMistakes: Record<string, { wrong: number; guessed: number }> = {}
  for (const result of results) {
    const item = items.find((i) => i.id === result.itemId)
    if (!item) continue

    const normMech = getCorrectNormalizedMechanismText(item)

    if (result.status === 'wrong') {
      if (!mechanismMistakes[normMech]) {
        mechanismMistakes[normMech] = { wrong: 0, guessed: 0 }
      }
      mechanismMistakes[normMech].wrong++
    }
    if (result.status === 'guessed') {
      if (!mechanismMistakes[normMech]) {
        mechanismMistakes[normMech] = { wrong: 0, guessed: 0 }
      }
      mechanismMistakes[normMech].guessed++
    }
  }

  const weakMechanisms = Object.entries(mechanismMistakes)
    .sort((a, b) => b[1].wrong + b[1].guessed - (a[1].wrong + a[1].guessed))
    .slice(0, 5)

  const hasErrors = wrongCount > 0 || guessedCount > 0

  // Error items for review
  const errorResults = results.filter((r) => r.status === 'wrong' || r.status === 'guessed')

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp duration={0.5}>
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">
            {modeConfig.label} завершена
          </h2>
          <p className="text-muted-foreground text-sm">
            №{taskNumber} {meta.title}
          </p>
        </div>
      </FadeUp>

      {/* Score cards */}
      <FadeUp delay={0.1} duration={0.4}>
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{knownCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">✅ Знаю</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{guessedCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">🟡 Угадал</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-rose-600">{wrongCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">❌ Ошибка</p>
            </CardContent>
          </Card>
        </div>
      </FadeUp>

      {/* Accuracy */}
      <FadeUp delay={0.2} duration={0.4}>
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Точность ответа</span>
              <span className="text-sm font-bold">{answerAccuracy}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Точность механизма</span>
              <span className="text-sm font-bold">{mechanismAccuracy}%</span>
            </div>
            {total > 0 && (
              <p className="text-xs text-muted-foreground pt-1">
                Всего: {total} заданий
              </p>
            )}
          </CardContent>
        </Card>
      </FadeUp>

      {/* Weak mechanisms */}
      {weakMechanisms.length > 0 && (
        <FadeUp delay={0.3} duration={0.4}>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">Слабые механизмы</h3>
              <div className="space-y-2">
                {weakMechanisms.map(([mech, counts]) => (
                  <div key={mech} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{mech}</span>
                    <span className="text-xs">
                      {counts.wrong > 0 && (
                        <span className="text-rose-600">{counts.wrong} ош. </span>
                      )}
                      {counts.guessed > 0 && (
                        <span className="text-amber-600">{counts.guessed} угад.</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      )}

      {/* Error items detail */}
      {errorResults.length > 0 && (
        <FadeUp delay={0.35} duration={0.4}>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">
                Задания с ошибками ({errorResults.length})
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {errorResults.map((result) => {
                  const item = items.find((i) => i.id === result.itemId)
                  if (!item) return null

                  return (
                    <div
                      key={result.itemId}
                      className="flex items-center gap-2 text-xs p-2 rounded-lg bg-slate-50"
                    >
                      <span className="shrink-0">
                        {result.status === 'wrong' ? '❌' : '🟡'}
                      </span>
                      <span className="font-medium truncate">{item.target}</span>
                      <span className="text-muted-foreground ml-auto shrink-0">
                        → {item.correctAnswerText}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      )}

      {/* Action buttons */}
      <FadeUp delay={0.4} duration={0.4}>
        <div className="space-y-2">
          {hasErrors && (
            <Button onClick={onRetryErrors} className="w-full" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Добить ошибки
            </Button>
          )}
          <Button onClick={onRetrySame} variant="outline" className="w-full" size="lg">
            Ещё {DRILL_MODE_CONFIG[mode].size} таких же
          </Button>
          <Button onClick={onBackToDashboard} variant="outline" className="w-full" size="lg">
            К выбору заданий
          </Button>
          <Button onClick={onHome} variant="ghost" className="w-full text-muted-foreground" size="sm">
            <Home className="h-4 w-4 mr-1" />
            На главную
          </Button>
        </div>
      </FadeUp>
    </div>
  )
}
