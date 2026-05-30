'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

// ─── Block definitions ────────────────────────────────────────────────────────
type Lesson30Block = {
  id: BlockId30
  label: string
  shortLabel: string
  icon: React.ReactNode
  color: string
  component: React.ReactNode
}

type Lesson30Step = Omit<Lesson30Block, 'id'> & {
  id: BlockId30 | 'completion'
}

const BLOCKS: Lesson30Block[] = [
  {
    id: 'block12',
    label: '№12. Глаголы и причастия',
    shortLabel: 'Глаголы',
    icon: <PenTool className="h-4 w-4" />,
    color: 'emerald',
    component: <Block12VerbsParticiples />,
  },
  {
    id: 'block11',
    label: '№11. Суффиксы',
    shortLabel: 'Суффиксы',
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'teal',
    component: <Block11Suffixes />,
  },
  {
    id: 'block14',
    label: '№14. Слитно, раздельно, дефис',
    shortLabel: 'Слит/разд',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'orange',
    component: <Block14Spelling />,
  },
  {
    id: 'block2325',
    label: '№23–25. Макротекст',
    shortLabel: 'Макротекст',
    icon: <FileText className="h-4 w-4" />,
    color: 'sky',
    component: <Block2325MacrotextControl />,
  },
  {
    id: 'homework',
    label: 'Домашнее задание',
    shortLabel: 'Домашка',
    icon: <ClipboardList className="h-4 w-4" />,
    color: 'amber',
    component: <Lesson3005Homework />,
  },
]

const colorClasses: Record<string, { bg: string; text: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', badge: 'bg-teal-100 text-teal-700 border-teal-300' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700 border-orange-300' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-600', badge: 'bg-sky-100 text-sky-700 border-sky-300' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-300' },
}

// ─── Main block IDs used for completion check ────────────────────────────────
const MAIN_BLOCK_IDS: BlockId30[] = ['block12', 'block11', 'block14', 'block2325', 'homework']

