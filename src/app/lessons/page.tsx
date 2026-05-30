'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap,
  ChevronRight,
  Calendar,
  Target,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getAllLessons } from '@/lib/lessons'

export default function LessonsListPage() {
  const lessons = getAllLessons()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <GraduationCap className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Уроки</h1>
          <p className="text-muted-foreground mt-2">
            Выберите урок для начала занятий
          </p>
        </motion.div>

        {/* Lessons list */}
        <div className="space-y-4">
          {lessons.map((lesson, i) => {
            const statusIcon =
              lesson.status === 'completed' ? (
                <CheckCircle2 className="size-5 text-emerald-500" />
              ) : lesson.status === 'active' ? (
                <Circle className="size-5 text-emerald-500 fill-emerald-500" />
              ) : (
                <Circle className="size-5 text-slate-300" />
              )

            const statusLabel =
              lesson.status === 'completed'
                ? 'Пройден'
                : lesson.status === 'active'
                  ? 'Активный'
                  : 'Запланирован'

            const statusBadge =
              lesson.status === 'completed'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-300'
                : lesson.status === 'active'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-amber-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-300'

            return (
              <motion.div
                key={lesson.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <a href={`/lessons/${lesson.slug}`}>
                  <Card className="transition-all hover:shadow-md hover:border-emerald-300 cursor-pointer group">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 mt-1">{statusIcon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-lg group-hover:text-emerald-700 transition-colors">
                              {lesson.title}
                            </CardTitle>
                            <Badge className={statusBadge}>{statusLabel}</Badge>
                          </div>
                          <CardDescription className="mt-1">
                            {lesson.description}
                          </CardDescription>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground shrink-0 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="size-3" />
                          <span>{lesson.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Target className="size-3" />
                          <span>{lesson.coverTopics.length} тем</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            )
          })}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Пока нет доступных уроков. Загляните позже!
            </p>
          </div>
        )}
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-muted-foreground border-t bg-white">
        <a href="/" className="hover:text-emerald-600 transition-colors">
          ← На главную
        </a>
        <Separator orientation="vertical" className="inline-block mx-2 h-3" />
        ЕГЭ Русский: Алгоритмы и практика
      </footer>
    </div>
  )
}
