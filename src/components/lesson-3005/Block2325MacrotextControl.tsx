'use client'

import React, { useState, useCallback } from 'react'
import { FadeUp, AnimatedWidth } from '@/lib/motion'
import {
  CheckCircle2,
  Lightbulb,
  ClipboardCheck,
  Clock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useLesson30Store } from '@/lib/store-30'
import {
  BLOCK2325_REMINDERS,
} from '@/lib/lesson-data-30'

// ─── Checklist items for honest control ──────────────────────────────────────

const CONTROL_CHECKLIST = [
  'Я знаю, что №23 требует сверки с текстом, а не с памятью',
  'Я знаю, что №24 проверяет тип речи и логическую связь по конкретным предложениям',
  'Я знаю, что №25 требует выписать ровно то слово/сочетание, которое просит задание',
  'Я готов применить эти напоминания на реальном тексте',
] as const

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Block2325MacrotextControl() {
  const {
    completedBlocks,
    markBlockCompleted,
    markSectionVisited,
    visitedSections,
  } = useLesson30Store()

  const [activeSection, setActiveSection] = useState<'reminders' | 'checklist'>('reminders')
  const [checklistState, setChecklistState] = useState<boolean[]>(
    () => CONTROL_CHECKLIST.map(() => false)
  )

  const isCompleted = completedBlocks.includes('block2325')

  const allChecked = checklistState.every(Boolean)

  const handleCheckChange = useCallback((index: number, checked: boolean) => {
    setChecklistState((prev) => {
      const next = [...prev]
      next[index] = checked
      return next
    })
  }, [])

  const handleComplete = useCallback(() => {
    markBlockCompleted('block2325')
  }, [markBlockCompleted])

  const sections = [
    { key: 'reminders' as const, label: 'Напоминания', shortLabel: 'Напом.', icon: Lightbulb },
    { key: 'checklist' as const, label: 'Чек-лист', shortLabel: 'Чекл.', icon: ClipboardCheck },
  ]

  const allSectionsVisited = sections.every((s) =>
    (visitedSections['block2325'] ?? []).includes(s.key)
  )

  return (
    <div className="space-y-6">
      {/* Optional badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
          <Clock className="h-3 w-3 mr-1" />
          Дополнительный блок
        </Badge>
      </div>

      <Alert className="border-sky-300 bg-sky-50 dark:bg-sky-950/40 dark:border-sky-800">
        <Lightbulb className="size-4 text-sky-600 dark:text-sky-400" />
        <AlertTitle className="text-sky-800 dark:text-sky-300">
          Дополнительный чек-лист 23–25
        </AlertTitle>
        <AlertDescription className="text-sky-700 dark:text-sky-400">
          Это не практика, а напоминание перед отдельным макротекстом.
        </AlertDescription>
      </Alert>

      {/* Section tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.key}
              onClick={() => {
                setActiveSection(section.key)
                markSectionVisited('block2325', section.key)
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

      {/* Reminders Section */}
      {activeSection === 'reminders' && (
        <FadeUp key="reminders" duration={0.3} className="space-y-4">
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                Напоминания перед макротекстом
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Запомните эти правила перед выполнением заданий 23–25.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BLOCK2325_REMINDERS.map((reminder, i) => (
                <Card key={i} className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">
                        {i + 1}
                      </Badge>
                      <p className="text-sm font-medium leading-relaxed">{reminder}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </FadeUp>
      )}

      {/* Checklist Section */}
      {activeSection === 'checklist' && (
        <FadeUp key="checklist" duration={0.3} className="space-y-4">
            <Alert className="border-sky-300 bg-sky-50 dark:bg-sky-950/40 dark:border-sky-800">
              <ClipboardCheck className="size-4 text-sky-600 dark:text-sky-400" />
              <AlertTitle className="text-sky-800 dark:text-sky-300">
                Контрольный чек-лист
              </AlertTitle>
              <AlertDescription className="text-sky-700 dark:text-sky-400">
                Подтвердите, что вы усвоили ключевые принципы заданий 23–25.
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="p-4 space-y-3">
                {CONTROL_CHECKLIST.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/30"
                  >
                    <Checkbox
                      id={`checklist-${i}`}
                      checked={checklistState[i]}
                      onCheckedChange={(val) => handleCheckChange(i, !!val)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={`checklist-${i}`}
                      className="cursor-pointer text-sm font-normal leading-snug"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Progress */}
            <div className="rounded-lg border bg-accent/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Прогресс чек-листа</span>
                <span className="text-sm text-muted-foreground">
                  {checklistState.filter(Boolean).length} из {CONTROL_CHECKLIST.length}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <AnimatedWidth
                  percentage={(checklistState.filter(Boolean).length / CONTROL_CHECKLIST.length) * 100}
                  duration={0.5}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>
            </div>
        </FadeUp>
      )}

      <Separator />

      {/* Complete Block */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {allChecked
              ? 'Все пункты подтверждены. Готовы завершить блок?'
              : `Подтвердите все ${CONTROL_CHECKLIST.length} пунктов чек-листа`}
          </p>
          {allChecked && !allSectionsVisited && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Совет: посетите все вкладки блока перед завершением
            </p>
          )}
        </div>
        <Button
          onClick={handleComplete}
          disabled={isCompleted || !allChecked}
          variant={isCompleted ? 'outline' : 'default'}
          className="min-h-[44px]"
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
