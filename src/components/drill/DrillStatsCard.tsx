'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import type { DrillItemProgress } from '@/lib/drill/drill-types'
import { TASK_META } from '@/lib/drill/drill-types'

type Props = {
  taskNumber: number
  progress: DrillItemProgress[]
}

export default function DrillStatsCard({ taskNumber, progress }: Props) {
  const meta = TASK_META[taskNumber]

  const totalAttempts = progress.reduce((s, p) => s + p.attempts, 0)
  const totalKnown = progress.reduce((s, p) => s + p.knownCount, 0)
  const totalGuessed = progress.reduce((s, p) => s + p.guessedCount, 0)
  const totalWrong = progress.reduce((s, p) => s + p.wrongCount, 0)

  if (totalAttempts === 0) return null

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-3 flex items-center gap-3">
        <span className="text-lg">{meta.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium">№{taskNumber} {meta.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600">
              <CheckCircle2 className="h-3 w-3" /> {totalKnown}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
              <AlertTriangle className="h-3 w-3" /> {totalGuessed}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-rose-600">
              <XCircle className="h-3 w-3" /> {totalWrong}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
