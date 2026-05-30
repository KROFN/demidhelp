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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useLesson30Store, type BlockId30 } from '@/lib/store-30'
import {
  BLOCK12_ALGORITHM,
  BLOCK12_WORKED_EXAMPLES,
  BLOCK12_PRACTICE,
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

function mechanismLabel(value: Block12Mechanism): string {
  return MECHANISM_OPTIONS.find((m) => m.value === value)?.label ?? value
}

// ─── Algorithm Step Card ─────────────────────────────────────────────────────

function AlgorithmStepCard({
  step,
  index,
}: {
  step: string
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                    {index + 1}
                  </span>
                  <CardTitle className="text-base font-semibold text-foreground">
                    Шаг {index + 1}
                  </CardTitle>
                </div>
                <Rotate rotated={open}>
                  <ChevronDown className="size-5 text-muted-foreground" />
                </Rotate>
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2">
            <div className="rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm text-sky-900 dark:text-sky-200">
                {step}
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Worked Example Card ─────────────────────────────────────────────────────

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
                <CardTitle className="text-base font-semibold text-foreground">
                  {example.word}
                </CardTitle>
                <Rotate rotated={open}>
                  <ChevronDown className="size-5 text-muted-foreground" />
                </Rotate>
              </div>
              <CardDescription className="mt-1">
                Ответ: <strong>{example.answer}</strong>
              </CardDescription>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2 space-y-3">
            <div className="space-y-3">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                  Ответ
                </p>
                <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                  {example.answer}
                </p>
              </div>
              <div className="rounded-lg bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 p-3">
                <p className="text-xs font-medium text-violet-700 dark:text-violet-400 mb-1">
                  Механизм
                </p>
                <p className="text-sm text-violet-900 dark:text-violet-200 font-medium">
                  {example.mechanismLabel}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-sm text-amber-900 dark:text-amber-200">
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

// ─── Section tabs type ───────────────────────────────────────────────────────

type SectionKey = 'theory' | 'algorithm' | 'practice'

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Block12VerbsParticiples() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLesson30Store()

  const [activeSection, setActiveSection] = useState<SectionKey>('theory')

  const isCompleted = completedBlocks.includes('block12')
  const progress = blockProgress['block12']
  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b12p')
  ).length
  const canComplete = answeredCount >= 6

  const handleComplete = useCallback(() => {
    markBlockCompleted('block12')
  }, [markBlockCompleted])

  const sections: { key: SectionKey; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { key: 'theory', label: 'Теория', shortLabel: 'Теор.', icon: Lightbulb },
    { key: 'algorithm', label: 'Алгоритм', shortLabel: 'Алг.', icon: BookOpen },
    { key: 'practice', label: 'Практика', shortLabel: 'Практ.', icon: Sparkles },
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

      {activeSection === 'theory' && (
        <FadeUp key="theory" duration={0.3} className="space-y-4">
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                Алгоритм определения буквы
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Не спрашивай «какая буква?». Сначала спроси: «что это за форма?»
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BLOCK12_ALGORITHM.map((step, i) => (
                <AlgorithmStepCard key={i} step={step} index={i} />
              ))}
            </div>
        </FadeUp>
      )}

      {/* Algorithm Section — worked examples */}
      {activeSection === 'algorithm' && (
        <FadeUp key="algorithm" duration={0.3} className="space-y-4">
            <Alert className="border-sky-300 bg-sky-50 dark:bg-sky-950/40 dark:border-sky-800">
              <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />
              <AlertDescription className="text-sky-700 dark:text-sky-400 text-sm">
                Разобранные примеры: раскройте карточку, чтобы увидеть механизм и объяснение.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {BLOCK12_WORKED_EXAMPLES.map((example) => (
                <WorkedExampleCard key={example.id} example={example} />
              ))}
            </div>
        </FadeUp>
      )}

      {/* Practice Section */}
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
              answerLabel="Вставьте пропущенную букву (напишите полное слово)"
            />
        </FadeUp>
      )}

      <Separator />

      {/* Complete Block */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {canComplete
              ? 'Достаточно заданий пройдено. Готовы завершить блок?'
              : `Осталось пройти ещё ${Math.max(0, 6 - answeredCount)} заданий (минимум 6 из ${BLOCK12_PRACTICE.length})`}
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
