'use client'

import React, { useState, useCallback } from 'react'
import { FadeUp, Rotate } from '@/lib/motion'
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  XCircle,
  AlertTriangle,
  Sparkles,
  Lightbulb,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useLesson30Store } from '@/lib/store-30'
import {
  BLOCK14_ALGORITHM,
  BLOCK14_WORKED_EXAMPLES,
  BLOCK14_PRACTICE,
  type Block14Mechanism,
} from '@/lib/lesson-data-30'
import MechanismTrainer, { type MechanismOption, type PracticeItem } from '@/components/lesson-3005/MechanismTrainer'

// ─── Mechanism label mapping ─────────────────────────────────────────────────

const MECHANISM_OPTIONS: MechanismOption[] = [
  { value: 'conjunction', label: 'союз' },
  { value: 'adverb', label: 'наречие' },
  { value: 'preposition', label: 'предлог' },
  { value: 'pronoun-preposition', label: 'местоимение с предлогом / частицей' },
  { value: 'particle', label: 'частица' },
  { value: 'hyphen', label: 'дефисная модель' },
  { value: 'pol', label: 'пол-' },
]

// ─── Algorithm step grouping ─────────────────────────────────────────────────

const ALGORITHM_GROUPS: { label: string; icon: string; stepIndices: number[] }[] = [
  { label: 'Союз', icon: '🔗', stepIndices: [1] },
  { label: 'Наречие', icon: '📍', stepIndices: [4] },
  { label: 'Предлог', icon: '📐', stepIndices: [3] },
  { label: 'Местоимение с предлогом / частицей', icon: '👤', stepIndices: [2] },
  { label: 'Частица', icon: '✨', stepIndices: [] },
  { label: 'Дефисная модель', icon: '➖', stepIndices: [5] },
  { label: 'Пол-', icon: '🔤', stepIndices: [6] },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function ExampleCard({
  example,
}: {
  example: (typeof BLOCK14_WORKED_EXAMPLES)[number]
}) {
  const [expanded, setExpanded] = useState(false)

  const mechanismLabel = MECHANISM_OPTIONS.find(o => o.value === example.mechanism)?.label ?? example.mechanism

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs shrink-0">
                  {mechanismLabel}
                </Badge>
                <Rotate rotated={expanded}>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Rotate>
              </div>
              <CardDescription className="mt-2 text-sm leading-relaxed">
                {example.prompt}
              </CardDescription>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            <div className="space-y-3">
              <div className="rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-3">
                <p className="text-xs font-medium text-sky-700 dark:text-sky-400 mb-1">
                  Слово / конструкция
                </p>
                <p className="text-sm text-sky-900 dark:text-sky-200 font-medium">
                  {example.word}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                  Ответ
                </p>
                <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                  {example.answer}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                  Механизм
                </p>
                <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
                  {example.mechanismLabel}
                </p>
              </div>
              <div className="rounded-lg bg-muted border p-3">
                <p className="text-sm text-foreground">
                  {example.explanation}
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

type SectionKey = 'theory' | 'algorithm' | 'practice'

export default function Block14Spelling() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLesson30Store()

  const [activeSection, setActiveSection] = useState<SectionKey>('theory')

  const isCompleted = completedBlocks.includes('block14')
  const progress = blockProgress['block14']

  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b14p')
  ).length

  const correctCount = progress.correctCount
  const incorrectCount = progress.incorrectCount

  const canComplete = answeredCount >= 6

  const handleComplete = useCallback(() => {
    markBlockCompleted('block14')
  }, [markBlockCompleted])

  const sections: { key: SectionKey; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { key: 'theory', label: 'Теория', shortLabel: 'Теор.', icon: Lightbulb },
    { key: 'algorithm', label: 'Алгоритм', shortLabel: 'Алг.', icon: BookOpen },
    { key: 'practice', label: 'Практика', shortLabel: 'Практ.', icon: Sparkles },
  ]

  const allSectionsVisited = sections.every((s) =>
    (visitedSections['block14'] ?? []).includes(s.key)
  )

  // Prepare practice items for MechanismTrainer
  const practiceItems: PracticeItem[] = BLOCK14_PRACTICE.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    answer: q.answer,
    mechanism: q.mechanism,
    mechanismLabel: q.mechanismLabel,
    explanation: q.explanation,
  }))

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
                markSectionVisited('block14', section.key)
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

      {/* Section content */}
      {activeSection === 'theory' && (
        <FadeUp key="theory" duration={0.3} className="space-y-4">
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                Алгоритм: Слитно, раздельно, дефис
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Сначала определи часть речи, потом решай написание.
              </AlertDescription>
            </Alert>

            {/* General steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Шаги алгоритма</CardTitle>
                <CardDescription>
                  Общий порядок определения написания
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {BLOCK14_ALGORITHM.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Grouped rules */}
            <div className="space-y-3">
              {ALGORITHM_GROUPS.filter((g) => g.stepIndices.length > 0).map(
                (group) => (
                  <Card key={group.label}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <span>{group.icon}</span>
                        {group.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {group.stepIndices.map((idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span className="text-primary font-medium shrink-0">
                              Шаг {idx + 1}:
                            </span>
                            <span>{BLOCK14_ALGORITHM[idx]}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
        </FadeUp>
      )}

      {/* ── Algorithm Section — examples ── */}
      {activeSection === 'algorithm' && (
        <FadeUp key="algorithm" duration={0.3} className="space-y-4">
            <Alert className="border-sky-300 bg-sky-50 dark:bg-sky-950/40 dark:border-sky-800">
              <BookOpen className="size-4 text-sky-600 dark:text-sky-400" />
              <AlertDescription className="text-sky-700 dark:text-sky-400 text-sm">
                Разбор примеров: нажмите на карточку, чтобы увидеть ответ и объяснение.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BLOCK14_WORKED_EXAMPLES.map((example) => (
                <ExampleCard key={example.id} example={example} />
              ))}
            </div>
        </FadeUp>
      )}

      {/* ── Practice Section ── */}
      {activeSection === 'practice' && (
        <FadeUp key="practice" duration={0.3} className="space-y-4">
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
                Определите написание и механизм для каждого задания. Нужно пройти минимум 6 из 8.
              </AlertDescription>
            </Alert>

            <MechanismTrainer
              blockId="block14"
              items={practiceItems}
              mechanismOptions={MECHANISM_OPTIONS}
              totalItems={BLOCK14_PRACTICE.length}
              minToComplete={6}
              answerPlaceholder="например: так же — раздельно"
              answerLabel="Напишите слово / конструкцию с правильным написанием"
            />
        </FadeUp>
      )}

      <Separator />

      {/* Complete Block */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {canComplete
              ? 'Минимум 6 заданий пройдено. Готовы завершить блок?'
              : `Осталось пройти ещё ${Math.max(0, 6 - answeredCount)} заданий для завершения`}
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
