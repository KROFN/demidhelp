'use client'

import React, { useState, useCallback } from 'react'
import { FadeUp, Rotate } from '@/lib/motion'
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Lightbulb,
  Eye,
  ListChecks,
  ThumbsUp,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useLesson30Store, type BlockId30 } from '@/lib/store-30'
import {
  BLOCK12_WHAT_IT_CHECKS,
  BLOCK12_HOW_TO_THINK,
  BLOCK12_FULL_EXAMPLES,
  BLOCK12_ALGORITHM,
  BLOCK12_WORKED_EXAMPLES,
  BLOCK12_PRACTICE,
  BLOCK12_SUMMARY,
  BLOCK_SUMMARY_META,
  type Block12Mechanism,
} from '@/lib/lesson-data-30'
import MechanismTrainer, { type MechanismOption, type PracticeItem } from '@/components/lesson-3005/MechanismTrainer'

// ─── Mechanism label mapping ─────────────────────────────────────────────────

const MECHANISM_OPTIONS: MechanismOption[] = [
  { value: 'conjugation', label: 'спряжение' },
  { value: 'present-participle-active', label: 'причастие наст. времени (действ.)' },
  { value: 'present-participle-passive', label: 'причастие наст. времени (страд.)' },
  { value: 'past-infinitive', label: 'прошедшее / инфинитив' },
  { value: 'imperative', label: 'повелительное наклонение' },
  { value: 'trap', label: 'исключение / мина' },
]

// ─── Section tabs type ───────────────────────────────────────────────────────

type SectionKey = 'what-it-checks' | 'how-to-think' | 'breakdown' | 'practice' | 'summary'

// ─── Full Example Card ───────────────────────────────────────────────────────

