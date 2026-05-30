'use client'

import React, { useState, useCallback } from 'react'
import { FadeUp } from '@/lib/motion'
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lightbulb,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useLesson30Store } from '@/lib/store-30'
import {
  BLOCK11_ALGORITHM,
  BLOCK11_WORKED_EXAMPLES,
  BLOCK11_PRACTICE,
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

/** Map algorithm steps to a part-of-speech group based on keywords */
function getStepGroup(step: string): string {
  if (step.includes('прилагательное')) return 'прилагательное'
  if (step.includes('существительное')) return 'существительное'
  if (step.includes('глагол')) return 'глагол'
  if (step.includes('наречие')) return 'наречие'
  return 'общее'
}

const GROUP_ORDER = ['общее', 'прилагательное', 'существительное', 'глагол', 'наречие']
const GROUP_ICONS: Record<string, string> = {
  общее: '🔍',
  прилагательное: '📎',
  существительное: '📦',
  глагол: '🏃',
  наречие: '🧭',
}

// ─── Main Component ─────────────────────────────────────────────────────────

type SectionKey = 'theory' | 'algorithm' | 'practice'

export default function Block11Suffixes() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    markSectionVisited,
    visitedSections,
  } = useLesson30Store()

  const [activeSection, setActiveSection] = useState<SectionKey>('theory')

  const isCompleted = completedBlocks.includes('block11')
  const progress = blockProgress['block11']

  const answeredCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('b11p')
  ).length

  const canComplete = answeredCount >= 6

  const handleComplete = useCallback(() => {
    markBlockCompleted('block11')
  }, [markBlockCompleted])

  const sections: { key: SectionKey; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { key: 'theory', label: 'Теория', shortLabel: 'Теор.', icon: Lightbulb },
    { key: 'algorithm', label: 'Алгоритм', shortLabel: 'Алг.', icon: BookOpen },
    { key: 'practice', label: 'Практика', shortLabel: 'Практ.', icon: Sparkles },
  ]

  const allSectionsVisited = sections.every((s) =>
    (visitedSections['block11'] ?? []).includes(s.key)
  )

  // Group algorithm steps by part of speech
  const groupedSteps: Record<string, string[]> = {}
  BLOCK11_ALGORITHM.forEach((step, i) => {
    const group = getStepGroup(step)
    if (!groupedSteps[group]) groupedSteps[group] = []
    groupedSteps[group].push(`${i + 1}. ${step}`)
  })

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
              onClick={() => {
                setActiveSection(section.key)
                markSectionVisited('block11', section.key)
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

      {/* Sections */}
      {activeSection === 'theory' && (
        <FadeUp key="theory" duration={0.3} className="space-y-4">
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                Сначала часть речи!
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Не спрашивай &laquo;какая буква?&raquo;. Сначала спроси: &laquo;что это за форма?&raquo;
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Алгоритм решения задания №11</CardTitle>
                <CardDescription>
                  Определи часть речи → примени правило → запиши ответ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {GROUP_ORDER.map((group) => {
                  const steps = groupedSteps[group]
                  if (!steps || steps.length === 0) return null
                  return (
                    <div key={group} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{GROUP_ICONS[group]}</span>
                        <h4 className="text-sm font-semibold text-foreground capitalize">
                          {group}
                        </h4>
                      </div>
                      <ol className="space-y-1.5 pl-2">
                        {steps.map((step) => (
                          <li
                            key={step}
                            className="text-sm text-muted-foreground leading-relaxed"
                          >
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
        </FadeUp>
      )}

      {/* Algorithm Section — worked examples */}
      {activeSection === 'algorithm' && (
        <FadeUp key="algorithm" duration={0.3} className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="size-4" />
              <span>Разобранные примеры — изучите ход рассуждения</span>
            </div>

            <div className="space-y-3">
              {BLOCK11_WORKED_EXAMPLES.map((example) => (
                <Card key={example.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {example.mechanismLabel}
                      </Badge>
                      <CardTitle className="text-base font-semibold">
                        {example.word} → <span className="text-emerald-600 dark:text-emerald-400">{example.answer}</span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {example.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
                Вставьте пропущенную букву и выберите механизм (часть речи / тип). Нужно правильно заполнить и то, и другое.
              </AlertDescription>
            </Alert>

            <MechanismTrainer
              blockId="block11"
              items={practiceItems}
              mechanismOptions={MECHANISM_OPTIONS}
              totalItems={BLOCK11_PRACTICE.length}
              minToComplete={6}
              answerPlaceholder="издавна"
              answerLabel="Ответ (слово целиком)"
            />
        </FadeUp>
      )}

      <Separator />

      {/* Complete Block */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {canComplete
              ? 'Достаточно заданий пройдено. Готовы завершить блок?'
              : `Осталось пройти минимум ${Math.max(0, 6 - answeredCount)} заданий из 8`}
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
