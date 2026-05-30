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
import { useLesson30Store } from '@/lib/store-30'
import {
  BLOCK14_WHAT_IT_CHECKS,
  BLOCK14_HOW_TO_THINK,
  BLOCK14_FULL_EXAMPLES,
  BLOCK14_ALGORITHM,
  BLOCK14_WORKED_EXAMPLES,
  BLOCK14_PRACTICE,
  BLOCK14_SUMMARY,
  BLOCK_SUMMARY_META,
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

// ─── Compact Worked Example Card ─────────────────────────────────────────────

function CompactExampleCard({
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

// ─── Full Example Card (Breakdown tab) ───────────────────────────────────────

function FullExampleCard({
  example,
}: {
  example: (typeof BLOCK14_FULL_EXAMPLES)[number]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-semibold text-foreground leading-snug">
                  {example.prompt}
                </CardTitle>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {example.mechanismLabel}
                  </Badge>
                  <Rotate rotated={open}>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Rotate>
                </div>
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2 space-y-3">
            {/* Step-by-step breakdown */}
            <div className="space-y-2">
              {example.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-3"
                >
                  <span className="flex items-center justify-center size-6 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-sky-700 dark:text-sky-300 mb-0.5">
                      {step.label}
                    </p>
                    <p className="text-sm text-sky-900 dark:text-sky-200">
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Wrong path / trap */}
            <div className="rounded-lg bg-rose-50 dark:bg-amber-950/40 border border-rose-200 dark:border-amber-800 p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="size-4 text-rose-500 dark:text-amber-400 shrink-0" />
                <p className="text-xs font-bold text-rose-700 dark:text-amber-400">
                  Ловушка
                </p>
              </div>
              <p className="text-sm text-rose-800 dark:text-amber-300">
                {example.wrongPath}
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Section tabs type ───────────────────────────────────────────────────────

type SectionKey = 'what-it-checks' | 'how-to-think' | 'breakdown' | 'practice' | 'summary'

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Block14Spelling() {
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

  const isCompleted = completedBlocks.includes('block14')
  const progress = blockProgress['block14']

  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b14p')
  ).length

  const correctCount = progress.correctCount
  const incorrectCount = progress.incorrectCount

  const isSummaryConfirmed = blockSummaryConfirmed['block14'] ?? false
  const canComplete = answeredCount >= 6 || isSummaryConfirmed

  const handleComplete = useCallback(() => {
    markBlockCompleted('block14')
  }, [markBlockCompleted])

  const handleConfirmSummary = useCallback(() => {
    confirmBlockSummary('block14')
    markBlockCompleted('block14')
  }, [confirmBlockSummary, markBlockCompleted])

  const sections: { key: SectionKey; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { key: 'what-it-checks', label: 'Что проверяет', shortLabel: 'Провер.', icon: Eye },
    { key: 'how-to-think', label: 'Как думать', shortLabel: 'Думать', icon: Lightbulb },
    { key: 'breakdown', label: 'Разбор', shortLabel: 'Разбор', icon: BookOpen },
    { key: 'practice', label: 'Практика', shortLabel: 'Практ.', icon: Sparkles },
    { key: 'summary', label: 'Итог', shortLabel: 'Итог', icon: ListChecks },
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
              className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors flex-1 justify-center min-h-[44px] ${
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

      {/* ── Tab 1: Что проверяет ── */}
      {activeSection === 'what-it-checks' && (
        <FadeUp key="what-it-checks" duration={0.3} className="space-y-4">
          {/* What the task wants */}
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
            <Eye className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
              Что проверяет задание №14
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              {BLOCK14_WHAT_IT_CHECKS.whatTaskWants}
            </AlertDescription>
          </Alert>

          {/* Common mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="size-5 text-rose-500" />
                Типичные ошибки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {BLOCK14_WHAT_IT_CHECKS.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="flex items-center justify-center size-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed pt-0.5">{mistake}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Saving mechanism */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <ThumbsUp className="size-5" />
                Спасительный механизм
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
                {BLOCK14_WHAT_IT_CHECKS.savingMechanism}
              </p>
            </CardContent>
          </Card>

          {/* Key phrase */}
          <div className="rounded-lg bg-muted border p-4 text-center">
            <p className="text-sm font-semibold text-foreground">
              №14 не про «как пишется», а про «что это в предложении».
            </p>
          </div>
        </FadeUp>
      )}

      {/* ── Tab 2: Как думать ── */}
      {activeSection === 'how-to-think' && (
        <FadeUp key="how-to-think" duration={0.3} className="space-y-4">
          {/* Key phrase alert */}
          <Alert className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800">
            <Lightbulb className="size-4 text-emerald-600 dark:text-emerald-400" />
            <AlertTitle className="text-emerald-800 dark:text-emerald-300">
              Главное правило мысли
            </AlertTitle>
            <AlertDescription className="text-emerald-700 dark:text-emerald-400">
              №14 не про «как пишется», а про «что это в предложении».
            </AlertDescription>
          </Alert>

          {/* Visual step cards */}
          <div className="space-y-3">
            {BLOCK14_HOW_TO_THINK.map((item, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug break-words">
                        {item.step}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <ArrowRight className="size-4 text-emerald-500 shrink-0" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium break-words">
                          {item.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeUp>
      )}

      {/* ── Tab 3: Разбор ── */}
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
            {BLOCK14_FULL_EXAMPLES.map((example) => (
              <FullExampleCard key={example.id} example={example} />
            ))}
          </div>

          <Separator />

          {/* Compact reference cards from existing worked examples */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Быстрый справочник
            </p>
            <div className="space-y-3">
              {BLOCK14_WORKED_EXAMPLES.map((example) => (
                <CompactExampleCard key={example.id} example={example} />
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      {/* ── Tab 4: Практика ── */}
      {activeSection === 'practice' && (
        <FadeUp key="practice" duration={0.3} className="space-y-4">
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
            <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
              Запишите правильное написание конструкции и выберите механизм.
            </AlertDescription>
          </Alert>

          <MechanismTrainer
            blockId="block14"
            items={practiceItems}
            mechanismOptions={MECHANISM_OPTIONS}
            totalItems={BLOCK14_PRACTICE.length}
            minToComplete={6}
            answerPlaceholder="например: так же — раздельно"
            answerLabel="Запишите правильное написание конструкции"
            instructionText="Запишите правильное написание конструкции и выберите механизм"
          />
        </FadeUp>
      )}

      {/* ── Tab 5: Итог ── */}
      {activeSection === 'summary' && (
        <FadeUp key="summary" duration={0.3} className="space-y-4">
          {/* 3 key points */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-500" />
                3 главных вывода
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {BLOCK14_SUMMARY.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="flex items-center justify-center size-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed pt-1">{point}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Typical mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-500" />
                Типичные ошибки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {BLOCK14_SUMMARY.typicalMistakes.map((mistake, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* КЭС + Что повторить + Домашка */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">КЭС</p>
                <p className="text-sm text-foreground">{BLOCK_SUMMARY_META.block14.kes.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Что повторить</p>
                <p className="text-sm text-foreground">{BLOCK_SUMMARY_META.block14.reviewTopics.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Домашка по теме</p>
                <p className="text-sm text-foreground">{BLOCK_SUMMARY_META.block14.homeworkRef}</p>
              </div>
            </CardContent>
          </Card>

          {/* Confirm block button */}
          {isSummaryConfirmed ? (
            <Button
              variant="outline"
              disabled
              className="w-full min-h-[48px] text-base"
            >
              <CheckCircle2 className="size-5 mr-2" />
              Итог зафиксировan ✓
            </Button>
          ) : (
            <Button
              onClick={handleConfirmSummary}
              className="w-full min-h-[48px] text-base bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="size-5 mr-2" />
              Зафиксировал итог
            </Button>
          )}
        </FadeUp>
      )}

      <Separator />

      {/* Bottom bar — Complete Block */}
      {isCompleted ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3">
          <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Блок завершён ✓</span>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {canComplete
                ? 'Готовы завершить блок?'
                : 'Пройдите минимум 6 из 8 заданий или зафиксируйте итог'}
            </p>
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
