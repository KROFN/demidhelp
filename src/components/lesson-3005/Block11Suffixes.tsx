'use client'

import React, { useState, useCallback } from 'react'
import { FadeUp, Rotate } from '@/lib/motion'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Sparkles,
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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { useLesson30Store } from '@/lib/store-30'
import {
  BLOCK11_WHAT_IT_CHECKS,
  BLOCK11_HOW_TO_THINK,
  BLOCK11_FULL_EXAMPLES,
  BLOCK11_ALGORITHM,
  BLOCK11_WORKED_EXAMPLES,
  BLOCK11_PRACTICE,
  BLOCK11_SUMMARY,
  BLOCK_SUMMARY_META,
  type Block11Mechanism,
} from '@/lib/lesson-data-30'
import MechanismTrainer, { type MechanismOption, type PracticeItem } from '@/components/lesson-3005/MechanismTrainer'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MECHANISM_OPTIONS: MechanismOption[] = [
  { value: 'adjective', label: 'прилагательное' },
  { value: 'noun', label: 'существительное' },
  { value: 'verb', label: 'глагол' },
  { value: 'adverb', label: 'наречие' },
  { value: 'trap', label: 'исключение / мина' },
]

// ─── Section definitions ────────────────────────────────────────────────────

type SectionKey = 'what-it-checks' | 'how-to-think' | 'breakdown' | 'practice' | 'summary'

