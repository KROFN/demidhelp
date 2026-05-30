'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { FadeUp, SlideIn } from '@/lib/motion'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Eye,
  EyeOff,
  Shuffle,
  ChevronDown,
  ChevronUp,
  PenLine,
  Layers,
  Brain,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useLessonStore } from '@/lib/store'
import { BLOCK22_GROUP1, BLOCK22_GROUP2, BLOCK22_RECOGNITION_TASKS, block22Content } from '@/lib/lesson-data'

// ─── Types ───────────────────────────────────────────────────────────────────

type IVSItem = (typeof BLOCK22_GROUP1)[number] | (typeof BLOCK22_GROUP2)[number]

interface SelfTestState {
  currentItem: IVSItem | null
  definitionInput: string
  howToFindInput: string
  submitted: boolean
}

// ─── Algorithm Panel ─────────────────────────────────────────────────────────

function Algorithm22Panel() {
  const [open, setOpen] = useState(false)

  const steps = block22Content.algorithm22.steps

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-teal-300 bg-teal-50/80 dark:bg-teal-950/30 dark:border-teal-800 backdrop-blur-sm shadow-sm">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-3 text-left hover:bg-teal-100/50 dark:hover:bg-teal-900/30 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-semibold text-teal-800 dark:text-teal-300">
                {block22Content.algorithm22.title}
              </span>
            </div>
            {open ? (
              <ChevronUp className="size-4 text-teal-600 dark:text-teal-400" />
            ) : (
              <ChevronDown className="size-4 text-teal-600 dark:text-teal-400" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 px-3">
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <SlideIn key={i} direction={-1} delay={i * 0.08} duration={0.25} className="flex gap-2 text-sm text-teal-800 dark:text-teal-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-200 dark:bg-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </SlideIn>
              ))}
            </ol>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── IVS Card (Flippable/Expandable) ────────────────────────────────────────