function FullExampleCard({
  example,
}: {
  example: (typeof BLOCK12_FULL_EXAMPLES)[number]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-base font-semibold text-foreground">
                    {example.word}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {example.mechanismLabel}
                  </Badge>
                </div>
                <Rotate rotated={open}>
                  <ChevronDown className="size-5 text-muted-foreground shrink-0" />
                </Rotate>
              </div>
              <CardDescription className="mt-1">
                Ответ: <strong>{example.answer}</strong>
              </CardDescription>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2 space-y-0">
            {example.steps.map((step, i) => (
              <div
                key={i}
                className={`py-3 ${i > 0 ? 'border-t border-border/50' : ''}`}
              >
                <p className="text-xs font-bold text-primary mb-1">{step.label}</p>
                <p className="text-sm text-foreground">{step.content}</p>
              </div>
            ))}
            {/* Trap / wrongPath */}
            <div className="mt-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-0.5">
                    Ловушка
                  </p>
                  <p className="text-sm text-rose-800 dark:text-rose-300">
                    {example.wrongPath}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Compact Worked Example Card ─────────────────────────────────────────────

function WorkedExampleCard({
  example,
}: {
  example: (typeof BLOCK12_WORKED_EXAMPLES)[number]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-base font-semibold text-foreground">
                    {example.word}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {example.mechanismLabel}
                  </Badge>
                </div>
                <Rotate rotated={open}>
                  <ChevronDown className="size-5 text-muted-foreground shrink-0" />
                </Rotate>
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2 space-y-2">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                Ответ
              </p>
              <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                {example.answer}
              </p>
            </div>
            <p className="text-sm text-foreground">{example.explanation}</p>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Block12VerbsParticiples() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
    blockSummaryConfirmed,
    confirmBlockSummary,
  } = useLesson30Store()

  const [activeSection, setActiveSection] = useState<SectionKey>('what-it-checks')

  const isCompleted = completedBlocks.includes('block12')
  const progress = blockProgress['block12']
  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b12p')
  ).length
  const isSummaryConfirmed = blockSummaryConfirmed['block12'] ?? false
  const canComplete = answeredCount >= 6 || isSummaryConfirmed

  const handleComplete = useCallback(() => {
    markBlockCompleted('block12')
  }, [markBlockCompleted])

  const handleConfirmSummary = useCallback(() => {
    confirmBlockSummary('block12')
    markBlockCompleted('block12')
  }, [confirmBlockSummary, markBlockCompleted])

  const sections: { key: SectionKey; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { key: 'what-it-checks', label: 'Что проверяет', shortLabel: 'Провер.', icon: Eye },
    { key: 'how-to-think', label: 'Как думать', shortLabel: 'Думать', icon: Lightbulb },
    { key: 'breakdown', label: 'Разбор', shortLabel: 'Разбор', icon: BookOpen },
    { key: 'practice', label: 'Практика', shortLabel: 'Практ.', icon: Sparkles },
    { key: 'summary', label: 'Итог', shortLabel: 'Итог', icon: ListChecks },
  ]

  const allSectionsVisited = sections.every((s) =>
    (visitedSections['block12'] ?? []).includes(s.key)
  )

  // Prepare practice items for MechanismTrainer
  const practiceItems: PracticeItem[] = BLOCK12_PRACTICE.map((q) => ({
    id: q.id,
    word: q.word,
    answer: q.answer,
    mechanism: q.mechanism,
    mechanismLabel: q.mechanismLabel,
    explanation: q.explanation,
  }))

  // Status text for bottom bar
  let statusText = ''
  if (answeredCount >= 6 && isSummaryConfirmed) {
    statusText = 'Практика пройдена · Блок зафиксирован'
  } else if (isSummaryConfirmed) {
    statusText = 'Блок зафиксирован'
  } else if (answeredCount >= 6) {
    statusText = 'Практика пройдена'
  }

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
                markSectionVisited('block12', section.key)
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

      {/* ─── Tab 1: Что проверяет ─── */}
      {activeSection === 'what-it-checks' && (
        <FadeUp key="what-it-checks" duration={0.3} className="space-y-4">
          {/* What the task wants */}
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
            <Eye className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
              Что проверяет задание
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              {BLOCK12_WHAT_IT_CHECKS.whatTaskWants}
            </AlertDescription>
          </Alert>

          {/* Common mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <XCircle className="size-5 text-rose-500" />
                Типичные ошибки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {BLOCK12_WHAT_IT_CHECKS.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex items-center justify-center size-6 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{mistake}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Saving mechanism */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <ThumbsUp className="size-5" />
                Спасительный механизм
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                  {BLOCK12_WHAT_IT_CHECKS.savingMechanism}
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      )}

      {/* ─── Tab 2: Как думать ─── */}
      {activeSection === 'how-to-think' && (
        <FadeUp key="how-to-think" duration={0.3} className="space-y-4">
          {/* Key phrase */}
          <Alert className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800">
            <Lightbulb className="size-4 text-emerald-600 dark:text-emerald-400" />
            <AlertTitle className="text-emerald-800 dark:text-emerald-300">
              Ключевая фраза
            </AlertTitle>
            <AlertDescription className="text-emerald-700 dark:text-emerald-400 font-medium">
              Сначала производящий глагол. Потом спряжение или инфинитив.
            </AlertDescription>
          </Alert>

          {/* Visual step cards — route style */}
          <div className="space-y-0">
            {BLOCK12_HOW_TO_THINK.map((item, i) => (
              <div key={i} className="relative">
                {/* Connector arrow between steps */}
                {i > 0 && (
                  <div className="flex justify-center py-1">
                    <ArrowRight className="size-4 text-muted-foreground/50 -rotate-90" />
                  </div>
                )}
                <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-bold text-foreground">{item.step}</p>
                        <p className="text-sm text-muted-foreground">{item.action}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </FadeUp>
      )}

      {/* ─── Tab 3: Разбор ─── */}
      {activeSection === 'breakdown' && (
        <FadeUp key="breakdown" duration={0.3} className="space-y-4">
          <Alert className="border-sky-300 bg-sky-50 dark:bg-sky-950/40 dark:border-sky-800">
            <BookOpen className="size-4 text-sky-600 dark:text-sky-400" />
            <AlertDescription className="text-sky-700 dark:text-sky-400 text-sm">
              Пошаговый разбор заданий
            </AlertDescription>
          </Alert>

          {/* Full worked examples */}
          <div className="space-y-3">
            {BLOCK12_FULL_EXAMPLES.map((example) => (
              <FullExampleCard key={example.id} example={example} />
            ))}
          </div>

          {/* Compact worked examples reference */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Быстрый справочник
            </h3>
            <div className="space-y-2">
              {BLOCK12_WORKED_EXAMPLES.map((example) => (
                <WorkedExampleCard key={example.id} example={example} />
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      {/* ─── Tab 4: Практика ─── */}
      {activeSection === 'practice' && (
        <FadeUp key="practice" duration={0.3} className="space-y-4">
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
            <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
              Вставьте пропущенную букву и выберите механизм, по которому определяется гласная.
            </AlertDescription>
          </Alert>

          <MechanismTrainer
            blockId="block12"
            items={practiceItems}
            mechanismOptions={MECHANISM_OPTIONS}
            totalItems={BLOCK12_PRACTICE.length}
            minToComplete={6}
            answerPlaceholder="напишите полное слово..."
            answerLabel="Запишите слово целиком"
            instructionText="Запишите слово целиком и выберите механизм"
          />
        </FadeUp>
      )}

      {/* ─── Tab 5: Итог ─── */}
      {activeSection === 'summary' && (
        <FadeUp key="summary" duration={0.3} className="space-y-4">
          {/* 3 key points */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ListChecks className="size-5 text-primary" />
                3 главных вывода
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {BLOCK12_SUMMARY.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{point}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Typical mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="size-5" />
                Типичные ошибки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {BLOCK12_SUMMARY.typicalMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Confirm block button + КЭС */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">КЭС</p>
                <p className="text-sm text-foreground">{BLOCK_SUMMARY_META.block12.kes.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Что повторить</p>
                <p className="text-sm text-foreground">{BLOCK_SUMMARY_META.block12.reviewTopics.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Домашка по теме</p>
                <p className="text-sm text-foreground">{BLOCK_SUMMARY_META.block12.homeworkRef}</p>
              </div>
            </CardContent>
          </Card>

          {isSummaryConfirmed ? (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Итог зафиксировan ✓
              </span>
            </div>
          ) : (
            <Button
              onClick={handleConfirmSummary}
              className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
            >
              <CheckCircle2 className="size-5 mr-2" />
              Зафиксировал итог
            </Button>
          )}
        </FadeUp>
      )}

      <Separator />

      {/* Complete Block */}
      {isCompleted ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3">
          <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Блок завершён ✓</span>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            {statusText ? (
              <p className="text-sm text-muted-foreground">
                {statusText}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Пройдите минимум 6 из {BLOCK12_PRACTICE.length} заданий или зафиксируйте итог
              </p>
            )}
            {canComplete && !allSectionsVisited && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Совет: посетите все вкладки блока перед завершением
              </p>
            )}
          </div>
          <Button
            onClick={handleComplete}
            disabled={!canComplete}
            className="min-h-[44px]"
          >
            <CheckCircle2 className="size-4 mr-2" />
            Завершить блок
          </Button>
        </div>
      )}
    </div>
  )
}
