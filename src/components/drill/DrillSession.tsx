'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { FadeUp } from '@/lib/motion'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  LogOut,
} from 'lucide-react'
import type { DrillItem, DrillMode, DrillResultStatus, SessionItemResult } from '@/lib/drill/drill-types'
import { TASK_META, DRILL_MODE_CONFIG } from '@/lib/drill/drill-types'
import type { DisplayDrillItem } from '@/lib/drill/drill-display-normalizer'
import { createDisplayItem, createSessionSeed } from '@/lib/drill/drill-display-normalizer'
import DrillCard from './DrillCard'

type Props = {
  items: DrillItem[]
  taskNumber: number
  mode: DrillMode
  onFinish: (results: SessionItemResult[]) => void
  onExit: () => void
}

export default function DrillSession({ items, taskNumber, mode, onFinish, onExit }: Props) {
  const meta = TASK_META[taskNumber]
  const modeConfig = DRILL_MODE_CONFIG[mode]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<SessionItemResult[]>([])
  const [confirmExit, setConfirmExit] = useState(false)

  // Create session seed once — stable for the entire session
  const [sessionSeed] = useState(() => createSessionSeed())

  // Build display items with masked context + shuffled choices
  const displayItems: DisplayDrillItem[] = useMemo(
    () => items.map((item, index) => createDisplayItem(item, sessionSeed, index)),
    [items, sessionSeed]
  )

  const knownCount = results.filter((r) => r.status === 'known').length
  const guessedCount = results.filter((r) => r.status === 'guessed').length
  const wrongCount = results.filter((r) => r.status === 'wrong').length

  const currentItem = displayItems[currentIndex]
  const isLastItem = currentIndex >= items.length - 1

  const handleCheck = useCallback(
    (status: DrillResultStatus) => {
      const result: SessionItemResult = {
        itemId: currentItem.id,
        taskNumber: currentItem.taskNumber,
        selectedAnswerId: '',
        selectedMechanismId: '',
        status,
        checkedAt: Date.now(),
      }
      setResults((prev) => [...prev, result])
    },
    [currentItem]
  )

  const handleNext = useCallback(() => {
    if (isLastItem) {
      onFinish(results)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [isLastItem, onFinish, results])

  const handleDisabled = useCallback(() => {
    // If item was disabled and not yet checked, skip to next
    const hasChecked = results[currentIndex] !== undefined
    if (!hasChecked) {
      if (isLastItem) {
        onFinish(results)
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    }
  }, [currentIndex, results, isLastItem, onFinish])

  const currentResult = results[currentIndex]
  const hasCheckedCurrent = currentResult !== undefined

  // Session is already complete
  if (!currentItem) {
    onFinish(results)
    return null
  }

  return (
    <div className="space-y-4">
      {/* Sticky progress header */}
      <div className="sticky top-14 z-40 bg-white/90 backdrop-blur-sm border-b pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">№{taskNumber}</Badge>
            <Badge variant="secondary">{modeConfig.label}</Badge>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1}/{items.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {knownCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                ✅ {knownCount}
              </span>
            )}
            {guessedCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-600">
                🟡 {guessedCount}
              </span>
            )}
            {wrongCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-rose-600">
                ❌ {wrongCount}
              </span>
            )}
          </div>
        </div>
        <Progress value={((currentIndex + 1) / items.length) * 100} className="h-1.5" />
      </div>

      {/* Current drill card */}
      <DrillCard
        key={currentItem.id}
        item={currentItem}
        index={currentIndex}
        totalInSession={items.length}
        onCheck={handleCheck}
        onDisabled={handleDisabled}
      />

      {/* Next / Finish button */}
      {hasCheckedCurrent && (
        <FadeUp duration={0.2}>
          <Button onClick={handleNext} className="w-full" size="lg">
            {isLastItem ? 'Результаты' : 'Дальше'}
            <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
          </Button>
        </FadeUp>
      )}

      {/* Exit button */}
      <div className="pt-2">
        {!confirmExit ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmExit(true)}
            className="w-full text-muted-foreground"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Завершить досрочно
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onFinish(results)}
              className="flex-1"
            >
              Да, выйти
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmExit(false)}
              className="flex-1"
            >
              Продолжить
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