const BLOCK_TIMES: Record<BlockId30, string> = {
  block12: '5–45',
  block11: '45–75',
  block14: '75–105',
  block2325: '105–115',
  homework: '115–120',
}

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
    .filter((b) => b.id !== 'homework')
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

  // Overall progress calculation
  const totalBlocks = MAIN_BLOCK_IDS.length
  const completedMainBlocks = MAIN_BLOCK_IDS.filter((id) => completedBlocks.includes(id)).length
  const overallProgress = Math.round((completedMainBlocks / totalBlocks) * 100)
  const allMainBlocksCompleted = completedMainBlocks === totalBlocks

  const totalCorrect = Object.values(blockProgress).reduce((s, b) => s + b.correctCount, 0)
  const totalIncorrect = Object.values(blockProgress).reduce((s, b) => s + b.incorrectCount, 0)

  // Effective blocks: add completion step when all main blocks are done
  const COMPLETION_STEP: Lesson30Step = {
    id: 'completion',
    label: 'Урок завершён',
    shortLabel: 'Завершён',
    icon: <Trophy className="h-4 w-4" />,
    color: 'emerald',
    component: null as React.ReactNode,
  }

  const effectiveBlocks: Lesson30Step[] = allMainBlocksCompleted ? [...BLOCKS, COMPLETION_STEP] : BLOCKS
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl w-full"
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center"
                >
                  <GraduationCap className="h-8 w-8 text-emerald-600" />
                </motion.div>
                <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Сегодня закрываем грязную орфографию
                </CardTitle>
                <p className="text-muted-foreground mt-2 text-base">
                  ЕГЭ русский — урок 30.05.2026 · Орфография без угадайки
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
                        Перестать выбирать букву по ощущению и решать через цепочку: форма слова → часть речи → правило → ответ.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Сегодня не учим всё подряд
                  </h3>
                  <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    <p>Закрываем три задания, где чаще всего начинается угадайка: №12, №11 и №14.</p>
                    <p>В конце — короткая добивка №23–25 без новой теории и без раздувания урока.</p>
                  </div>
                </div>

                <Separator />

                {/* Main phrase */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-amber-900 font-medium italic">
                    &ldquo;{LESSON_30_META.mainPhrase}&rdquo;
                  </p>
                </div>

                {/* Block list preview */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 text-sm">
                    Блоки урока
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BLOCKS.map((block) => {
                      const c = colorClasses[block.color]
                      return (
                        <div
                          key={block.id}
                          className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                        >
                          <div className={`w-7 h-7 rounded-md ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
                            {block.icon}
                          </div>
                          <div className="min-w-0">
                            <span className="block truncate text-xs font-medium">{block.shortLabel}</span>
                            <span className="block text-[11px] text-muted-foreground">{BLOCK_TIMES[block.id]} мин</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Start button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={startLesson}
                    size="lg"
                    className="w-full text-lg h-14 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Начать с №12
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <footer className="py-4 text-center text-xs text-muted-foreground border-t bg-white">
          ЕГЭ Русский: Алгоритмы и практика · {LESSON_30_META.date}
        </footer>
      </div>
    )
  }

  // ─── Main lesson view — one block at a time ──────────────────────────────
  const c = colorClasses[currentBlock.color]
  const isCompleted = currentBlock.id !== 'completion' && completedBlocks.includes(currentBlock.id)
  const hasErrors = currentBlock.id !== 'completion' && blockProgress[currentBlock.id]?.incorrectCount > 0

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
                <div className="min-w-0">
                  <span className="block truncate text-xs text-muted-foreground">
                    ЕГЭ русский — урок 30.05.2026
                  </span>
                  <span className="block truncate text-sm font-semibold">Орфография без угадайки</span>
                </div>
                {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                {hasErrors && <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
              </div>
            </div>

            {/* Right: step counter */}
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-xs text-muted-foreground">
                Пройдено: {completedMainBlocks}/{totalBlocks}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Текущий блок: {Math.min(activeStep + 1, totalBlocks)}/{totalBlocks}
              </span>
            </div>
          </div>

          {/* Progress bar — shows overall completion, not position */}
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
                  <span>Общий прогресс</span>
                  <span>{completedMainBlocks}/{totalBlocks} блоков</span>
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBlock.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {isCompletionStep ? (
              /* ─── Lesson Completion Screen ────────────────────────────── */
              <Card className="border-0 shadow-lg">
                <CardContent className="py-10 px-6 text-center space-y-6">
                  {/* Celebration icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                    className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"
                  >
                    <Trophy className="h-10 w-10 text-emerald-600" />
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Урок завершён!
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Все 5 блоков пройдены
                    </p>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="flex justify-center gap-6"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{completedMainBlocks}</div>
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
                  </motion.div>

                  <Separator />

                  {/* Error Review */}
                  {totalIncorrect > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <ErrorReviewSection
                        practiceAnswers={practiceAnswers}
                        errorNotes={errorNotes}
                        blocks={BLOCKS}
                      />
                    </motion.div>
                  )}

                  <Separator />

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3 max-w-xs mx-auto"
                  >
                    <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <Link href="/">
                        <HomeIcon className="h-4 w-4 mr-2" />
                        На главную
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/lessons">
                        <BookOpen className="h-4 w-4 mr-2" />
                        К урокам
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                      onClick={handleResetProgress}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Сбросить прогресс
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            ) : (
              /* ─── Block component ── */
              currentBlock.component
            )}
          </motion.div>
        </AnimatePresence>
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
              className="shrink-0"
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
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700"
            >
              <span>Далее</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Next block hint */}
          {activeStep < totalSteps - 1 && (
            <p className="text-center text-xs text-muted-foreground mt-1.5">
              Далее: {effectiveBlocks[activeStep + 1].shortLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
