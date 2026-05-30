'use client'

import { useState, useCallback } from 'react'
import { FadeUp, Pop, SlideIn } from '@/lib/motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Target,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  Menu,
  X,
  HomeIcon,
  ArrowRight,
  Trophy,
  RotateCcw,
  ChevronDown,
  AlertTriangle,
  PenTool,
  MessageSquare,
  FileText,
  Clock,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useLesson30Store, type BlockId30, type PracticeAnswer30 } from '@/lib/store-30'
import { LESSON_30_META } from '@/lib/lesson-data-30'
import Block12VerbsParticiples from '@/components/lesson-3005/Block12VerbsParticiples'
import Block11Suffixes from '@/components/lesson-3005/Block11Suffixes'
import Block14Spelling from '@/components/lesson-3005/Block14Spelling'
import Block2325MacrotextControl from '@/components/lesson-3005/Block2325MacrotextControl'
import Lesson3005Homework from '@/components/lesson-3005/Lesson3005Homework'

// ─── Block definitions with time estimates ────────────────────────────────────
const BLOCKS: {
  id: BlockId30
  label: string
  shortLabel: string
  icon: React.ReactNode
  color: string
  component: React.ReactNode
  timeEstimate: string
  isRequired: boolean
}[] = [
  {
    id: 'block12',
    label: '№12. Глаголы и причастия',
    shortLabel: '№12 — Глаголы',
    icon: <PenTool className="h-4 w-4" />,
    color: 'emerald',
    component: <Block12VerbsParticiples />,
    timeEstimate: '~30 мин',
    isRequired: true,
  },
  {
    id: 'block11',
    label: '№11. Суффиксы',
    shortLabel: '№11 — Суффиксы',
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'teal',
    component: <Block11Suffixes />,
    timeEstimate: '~25 мин',
    isRequired: true,
  },
  {
    id: 'block14',
    label: '№14. Слитно, раздельно, дефис',
    shortLabel: '№14 — Слит/разд',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'orange',
    component: <Block14Spelling />,
    timeEstimate: '~30 мин',
    isRequired: true,
  },
  {
    id: 'block2325',
    label: '23–25. Макротекст (доп.)',
    shortLabel: '23–25 — Доп.',
    icon: <FileText className="h-4 w-4" />,
    color: 'sky',
    component: <Block2325MacrotextControl />,
    timeEstimate: '~10 мин',
    isRequired: false,
  },
  {
    id: 'homework',
    label: 'Домашнее задание',
    shortLabel: 'Домашка',
    icon: <ClipboardList className="h-4 w-4" />,
    color: 'amber',
    component: <Lesson3005Homework />,
    timeEstimate: '~15 мин',
    isRequired: true,
  },
]

const colorClasses: Record<string, { bg: string; text: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', badge: 'bg-teal-100 text-teal-700 border-teal-300' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700 border-orange-300' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-600', badge: 'bg-sky-100 text-sky-700 border-sky-300' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-300' },
}

// ─── Required blocks (progress counter) vs final steps vs optional ──────────
const REQUIRED_BLOCK_IDS: BlockId30[] = ['block12', 'block11', 'block14']
const MAIN_BLOCK_IDS: BlockId30[] = ['block12', 'block11', 'block14', 'homework']

// ─── Error Review Component ─────────────────────────────────────────────────