function IVSCard({
  item,
  groupLabel,
  groupColor,
}: {
  item: IVSItem
  groupLabel: string
  groupColor: 'teal' | 'violet'
}) {
  const [expanded, setExpanded] = useState(false)

  const colorMap = {
    teal: {
      badgeBg: 'bg-teal-100 dark:bg-teal-900',
      badgeText: 'text-teal-700 dark:text-teal-300',
      badgeBorder: 'border-teal-300 dark:border-teal-700',
      borderHover: 'hover:border-teal-400 dark:hover:border-teal-600',
      accentBg: 'bg-teal-50 dark:bg-teal-950/30',
      accentText: 'text-teal-700 dark:text-teal-300',
    },
    violet: {
      badgeBg: 'bg-violet-100 dark:bg-violet-900',
      badgeText: 'text-violet-700 dark:text-violet-300',
      badgeBorder: 'border-violet-300 dark:border-violet-700',
      borderHover: 'hover:border-violet-400 dark:hover:border-violet-600',
      accentBg: 'bg-violet-50 dark:bg-violet-950/30',
      accentText: 'text-violet-700 dark:text-violet-300',
    },
  }

  const c = colorMap[groupColor]

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <Card className={`transition-all ${c.borderHover}`}>
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base">{item.name}</CardTitle>
                <Badge
                  variant="outline"
                  className={`text-xs ${c.badgeBg} ${c.badgeText} ${c.badgeBorder}`}
                >
                  {groupLabel}
                </Badge>
                <div className="ml-auto">
                  {expanded ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <CardDescription className="text-sm mt-1">{item.definition}</CardDescription>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            <Separator />
            {/* How to find */}
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                <Eye className="size-3" />
                Как найти:
              </p>
              <p className="text-sm text-emerald-800 dark:text-emerald-300">{item.howToFind}</p>
            </div>

            {/* Difference */}
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                <AlertTriangle className="size-3" />
                Отличие:
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300">{item.difference}</p>
            </div>

            {/* Example */}
            <div className="rounded-lg bg-muted/50 border p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <BookOpen className="size-3" />
                Пример:
              </p>
              <p className="text-sm text-foreground whitespace-pre-line">{item.example}</p>
              {'exampleExplanation' in item && item.exampleExplanation && (
                <p className="text-xs italic text-muted-foreground mt-1">{item.exampleExplanation}</p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Recognition By Task ────────────────────────────────────────────────────

function RecognitionByTask() {
  const tasks = useMemo(() => BLOCK22_RECOGNITION_TASKS, [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set())

  const task = tasks[currentIndex]
  const isLast = currentIndex >= tasks.length - 1
  const attemptedCount = attemptedIds.size

  const handleReveal = useCallback(() => {
    setRevealed(true)
    setAttemptedIds((prev) => {
      const next = new Set(prev)
      next.add(task.id)
      return next
    })
  }, [task.id])

  const handleNext = useCallback(() => {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1)
      setRevealed(false)
    }
  }, [isLast])

  return (
    <Card className="border-teal-200 dark:border-teal-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="size-5 text-teal-600 dark:text-teal-400" />
          <CardTitle className="text-lg">Распознавание ИВС</CardTitle>
        </div>
        <CardDescription>
          Прочитайте фрагмент и определите средство выразительности.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Задание {currentIndex + 1} из {tasks.length}</span>
          <span>·</span>
          <span>Попыток: {attemptedCount}</span>
        </div>

        {/* Text fragment */}
        <div className="rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-950/20 p-5">
          <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{task.text}</p>
        </div>

        {/* Question */}
        <p className="text-sm font-medium text-foreground">{task.question}</p>

        {/* Reveal / Answer */}
        {!revealed ? (
          <Button onClick={handleReveal} className="w-full">
            <EyeOff className="size-4 mr-2" />
            Показать ответ
          </Button>
        ) : (
          <FadeUp duration={0.3} className="space-y-3">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  Ответ:
                </p>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  {task.answerName}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                  Пояснение:
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  {task.explanation}
                </p>
              </div>
              {!isLast && (
                <Button onClick={handleNext} variant="default" className="w-full">
                  <Shuffle className="size-4 mr-2" />
                  Следующее
                </Button>
              )}
              {isLast && (
                <p className="text-sm text-muted-foreground text-center">
                  Все задания просмотрены!
                </p>
              )}
          </FadeUp>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Self-Test (Recognition Trainer) ────────────────────────────────────────

function RecognitionTrainer() {
  const { setPracticeAnswer } = useLessonStore()

  const allItems = useMemo(() => [...BLOCK22_GROUP1, ...BLOCK22_GROUP2], [])

  const pickRandomItem = useCallback((): IVSItem => {
    const idx = Math.floor(Math.random() * allItems.length)
    return allItems[idx]
  }, [allItems])

  const [state, setState] = useState<SelfTestState>(() => ({
    currentItem: allItems[Math.floor(Math.random() * allItems.length)],
    definitionInput: '',
    howToFindInput: '',
    submitted: false,
  }))

  const [answeredCount, setAnsweredCount] = useState(0)

  const pickRandom = useCallback(() => {
    setState({
      currentItem: pickRandomItem(),
      definitionInput: '',
      howToFindInput: '',
      submitted: false,
    })
  }, [pickRandomItem])

  const handleSubmit = useCallback(() => {
    if (!state.definitionInput.trim() || !state.howToFindInput.trim() || !state.currentItem) return

    setState((prev) => ({ ...prev, submitted: true }))
    setAnsweredCount((prev) => prev + 1)

    // Store answer in practice answers for tracking
    const isDefClose =
      state.definitionInput.trim().toLowerCase().includes(
        state.currentItem.definition.toLowerCase().split(' ')[0]
      ) || state.currentItem.definition.toLowerCase().includes(state.definitionInput.trim().toLowerCase().split(' ')[0])

    const isHowClose =
      state.howToFindInput.trim().length > 5

    const status: 'correct' | 'incorrect' = isDefClose && isHowClose ? 'correct' : 'incorrect'

    setPracticeAnswer({
      questionId: `ivs-self-${state.currentItem.id}-${Date.now()}`,
      blockId: 'block22',
      answer: state.definitionInput.trim(),
      status,
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [state, setPracticeAnswer])

  const handleNext = useCallback(() => {
    pickRandom()
  }, [pickRandom])

  if (!state.currentItem) return null

  return (
    <Card className="border-violet-200 dark:border-violet-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="size-5 text-violet-600 dark:text-violet-400" />
          <CardTitle className="text-lg">Тренажёр распознавания</CardTitle>
        </div>
        <CardDescription>
          Проверьте, помните ли вы признаки ИВС. Назовите определение и как найти средство.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Notice */}
        <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
            {block22Content.trainerNotice}
          </AlertDescription>
        </Alert>

        {/* Question */}
        <div className="rounded-xl border-2 border-dashed border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20 p-6 text-center">
          <p className="text-xs text-muted-foreground mb-2">Назовите средство:</p>
          <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">
            {state.currentItem.name}
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Определение:
            </label>
            <Input
              placeholder="Введите определение..."
              value={state.definitionInput}
              onChange={(e) =>
                setState((prev) => ({ ...prev, definitionInput: e.target.value }))
              }
              disabled={state.submitted}
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Как найти (признак):
            </label>
            <Textarea
              placeholder="Как вы будете искать это средство в тексте..."
              value={state.howToFindInput}
              onChange={(e) =>
                setState((prev) => ({ ...prev, howToFindInput: e.target.value }))
              }
              disabled={state.submitted}
              className="text-sm min-h-[60px]"
            />
          </div>
        </div>

        {/* Submit / Next */}
        {!state.submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!state.definitionInput.trim() || !state.howToFindInput.trim()}
            className="w-full"
          >
            <Sparkles className="size-4 mr-2" />
            Проверить
          </Button>
        ) : (
          <div className="space-y-3">
            {/* Correct answers */}
            <FadeUp duration={0.3} className="space-y-3">
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 space-y-2">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Правильное определение:
                  </p>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    {state.currentItem.definition}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 space-y-2">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Как найти:
                  </p>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    {state.currentItem.howToFind}
                  </p>
                </div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 space-y-2">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    Отличие от похожих:
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    {state.currentItem.difference}
                  </p>
                </div>
            </FadeUp>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Попыток: {answeredCount}
              </span>
              <Button onClick={handleNext} variant="default">
                <Shuffle className="size-4 mr-2" />
                Следующее средство
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Block22IVS() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    practiceAnswers,
    visitedSections,
    markSectionVisited,
  } = useLessonStore()

  const [activeSection, setActiveSection] = useState<'theory' | 'recognition' | 'trainer'>('theory')

  const isCompleted = completedBlocks.includes('block22')
  const progress = blockProgress['block22']

  const visited = visitedSections['block22'] ?? []
  const requiredSections = ['theory', 'recognition', 'trainer']
  const visitedCount = requiredSections.filter((s) => visited.includes(s)).length
  const allSectionsVisited = visitedCount === requiredSections.length

  const ivsAnswerCount = Object.keys(practiceAnswers).filter((id) =>
    id.startsWith('ivs-self-')
  ).length

  const handleComplete = useCallback(() => {
    markBlockCompleted('block22')
  }, [markBlockCompleted])

  const sections = [
    { key: 'theory' as const, label: 'Теория и карточки', shortLabel: 'Теор.', icon: BookOpen },
    { key: 'recognition' as const, label: 'Распознавание', shortLabel: 'Расп.', icon: Eye },
    { key: 'trainer' as const, label: 'Запоминание', shortLabel: 'Запом.', icon: PenLine },
  ]

  const handleTabClick = useCallback((key: 'theory' | 'recognition' | 'trainer') => {
    setActiveSection(key)
    markSectionVisited('block22', key)
  }, [markSectionVisited])

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.key}
              onClick={() => handleTabClick(section.key)}
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
            {/* Algorithm 22 — inside theory tab */}
            <Algorithm22Panel />

            {/* Intro Section */}
            <Card className="border-teal-200 dark:border-teal-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="size-5 text-teal-600 dark:text-teal-400" />
                  <CardTitle className="text-lg">{block22Content.twoGroups.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  ИВС делятся на две группы:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 p-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-200 dark:bg-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <p className="text-sm text-teal-800 dark:text-teal-300 pt-0.5">
                      <strong>{block22Content.twoGroups.group1}</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 p-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <p className="text-sm text-violet-800 dark:text-violet-300 pt-0.5">
                      <strong>{block22Content.twoGroups.group2}</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Group A: Видно глазами */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="size-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-bold text-foreground">
                  Группа А: Видно глазами
                </h3>
                <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 border-teal-300">
                  {BLOCK22_GROUP1.length} средств
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {BLOCK22_GROUP1.map((item) => (
                  <IVSCard
                    key={item.id}
                    item={item}
                    groupLabel="видно глазами"
                    groupColor="teal"
                  />
                ))}
              </div>
            </div>

            {/* Group B: Надо понять образ */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="size-5 text-violet-600 dark:text-violet-400" />
                <h3 className="text-lg font-bold text-foreground">
                  Группа Б: Надо понять образ
                </h3>
                <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 border-violet-300">
                  {BLOCK22_GROUP2.length} средств
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {BLOCK22_GROUP2.map((item) => (
                  <IVSCard
                    key={item.id}
                    item={item}
                    groupLabel="образ"
                    groupColor="violet"
                  />
                ))}
              </div>
            </div>

            {/* Hint about Algorithm */}
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
              <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">
                Помните алгоритм!
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                {block22Content.hintAboutAlgorithm}
              </AlertDescription>
            </Alert>
        </FadeUp>
      )}

      {/* Recognition Section */}
      {activeSection === 'recognition' && (
        <FadeUp key="recognition" duration={0.3} className="space-y-4">
            <RecognitionByTask />
        </FadeUp>
      )}

      {/* Trainer Section */}
      {activeSection === 'trainer' && (
        <FadeUp key="trainer" duration={0.3} className="space-y-4">
            <RecognitionTrainer />
        </FadeUp>
      )}

      <Separator />

      {/* Complete Block */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isCompleted
            ? 'Блок пройден.'
            : allSectionsVisited
              ? 'Все разделы просмотрены. Можете завершить блок.'
              : `Посмотрите все разделы: ${visitedCount} из ${requiredSections.length} просмотрено`}
        </p>
        <Button
          onClick={handleComplete}
          disabled={isCompleted || !allSectionsVisited}
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