const sections: { key: SectionKey; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { key: 'what-it-checks', label: 'Что проверяет', shortLabel: 'Провер.', icon: Eye },
  { key: 'how-to-think', label: 'Как думать', shortLabel: 'Думать', icon: Lightbulb },
  { key: 'breakdown', label: 'Разбор', shortLabel: 'Разбор', icon: BookOpen },
  { key: 'practice', label: 'Практика', shortLabel: 'Практ.', icon: Sparkles },
  { key: 'summary', label: 'Итог', shortLabel: 'Итог', icon: ListChecks },
]

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Block11Suffixes() {
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

  const isCompleted = completedBlocks.includes('block11')
  const summaryConfirmed = blockSummaryConfirmed['block11'] ?? false

  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b11p')
  ).length

  const canComplete = answeredCount >= 6 || summaryConfirmed

  const allSectionsVisited = sections.every((s) =>
    (visitedSections['block11'] ?? []).includes(s.key)
  )

  const handleTabSwitch = useCallback(
    (key: SectionKey) => {
      setActiveSection(key)
      markSectionVisited('block11', key)
    },
    [markSectionVisited],
  )

  const handleConfirmSummary = useCallback(() => {
    confirmBlockSummary('block11')
    markBlockCompleted('block11')
  }, [confirmBlockSummary, markBlockCompleted])

  // Prepare practice items for MechanismTrainer
  const practiceItems: PracticeItem[] = BLOCK11_PRACTICE.map((q) => ({
    id: q.id,
    word: q.word,
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
              onClick={() => handleTabSwitch(section.key)}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors flex-1 justify-center min-h-[44px] ${
                activeSection === section.key
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="sm:hidden text-xs">{section.shortLabel}</span>
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          )
        })}
      </div>

      {/* ─────────────────── Tab 1: Что проверяет ─────────────────── */}
      {activeSection === 'what-it-checks' && (
        <FadeUp key="what-it-checks" duration={0.3} className="space-y-4">
          {/* What the task wants */}
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
            <Eye className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
              Что проверяет задание №11
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              {BLOCK11_WHAT_IT_CHECKS.whatTaskWants}
            </AlertDescription>
          </Alert>

          {/* Common mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="size-4 text-rose-500" />
                Типичные ошибки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {BLOCK11_WHAT_IT_CHECKS.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex items-center justify-center size-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {mistake}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Saving mechanism */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <ThumbsUp className="size-4" />
                Спасательный механизм
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                {BLOCK11_WHAT_IT_CHECKS.savingMechanism}
              </p>
              <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Сначала часть речи. Потом суффикс.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      )}

      {/* ─────────────────── Tab 2: Как думать ─────────────────── */}
      {activeSection === 'how-to-think' && (
        <FadeUp key="how-to-think" duration={0.3} className="space-y-4">
          {/* Key phrase */}
          <Alert className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800">
            <Lightbulb className="size-4 text-emerald-600 dark:text-emerald-400" />
            <AlertTitle className="text-emerald-800 dark:text-emerald-300">
              Сначала часть речи. Потом суффикс.
            </AlertTitle>
          </Alert>

          {/* Visual step cards */}
          <div className="space-y-3">
            {BLOCK11_HOW_TO_THINK.map((item, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {item.step}
                      </p>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
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

      {/* ─────────────────── Tab 3: Разбор ─────────────────── */}
      {activeSection === 'breakdown' && (
        <FadeUp key="breakdown" duration={0.3} className="space-y-4">
          {/* Sub-alert */}
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
            <BookOpen className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
              Пошаговый разбор заданий
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
              Раскройте каждый пример, чтобы увидеть полный ход рассуждения.
            </AlertDescription>
          </Alert>

          {/* Full worked examples — collapsible */}
          <div className="space-y-3">
            {BLOCK11_FULL_EXAMPLES.map((example) => (
              <CollapsibleExample key={example.id} example={example} />
            ))}
          </div>

          {/* Compact reference: existing worked examples */}
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="size-4" />
              Краткие примеры для повторения
            </p>
            <div className="space-y-2">
              {BLOCK11_WORKED_EXAMPLES.map((example) => (
                <Card key={example.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {example.mechanismLabel}
                      </Badge>
                      <span className="text-sm font-medium">
                        {example.word} → <span className="text-emerald-600 dark:text-emerald-400">{example.answer}</span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {example.explanation}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      {/* ─────────────────── Tab 4: Практика ─────────────────── */}
      {activeSection === 'practice' && (
        <FadeUp key="practice" duration={0.3} className="space-y-4">
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
            <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
              Запишите слово целиком и выберите механизм (часть речи / тип).
            </AlertDescription>
          </Alert>

          <MechanismTrainer
            blockId="block11"
            items={practiceItems}
            mechanismOptions={MECHANISM_OPTIONS}
            totalItems={BLOCK11_PRACTICE.length}
            minToComplete={6}
            answerPlaceholder="напишите полное слово..."
            answerLabel="Запишите слово целиком"
            instructionText="Запишите слово целиком и выберите механизм"
          />
        </FadeUp>
      )}

      {/* ─────────────────── Tab 5: Итог ─────────────────── */}
      {activeSection === 'summary' && (
        <FadeUp key="summary" duration={0.3} className="space-y-4">
          {/* 3 key points */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">3 главных вывода</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {BLOCK11_SUMMARY.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex items-center justify-center size-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Typical mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                Типичные ошибки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {BLOCK11_SUMMARY.typicalMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {mistake}
                    </span>
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
                <p className="text-sm text-foreground">{BLOCK_SUMMARY_META.block11.kes.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Что повторить</p>
                <p className="text-sm text-foreground">{BLOCK_SUMMARY_META.block11.reviewTopics.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Домашка по теме</p>
                <p className="text-sm text-foreground">{BLOCK_SUMMARY_META.block11.homeworkRef}</p>
              </div>
            </CardContent>
          </Card>

          {/* Confirm button */}
          {summaryConfirmed ? (
            <Button
              variant="outline"
              disabled
              className="w-full min-h-[48px]"
            >
              <CheckCircle2 className="size-4 mr-2" />
              Итог зафиксировan ✓
            </Button>
          ) : (
            <Button
              onClick={handleConfirmSummary}
              className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <ThumbsUp className="size-4 mr-2" />
              Зафиксировал итог
            </Button>
          )}
        </FadeUp>
      )}

      <Separator />

      {/* Bottom bar */}
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
            {canComplete && !allSectionsVisited && !isCompleted && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Совет: посетите все вкладки блока перед завершением
              </p>
            )}
          </div>
          <Button
            onClick={() => markBlockCompleted('block11')}
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

// ─── Collapsible Example sub-component ──────────────────────────────────────

function CollapsibleExample({
  example,
}: {
  example: {
    id: string
    word: string
    answer: string
    mechanism: Block11Mechanism
    mechanismLabel: string
    steps: readonly { label: string; content: string }[]
    wrongPath: string
  }
}) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs shrink-0">
                  {example.mechanismLabel}
                </Badge>
                <CardTitle className="text-base font-semibold flex-1">
                  {example.word} → <span className="text-emerald-600 dark:text-emerald-400">{example.answer}</span>
                </CardTitle>
                <Rotate rotated={open}>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Rotate>
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            {/* Steps */}
            <div className="space-y-2">
              {example.steps.map((step, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-semibold text-foreground mb-0.5">
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Wrong path / trap */}
            <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3">
              <div className="flex items-start gap-2">
                <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-300 mb-0.5">
                    Ловушка
                  </p>
                  <p className="text-sm text-rose-600 dark:text-rose-400 leading-relaxed">
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