function ErrorReviewSection({
  practiceAnswers,
  errorNotes,
  blocks,
}: {
  practiceAnswers: Record<string, PracticeAnswer30>
  errorNotes: Record<string, string>
  blocks: typeof BLOCKS
}) {
  const [open, setOpen] = useState(false)

  const incorrectByBlock = blocks
    .filter((b) => b.id !== 'homework' && b.id !== 'block2325')
    .map((block) => {
      const errors = Object.values(practiceAnswers).filter(
        (a) => a.blockId === block.id && a.status === 'incorrect'
      )
      return { block, errors }
    })
    .filter((group) => group.errors.length > 0)

  if (incorrectByBlock.length === 0) return null

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="text-left">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 hover:bg-accent/50 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-rose-500" />
              <span className="font-semibold text-sm">
                Обзор ошибок ({Object.values(practiceAnswers).filter((a) => a.status === 'incorrect').length})
              </span>
            </div>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3 max-h-80 overflow-y-auto">
            {incorrectByBlock.map(({ block, errors }) => {
              const c = colorClasses[block.color]
              return (
                <div key={block.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
                      {block.icon}
                    </div>
                    <span className="text-sm font-medium">{block.label}</span>
                    <Badge variant="outline" className="text-xs text-rose-600 border-rose-300">
                      {errors.length} ошибок
                    </Badge>
                  </div>
                  <div className="ml-8 space-y-1.5">
                    {errors.map((error) => (
                      <div
                        key={error.questionId}
                        className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 p-2.5"
                      >
                        <p className="text-xs text-foreground">
                          <span className="font-medium">Ответ:</span> {error.answer}
                        </p>
                        {error.mechanism && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <span className="font-medium">Механизм:</span> {error.mechanism}
                          </p>
                        )}
                        {errorNotes[error.questionId] && (
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                            <span className="font-medium">Заметка:</span> {errorNotes[error.questionId]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Lesson30View() {
  const {
    lessonStarted,
    startLesson,
    completedBlocks,
    blockProgress,
    practiceAnswers,
    errorNotes,
    resetLesson,
  } = useLesson30Store()

  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Overall progress: X / 3 required blocks (not counting homework or optional)
  const totalRequired = REQUIRED_BLOCK_IDS.length // 3
  const completedRequiredCount = REQUIRED_BLOCK_IDS.filter((id) => completedBlocks.includes(id)).length
  const overallProgress = Math.round((completedRequiredCount / totalRequired) * 100)

  const mainBlocksCompleted = MAIN_BLOCK_IDS.filter((id) => completedBlocks.includes(id)).length
  const allMainBlocksCompleted = mainBlocksCompleted === MAIN_BLOCK_IDS.length

  const totalCorrect = Object.values(blockProgress).reduce((s, b) => s + b.correctCount, 0)
  const totalIncorrect = Object.values(blockProgress).reduce((s, b) => s + b.incorrectCount, 0)

  // Effective blocks: add completion step when all main blocks are done
  const COMPLETION_STEP = {
    id: 'completion' as BlockId30,
    label: 'Урок завершён',
    shortLabel: 'Завершён',
    icon: <Trophy className="h-4 w-4" />,
    color: 'emerald',
    component: null as React.ReactNode,
    timeEstimate: '',
    isRequired: true,
  }

  const effectiveBlocks = allMainBlocksCompleted ? [...BLOCKS, COMPLETION_STEP] : BLOCKS
  const totalSteps = effectiveBlocks.length
  const currentBlock = effectiveBlocks[activeStep]
  const isCompletionStep = allMainBlocksCompleted && activeStep === BLOCKS.length

  const goNext = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1))
    setSidebarOpen(false)
  }, [totalSteps])

  const goPrev = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
    setSidebarOpen(false)
  }, [])

  const goToStep = useCallback((index: number) => {
    setActiveStep(index)
    setSidebarOpen(false)
  }, [])

  const handleResetProgress = useCallback(() => {
    resetLesson()
    router.push('/lessons')
  }, [resetLesson, router])

  // ─── Hero / Welcome screen ───────────────────────────────────────────────
  if (!lessonStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <FadeUp duration={0.6} className="max-w-2xl w-full">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <Pop delay={0.2} className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-emerald-600" />
                </Pop>
                <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Сегодня закрываем грязную орфографию
                </CardTitle>
                <p className="text-muted-foreground mt-1 text-lg">
                  Орфография без угадайки
                </p>
                <p className="text-muted-foreground text-sm">
                  {LESSON_30_META.date}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Goal */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-emerald-900 mb-1">Цель урока</h3>
                      <p className="text-emerald-800 text-sm leading-relaxed">
                        {LESSON_30_META.goal}
                      </p>
                    </div>
                  </div>
                </div>

                {/* What we cover */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Сегодня проходим
                  </h3>
                  <div className="space-y-2">
                    {LESSON_30_META.todayWeCover.map((item, i) => (
                      <SlideIn
                        key={i}
                        direction={-1}
                        delay={0.3 + i * 0.08}
                        className="flex items-start gap-2 text-sm"
                      >
                        <ChevronRight className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </SlideIn>
                    ))}
                  </div>
                </div>

                {/* What we don't cover */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    Сегодня НЕ трогаем
                  </h3>
                  <ul className="space-y-2">
                    {LESSON_30_META.todayWeDont.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-rose-400 mt-0.5">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Main phrase */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-amber-900 font-medium italic">
                    &ldquo;{LESSON_30_META.mainPhrase}&rdquo;
                  </p>
                </div>

                {/* Block list preview with time estimates */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 text-sm">
                    Блоки урока
                  </h3>
                  <div className="space-y-2">
                    {BLOCKS.map((block, i) => {
                      const c = colorClasses[block.color]
                      return (
                        <div
                          key={block.id}
                          className="flex items-center gap-2 rounded-lg border p-2.5 text-sm"
                        >
                          <div className={`w-7 h-7 rounded-md ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
                            {block.icon}
                          </div>
                          <span className="text-xs font-medium flex-1 truncate">{block.shortLabel}</span>
                          {!block.isRequired && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 shrink-0">
                              доп.
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />
                            {block.timeEstimate}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Start button */}
                <FadeUp delay={0.8}>
                  <Button
                    onClick={startLesson}
                    size="lg"
                    className="w-full text-lg h-14 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Начать с №12
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </FadeUp>
              </CardContent>
            </Card>
          </FadeUp>
        </main>

        <footer className="py-4 text-center text-xs text-muted-foreground border-t bg-white">
          ЕГЭ Русский: Алгоритмы и практика · {LESSON_30_META.date}
        </footer>
      </div>
    )
  }

  // ─── Main lesson view — one block at a time ──────────────────────────────
  const c = colorClasses[currentBlock.color]
  const isCompleted = !isCompletionStep && completedBlocks.includes(currentBlock.id)
  const hasErrors = !isCompletionStep && blockProgress[currentBlock.id]?.incorrectCount > 0

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* ─── Top bar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Left: home button + menu button + current block */}
            <div className="flex items-center gap-1 min-w-0">
              <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/lessons" aria-label="К урокам">
                  <HomeIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Меню блоков"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-md ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
                  {currentBlock.icon}
                </div>
                <span className="text-sm font-semibold truncate">{currentBlock.shortLabel}</span>
                {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                {hasErrors && <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
              </div>
            </div>

            {/* Right: step counter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">
                {completedRequiredCount}/{totalRequired} обяз.
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pb-1.5">
            <Progress value={overallProgress} className="h-1" />
          </div>
        </div>

        {/* ─── Sidebar / Block list ─── */}
        {sidebarOpen && (
          <div className="border-t">
            <div className="max-w-3xl mx-auto p-3 space-y-1 bg-white">
              {/* Overall stats */}
              <div className="mb-3 px-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Обязательных блоков</span>
                  <span>{completedRequiredCount}/{totalRequired}</span>
                </div>
                <Progress value={overallProgress} className="h-1.5" />
                <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {totalCorrect}
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-rose-500" /> {totalIncorrect}
                  </span>
                </div>
              </div>
              <Separator className="mb-2" />

              {effectiveBlocks.map((block, i) => {
                const bc = colorClasses[block.color]
                const blockCompleted = block.id === 'completion' ? false : completedBlocks.includes(block.id)
                const blockErrors = block.id === 'completion' ? false : blockProgress[block.id]?.incorrectCount > 0
                const isActive = i === activeStep

                return (
                  <button
                    key={block.id}
                    onClick={() => goToStep(i)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                      ${isActive
                        ? 'bg-emerald-50 text-emerald-800 font-medium'
                        : 'hover:bg-slate-50 text-muted-foreground'
                      }
                    `}
                  >
                    <div className={`w-7 h-7 rounded-md ${bc.bg} ${bc.text} flex items-center justify-center shrink-0`}>
                      {block.icon}
                    </div>
                    <span className="flex-1 text-left">{block.label}</span>
                    {!block.isRequired && block.id !== 'completion' && (
                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 shrink-0">
                        доп.
                      </Badge>
                    )}
                    {block.timeEstimate && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {block.timeEstimate}
                      </span>
                    )}
                    {blockCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                    {blockErrors && <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* ─── Content area ──────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <FadeUp key={currentBlock.id} duration={0.25}>
            {isCompletionStep ? (
              /* ─── Lesson Completion Screen ────────────────────────────── */
              <Card className="border-0 shadow-lg">
                <CardContent className="py-10 px-6 text-center space-y-6">
                  {/* Celebration icon */}
                  <Pop delay={0.15} className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-emerald-600" />
                  </Pop>

                  {/* Title */}
                  <FadeUp delay={0.3}>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Урок завершён!
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Все {MAIN_BLOCK_IDS.length} основных блока пройдены
                    </p>
                  </FadeUp>

                  {/* Stats */}
                  <FadeUp delay={0.45} className="flex justify-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{mainBlocksCompleted}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Блоков пройдено</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{totalCorrect}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Правильных</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-500">{totalIncorrect}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Ошибок</div>
                    </div>
                  </FadeUp>

                  <Separator />

                  {/* Error Review */}
                  {totalIncorrect > 0 && (
                    <FadeUp delay={0.55}>
                      <ErrorReviewSection
                        practiceAnswers={practiceAnswers}
                        errorNotes={errorNotes}
                        blocks={BLOCKS}
                      />
                    </FadeUp>
                  )}

                  <Separator />

                  {/* Actions */}
                  <FadeUp delay={0.6} className="space-y-3 max-w-xs mx-auto">
                    <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 min-h-[48px]">
                      <Link href="/">
                        <HomeIcon className="h-4 w-4 mr-2" />
                        На главную
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full min-h-[48px]">
                      <Link href="/lessons">
                        <BookOpen className="h-4 w-4 mr-2" />
                        К урокам
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 min-h-[48px]"
                      onClick={handleResetProgress}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Сбросить прогресс
                    </Button>
                  </FadeUp>
                </CardContent>
              </Card>
            ) : (
              /* ─── Block component ── */
              currentBlock.component
            )}
        </FadeUp>
      </main>

      {/* ─── Bottom navigation bar ─────────────────────────────────────────── */}
      <div className="sticky bottom-0 z-40 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrev}
              disabled={activeStep === 0}
              className="shrink-0 min-h-[44px]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Назад</span>
            </Button>

            {/* Step dots — 44px touch targets */}
            <div className="flex-1 flex items-center justify-center gap-0.5">
              {effectiveBlocks.map((block, i) => {
                const isBlockCompleted = block.id === 'completion' ? false : completedBlocks.includes(block.id)
                const isActive = i === activeStep
                return (
                  <button
                    key={block.id}
                    onClick={() => goToStep(i)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={`Блок ${block.shortLabel}`}
                  >
                    <span
                      className={`
                        block rounded-full transition-all
                        ${isActive
                          ? 'w-6 h-2.5 bg-emerald-500'
                          : isBlockCompleted
                            ? 'w-2.5 h-2.5 bg-emerald-300'
                            : !block.isRequired
                              ? 'w-2.5 h-2.5 bg-sky-200'
                              : 'w-2.5 h-2.5 bg-slate-200'
                        }
                      `}
                    />
                  </button>
                )
              })}
            </div>

            <Button
              size="sm"
              onClick={goNext}
              disabled={activeStep === totalSteps - 1}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 min-h-[44px]"
            >
              <span>Далее</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Next block hint */}
          {activeStep < totalSteps - 1 && (
            <p className="text-center text-xs text-muted-foreground mt-1.5">
              Далее: {effectiveBlocks[activeStep + 1].shortLabel}
              {!effectiveBlocks[activeStep + 1].isRequired && ' (доп.)'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
