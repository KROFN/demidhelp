'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { FadeUp } from '@/lib/motion'
import {
  ClipboardList,
  CheckCircle2,
  ListChecks,
  AlertTriangle,
  BookOpen,
  Zap,
  ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useLesson30Store } from '@/lib/store-30'
import {
  HOMEWORK_30_MAIN,
  HOMEWORK_30_LIGHT,
  HOMEWORK_30_ERROR_MECHANISMS,
  HOMEWORK_30_FORMAT,
  LESSON_3005_KES,
  LESSON_3005_OPTIONAL_KES,
} from '@/lib/lesson-data-30'

// ─── Task Row ─────────────────────────────────────────────────────────────────

function HomeworkTaskRow({
  task,
  index,
  mode,
  checked,
  onCheckChange,
}: {
  task: { task: string; title: string; count: number; note?: string }
  index: number
  mode: 'main' | 'light'
  checked: boolean
  onCheckChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/30">
      <Checkbox
        id={`hw-${mode}-${index}`}
        checked={checked}
        onCheckedChange={(val) => onCheckChange(!!val)}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <Label
          htmlFor={`hw-${mode}-${index}`}
          className="cursor-pointer flex items-center gap-2 flex-wrap"
        >
          <Badge variant="secondary" className="shrink-0 text-xs">
            {task.task}
          </Badge>
          <span className="text-sm font-semibold break-words">{task.title}</span>
          <span className="text-sm text-primary font-medium">({task.count})</span>
        </Label>
        {task.note && (
          <p className="text-xs text-muted-foreground mt-1 ml-0">{task.note}</p>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Lesson3005Homework() {
  const {
    completedBlocks,
    markBlockCompleted,
    markSectionVisited,
    visitedSections,
    homeworkMode,
    setHomeworkMode,
    homeworkChecks,
    setHomeworkChecks,
  } = useLesson30Store()

  const isCompleted = completedBlocks.includes('homework')

  const currentTasks = homeworkMode === 'main' ? HOMEWORK_30_MAIN : HOMEWORK_30_LIGHT
  const modeKey = homeworkMode

  // Initialize / sync checkbox state for the current mode
  const currentChecks: boolean[] = homeworkChecks[modeKey]
    ? [...homeworkChecks[modeKey]]
    : currentTasks.map(() => false)

  useEffect(() => {
    // Mark section as visited on mount
    markSectionVisited('homework', 'content')
  }, [markSectionVisited])

  const handleCheckChange = useCallback(
    (index: number, checked: boolean) => {
      const updated = [...currentChecks]
      updated[index] = checked
      setHomeworkChecks({ ...homeworkChecks, [modeKey]: updated })
    },
    [currentChecks, modeKey, homeworkChecks, setHomeworkChecks]
  )

  const handleModeSwitch = useCallback(
    (mode: 'main' | 'light') => {
      setHomeworkMode(mode)
    },
    [setHomeworkMode]
  )

  const handleComplete = useCallback(() => {
    markBlockCompleted('homework')
  }, [markBlockCompleted])

  const modeTabs = [
    { key: 'main' as const, label: 'Основная', shortLabel: 'Осн.', icon: BookOpen },
    { key: 'light' as const, label: 'Лёгкая', shortLabel: 'Лёгк.', icon: Zap },
  ]

  const completedCount = currentChecks.filter(Boolean).length
  const totalTasks = currentTasks.length

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {modeTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => handleModeSwitch(tab.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors flex-1 justify-center ${
                homeworkMode === tab.key
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              <span className="sm:hidden text-xs">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <FadeUp key={homeworkMode} duration={0.3} className="space-y-6">
          {/* Task list */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="size-5" />
                {homeworkMode === 'main' ? 'Основная домашка' : 'Лёгкая домашка'}
              </CardTitle>
              <CardDescription>
                {completedCount} из {totalTasks} заданий отмечено как выполненные
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {currentTasks.map((task, i) => (
                  <HomeworkTaskRow
                    key={`${modeKey}-${task.task}`}
                    task={task}
                    index={i}
                    mode={homeworkMode}
                    checked={currentChecks[i] ?? false}
                    onCheckChange={(checked) => handleCheckChange(i, checked)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Where to get tasks */}
          <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800">
            <BookOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
            <AlertTitle className="text-emerald-800 dark:text-emerald-300">
              Где брать задания
            </AlertTitle>
            <AlertDescription className="text-emerald-700 dark:text-emerald-400 text-sm">
              Задания выдаёт преподаватель из корпуса.
              Формат сдачи: номер задания → ответ → если ошибка, механизм ошибки.
            </AlertDescription>
          </Alert>

          {/* КЭС урока — collapsible */}
          <Collapsible>
            <Card>
              <CollapsibleTrigger asChild>
                <button className="w-full text-left p-4 flex items-center justify-between hover:bg-accent/30 transition-colors rounded-lg">
                  <div className="flex items-center gap-2">
                    <ListChecks className="size-5 text-primary" />
                    <span className="text-sm font-semibold">КЭС урока</span>
                  </div>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-2">
                  {LESSON_3005_KES.map((item) => (
                    <div key={item.task} className="flex items-start gap-2 text-sm">
                      <Badge variant="outline" className="shrink-0 text-xs">{item.task}</Badge>
                      <span className="text-muted-foreground">{item.codes.join(', ')}</span>
                      <span className="text-foreground">— {item.title}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <p className="text-xs text-muted-foreground font-medium">Дополнительный блок 23–25</p>
                  {LESSON_3005_OPTIONAL_KES.map((item) => (
                    <div key={item.task} className="flex items-start gap-2 text-sm">
                      <Badge variant="outline" className="shrink-0 text-xs">{item.task}</Badge>
                      <span className="text-muted-foreground">{item.codes.join(', ')}</span>
                      <span className="text-foreground">— {item.title}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Format instruction */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800">
            <ListChecks className="size-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">
              Формат оформления
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              {HOMEWORK_30_FORMAT}
            </AlertDescription>
          </Alert>

          {/* Error mechanisms reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="size-5" />
                Механизмы ошибок — справочник
              </CardTitle>
              <CardDescription>
                Используйте эти формулировки при описании ошибок
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {HOMEWORK_30_ERROR_MECHANISMS.map((mechanism, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border p-2.5 text-sm"
                  >
                    <Badge variant="outline" className="shrink-0 text-xs font-mono">
                      {i + 1}
                    </Badge>
                    <span className="text-sm">{mechanism}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </FadeUp>

      <Separator />

      {/* Complete button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">
          Ознакомьтесь с информацией выше
        </p>
        <Button
          onClick={handleComplete}
          disabled={isCompleted}
          variant={isCompleted ? 'outline' : 'default'}
          className="min-h-[44px]"
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              Домашка просмотрена
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              Отметить как просмотренную
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
