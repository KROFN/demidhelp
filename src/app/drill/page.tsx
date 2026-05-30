'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { FadeUp } from '@/lib/motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type {
  DrillItem,
  DrillMode,
  DrillImportFile,
  SessionItemResult,
} from '@/lib/drill/drill-types'
import { TASK_META, DRILL_MODE_CONFIG } from '@/lib/drill/drill-types'
import { loadDrillImport } from '@/lib/drill/drill-loader'
import {
  getTaskCounts,
  getMechanismStats,
  createSession,
} from '@/lib/drill/drill-selectors'
import { useDrillProgressStore } from '@/lib/drill/drill-store'
import DrillDashboard from '@/components/drill/DrillDashboard'
import DrillSession from '@/components/drill/DrillSession'
import DrillResults from '@/components/drill/DrillResults'

type AppScreen = 'dashboard' | 'session' | 'results'

export default function DrillPage() {
  const [data, setData] = useState<DrillImportFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Session state
  const [screen, setScreen] = useState<AppScreen>('dashboard')
  const [sessionTask, setSessionTask] = useState<number>(0)
  const [sessionMode, setSessionMode] = useState<DrillMode>('quick')
  const [sessionItems, setSessionItems] = useState<DrillItem[]>([])
  const [sessionResults, setSessionResults] = useState<SessionItemResult[]>([])

  const { byItemId } = useDrillProgressStore()

  // Load data
  useEffect(() => {
    let cancelled = false
    loadDrillImport()
      .then((d) => {
        if (!cancelled) {
          setData(d)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Ошибка загрузки')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Computed
  const taskCounts = useMemo(() => (data ? getTaskCounts(data.drillItems) : {}), [data])
  const mechanismStats = useMemo(
    () =>
      data
        ? Object.fromEntries(
            Object.keys(TASK_META).map((t) => [
              Number(t),
              getMechanismStats(data.drillItems, Number(t)),
            ])
          )
        : {},
    [data]
  )

  // Handlers
  const handleStartSession = useCallback(
    (taskNumber: number, mode: DrillMode) => {
      if (!data) return
      const items = createSession(data.drillItems, taskNumber, mode, byItemId)
      if (items.length === 0) {
        // No items available (e.g., no errors)
        return
      }
      setSessionTask(taskNumber)
      setSessionMode(mode)
      setSessionItems(items)
      setSessionResults([])
      setScreen('session')
    },
    [data, byItemId]
  )

  const handleSessionFinish = useCallback((results: SessionItemResult[]) => {
    setSessionResults(results)
    setScreen('results')
  }, [])

  const handleRetryErrors = useCallback(() => {
    if (!data) return
    const items = createSession(data.drillItems, sessionTask, 'errors', byItemId)
    if (items.length === 0) return
    setSessionItems(items)
    setSessionResults([])
    setSessionMode('errors')
    setScreen('session')
  }, [data, sessionTask, byItemId])

  const handleRetrySame = useCallback(() => {
    if (!data) return
    const items = createSession(data.drillItems, sessionTask, sessionMode, byItemId)
    setSessionItems(items)
    setSessionResults([])
    setScreen('session')
  }, [data, sessionTask, sessionMode, byItemId])

  const handleBackToDashboard = useCallback(() => {
    setScreen('dashboard')
    setSessionItems([])
    setSessionResults([])
  }, [])

  // ─── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm text-muted-foreground">Загружаем базу заданий...</p>
          </div>
        </main>
        <footer className="mt-auto py-4 text-center text-xs text-muted-foreground border-t bg-white">
          ЕГЭ Русский: Алгоритмы и практика
        </footer>
      </div>
    )
  }

  // ─── Error state ────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="p-6 text-center">
              <p className="text-rose-700 font-medium">Не удалось загрузить базу заданий</p>
              <p className="text-sm text-rose-600 mt-1">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Попробовать снова
              </Button>
            </CardContent>
          </Card>
        </main>
        <footer className="mt-auto py-4 text-center text-xs text-muted-foreground border-t bg-white">
          ЕГЭ Русский: Алгоритмы и практика
        </footer>
      </div>
    )
  }

  // ─── Main render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {/* Back button (not on dashboard) */}
        {screen !== 'dashboard' && (
          <FadeUp duration={0.2} className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              К выбору заданий
            </Button>
          </FadeUp>
        )}

        {screen === 'dashboard' && (
          <DrillDashboard
            taskCounts={taskCounts}
            mechanismStats={mechanismStats}
            onStartSession={handleStartSession}
          />
        )}

        {screen === 'session' && (
          <DrillSession
            items={sessionItems}
            taskNumber={sessionTask}
            mode={sessionMode}
            onFinish={handleSessionFinish}
            onExit={handleBackToDashboard}
          />
        )}

        {screen === 'results' && (
          <DrillResults
            items={sessionItems}
            results={sessionResults}
            taskNumber={sessionTask}
            mode={sessionMode}
            onRetryErrors={handleRetryErrors}
            onRetrySame={handleRetrySame}
            onBackToDashboard={handleBackToDashboard}
            onHome={() => (window.location.href = '/')}
          />
        )}
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-muted-foreground border-t bg-white">
        ЕГЭ Русский: Алгоритмы и практика
      </footer>
    </div>
  )
}
