'use client'

import React from 'react'
import { FadeUp } from '@/lib/motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Zap, Target, Flame, RotateCcw } from 'lucide-react'
import { TASK_META, DRILL_MODE_CONFIG, type DrillMode } from '@/lib/drill/drill-types'
import { useDrillProgressStore } from '@/lib/drill/drill-store'

type TaskOption = 4 | 5 | 9 | 11 | 12 | 14
const TASK_ORDER: TaskOption[] = [4, 5, 9, 11, 12, 14]

type Props = {
  taskCounts: Record<number, number>
  mechanismStats: Record<number, Record<string, number>>
  onStartSession: (taskNumber: number, mode: DrillMode) => void
}

const MODE_ICONS: Record<DrillMode, React.ElementType> = {
  quick: Zap,
  normal: Target,
  massacre: Flame,
  errors: RotateCcw,
}

export default function DrillDashboard({ taskCounts, mechanismStats, onStartSession }: Props) {
  const { byItemId } = useDrillProgressStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp duration={0.5}>
        <div className="text-center space-y-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Мясорубка заданий</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Не угадывай. Докажи механизм.
          </p>
          <p className="text-xs text-muted-foreground">
            Ответ без механизма = жёлтая зона. Цель — не просто попасть в букву, а понять, почему.
          </p>
        </div>
      </FadeUp>

      {/* Task cards */}
      <div className="space-y-4">
        {TASK_ORDER.map((taskNum, i) => {
          const meta = TASK_META[taskNum]
          const count = taskCounts[taskNum] ?? 0
          const mechs = mechanismStats[taskNum] ?? {}
          const mechKeys = Object.keys(mechs)

          // Count errors for this task
          const errorCount = Object.values(byItemId).filter(
            (p) => p.taskNumber === taskNum && (p.wrongCount > 0 || p.guessedCount > 0)
          ).length
          const hasErrors = errorCount > 0

          return (
            <FadeUp key={taskNum} delay={0.05 * i} duration={0.4}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-5">
                  {/* Title row */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-lg">
                      {meta.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base">
                          №{taskNum} {meta.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {count}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {meta.description}
                      </p>
                    </div>
                  </div>

                  {/* Mechanism badges */}
                  {mechKeys.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {mechKeys.map((mech) => (
                        <Badge key={mech} variant="outline" className="text-[10px] px-1.5 py-0">
                          {mech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Mode buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['quick', 'normal', 'massacre', 'errors'] as DrillMode[]).map((mode) => {
                      const config = DRILL_MODE_CONFIG[mode]
                      const Icon = MODE_ICONS[mode]
                      const isErrors = mode === 'errors'
                      const disabled = isErrors && !hasErrors

                      return (
                        <Button
                          key={mode}
                          variant={isErrors ? 'outline' : 'default'}
                          size="sm"
                          disabled={disabled}
                          onClick={() => onStartSession(taskNum, mode)}
                          className="text-xs gap-1.5"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{config.label}</span>
                          {!isErrors && (
                            <span className="text-[10px] opacity-70">{config.size}</span>
                          )}
                        </Button>
                      )
                    })}
                  </div>

                  {/* Error count info */}
                  {isErrors && (
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {hasErrors ? `${errorCount} заданий с ошибками` : 'Ошибок пока нет'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </FadeUp>
          )
        })}
      </div>

      {/* Bottom hint */}
      <FadeUp delay={0.4} duration={0.4}>
        <Card className="border-0 shadow-sm bg-amber-50 border border-amber-200">
          <CardContent className="p-4 flex items-start gap-3">
            <Flame className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Мясорубка — это не тест, это тренировка механизма.
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Каждый раз выбирай ответ и доказывай механизм. Угадал ответ без механизма — жёлтая зона.
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </div>
  )
}
