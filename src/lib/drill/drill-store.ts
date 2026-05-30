'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  DrillItemProgress,
  DrillResultStatus,
  DrillSessionSummary,
  SessionItemResult,
} from './drill-types'
import { computeResultStatus } from './drill-types'

// ─── State shape ───────────────────────────────────────────────────────────

export type DrillProgressState = {
  byItemId: Record<string, DrillItemProgress>
  sessions: DrillSessionSummary[]

  // Actions
  recordResult: (result: SessionItemResult) => void
  addSession: (session: DrillSessionSummary) => void
  getErrorsForTask: (taskNumber: number) => DrillItemProgress[]
  getProgressForTask: (taskNumber: number) => DrillItemProgress[]
  resetAll: () => void
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useDrillProgressStore = create<DrillProgressState>()(
  persist(
    (set, get) => ({
      byItemId: {},
      sessions: [],

      recordResult: (result: SessionItemResult) => {
        set((state) => {
          const existing = state.byItemId[result.itemId]
          const status = result.status

          const updated: DrillItemProgress = existing
            ? {
                ...existing,
                attempts: existing.attempts + 1,
                knownCount: existing.knownCount + (status === 'known' ? 1 : 0),
                guessedCount: existing.guessedCount + (status === 'guessed' ? 1 : 0),
                wrongCount: existing.wrongCount + (status === 'wrong' ? 1 : 0),
                lastStatus: status,
                lastReviewedAt: new Date().toISOString(),
                mechanismMistakes:
                  status === 'guessed' || status === 'wrong'
                    ? {
                        ...existing.mechanismMistakes,
                        [result.selectedMechanismId]:
                          (existing.mechanismMistakes[result.selectedMechanismId] || 0) + 1,
                      }
                    : existing.mechanismMistakes,
              }
            : {
                itemId: result.itemId,
                taskNumber: result.taskNumber,
                attempts: 1,
                knownCount: status === 'known' ? 1 : 0,
                guessedCount: status === 'guessed' ? 1 : 0,
                wrongCount: status === 'wrong' ? 1 : 0,
                lastStatus: status,
                lastReviewedAt: new Date().toISOString(),
                mechanismMistakes:
                  status === 'guessed' || status === 'wrong'
                    ? { [result.selectedMechanismId]: 1 }
                    : {},
              }

          return {
            byItemId: {
              ...state.byItemId,
              [result.itemId]: updated,
            },
          }
        })
      },

      addSession: (session: DrillSessionSummary) => {
        set((state) => ({
          sessions: [...state.sessions, session],
        }))
      },

      getErrorsForTask: (taskNumber: number) => {
        const { byItemId } = get()
        return Object.values(byItemId).filter(
          (p) => p.taskNumber === taskNumber && (p.wrongCount > 0 || p.guessedCount > 0)
        )
      },

      getProgressForTask: (taskNumber: number) => {
        const { byItemId } = get()
        return Object.values(byItemId).filter((p) => p.taskNumber === taskNumber)
      },

      resetAll: () => {
        set({ byItemId: {}, sessions: [] })
      },
    }),
    {
      name: 'ege-drill-progress',
      partialize: (state) => ({
        byItemId: state.byItemId,
        sessions: state.sessions,
      }),
    }
  )
)

// ─── Helper: compute status and record ─────────────────────────────────────

export function checkAndRecord(
  itemId: string,
  taskNumber: number,
  correctAnswerId: string,
  correctMechanismId: string,
  selectedAnswerId: string,
  selectedMechanismId: string,
  recordResult: (r: SessionItemResult) => void
): DrillResultStatus {
  const answerCorrect = selectedAnswerId === correctAnswerId
  const mechanismCorrect = selectedMechanismId === correctMechanismId
  const status = computeResultStatus(answerCorrect, mechanismCorrect)

  recordResult({
    itemId,
    taskNumber,
    selectedAnswerId,
    selectedMechanismId,
    status,
    checkedAt: Date.now(),
  })

  return status
}
