'use client'

import { useEffect, useState } from 'react'
import { getLesson } from '@/lib/lessons'
import type { ComponentType } from 'react'

interface LessonRouteClientProps {
  slug: string
}

export default function LessonRouteClient({ slug }: LessonRouteClientProps) {
  const entry = getLesson(slug)

  const [LessonComponent, setLessonComponent] = useState<ComponentType | null>(
    null
  )
  const [loadError, setLoadError] = useState(false)

  // Derive error state without setState in effect
  const notFound = !entry

  useEffect(() => {
    if (!entry) return
    let cancelled = false
    entry
      .component()
      .then((mod) => {
        if (!cancelled) setLessonComponent(() => mod.default)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
    return () => {
      cancelled = true
    }
  }, [entry])

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8">
        <h1 className="text-2xl font-bold text-rose-600 mb-2">
          Урок не найден
        </h1>
        <p className="text-muted-foreground mb-6">
          Урок «{slug}» не найден.
        </p>
        <a
          href="/lessons"
          className="text-emerald-600 hover:text-emerald-700 underline"
        >
          ← Вернуться к списку уроков
        </a>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8">
        <h1 className="text-2xl font-bold text-rose-600 mb-2">Ошибка</h1>
        <p className="text-muted-foreground mb-6">
          Не удалось загрузить урок.
        </p>
        <a
          href="/lessons"
          className="text-emerald-600 hover:text-emerald-700 underline"
        >
          ← Вернуться к списку уроков
        </a>
      </div>
    )
  }

  if (!LessonComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Загрузка урока…</p>
        </div>
      </div>
    )
  }

  return <LessonComponent />
}
