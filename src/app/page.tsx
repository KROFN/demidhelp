'use client'

import { FadeUp } from '@/lib/motion'
import {
  ChevronRight,
  BookOpen,
  Target,
  Calendar,
  Layers,
  Lock,
  Circle,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getUpcomingLessons } from '@/lib/lessons'
import { useLessonStore } from '@/lib/store'

export default function DashboardPage() {
  const { completedBlocks, blockProgress } =
    useLessonStore()
  const upcomingLessons = getUpcomingLessons()

  // Lesson stats
  const totalCorrect = Object.values(blockProgress).reduce(
    (s, b) => s + b.correctCount,
    0
  )
  const totalIncorrect = Object.values(blockProgress).reduce(
    (s, b) => s + b.incorrectCount,
    0
  )
  const completedCount = completedBlocks.length
  const hasProgress = totalCorrect > 0 || totalIncorrect > 0

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* ─── Welcome banner ──────────────────────────────────────────── */}
        <FadeUp duration={0.5} className="mb-8">
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    Привет, Демид 👋
                  </h1>
                  <p className="text-emerald-100 mt-1 text-sm sm:text-base">
                    Алгоритмы и практика для подготовки к ЕГЭ по русскому языку
                  </p>
                </div>
              </div>
              {hasProgress && (
                <div className="mt-5 flex gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-emerald-100">
                    <TrendingUp className="h-4 w-4" />
                    <span>{totalCorrect} верно</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-emerald-100">
                    <Sparkles className="h-4 w-4" />
                    <span>{completedCount} блоков</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>

        {/* ─── Upcoming lessons ────────────────────────────────────────── */}
        {upcomingLessons.length > 0 && (
          <FadeUp delay={0.1} duration={0.4} className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Предстоящие уроки
            </h2>
            <div className="space-y-3">
              {upcomingLessons.map((lesson, i) => (
                <FadeUp key={lesson.slug} delay={0.15 + i * 0.07} duration={0.35}>
                  <a href={`/lessons/${lesson.slug}`}>
                    <Card className="transition-all hover:shadow-md hover:border-emerald-300 cursor-pointer group">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              lesson.status === 'active'
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {lesson.status === 'active' ? (
                              <Circle className="h-5 w-5 fill-emerald-500 text-emerald-500" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                              {lesson.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {lesson.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="size-3" />
                                {lesson.coverTopics.length} тем
                              </span>
                              {lesson.status === 'active' && (
                                <span className="text-emerald-600 font-medium">
                                  активный
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-emerald-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </FadeUp>
              ))}
            </div>
          </FadeUp>
        )}

        {/* ─── Quick actions: Повторение + Тест ────────────────────────── */}
        <FadeUp delay={0.25} duration={0.4} className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Навигация
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Повторение */}
            <a href="/review">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group h-full">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">Повторение</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Открыть конспекты
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-emerald-600 transition-colors" />
                </CardContent>
              </Card>
            </a>

            {/* Тест по заданиям — скоро */}
            <div className="relative">
              <Card className="border-0 shadow-sm h-full opacity-60 cursor-not-allowed">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Тест по заданиям
                    </h3>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      В следующих обновлениях
                    </p>
                  </div>
                </CardContent>
              </Card>
              <span className="absolute top-3 right-3 text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full leading-none">
                скоро
              </span>
            </div>
          </div>
        </FadeUp>

        {/* ─── Stats ───────────────────────────────────────────────────── */}
        {hasProgress && (
          <FadeUp delay={0.35} duration={0.4} className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Твоя статистика
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-5 pb-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalCorrect}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Правильных
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-4 text-center">
                  <p className="text-2xl font-bold text-rose-600">
                    {totalIncorrect}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Ошибок</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {completedCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Блоков пройдено
                  </p>
                </CardContent>
              </Card>
            </div>
          </FadeUp>
        )}

        {/* ─── Motivation tip ──────────────────────────────────────────── */}
        <FadeUp delay={0.45} duration={0.4}>
          <Card className="border-0 shadow-sm bg-amber-50 border border-amber-200">
            <CardContent className="p-4 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Ответ без доказательства — это не ответ, а ставка в казино.
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Каждый алгоритм на этом сайте помогает именно доказывать ответ, а не угадывать.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-muted-foreground border-t bg-white">
        ЕГЭ Русский: Алгоритмы и практика
      </footer>
    </div>
  )
}
