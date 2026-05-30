'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  DrillItemProgress,
  DrillResultStatus,
  DrillSessionSummary,
  SessionItemResult,
} from './drill-types'
import type { DrillChoice } from './drill-types'
import { computeResultStatus } from './drill-types'

// ─── Issue report types ────────────────────────────────────────────────────

export type DrillIssueReason =
  | 'wrong-answer'
  | 'wrong-mechanism'
  | 'bad-explanation'
  | 'bad-context'
  | 'duplicate'
  | 'other'

export type DrillIssueReport = {
  id: string
  itemId: string
  taskNumber: number
  target: string
  context: string
  reason: DrillIssueReason
  comment?: string
  createdAt: string
  itemSnapshot: {
    answerChoices: DrillChoice[]
    mechanismChoices: DrillChoice[]
    correctAnswerId: string
    correctMechanismId: string
    correctAnswerText: string
    correctMechanismText: string
    explanation: string
    wrongPathHint: string
    source?: { type: string; rawId: string; sourceDocument: string; sourceTaskNumber: number }
  }
}

// ─── State shape ───────────────────────────────────────────────────────────

export type DrillProgressState = {
  byItemId: Record<string, DrillItemProgress>
  sessions: DrillSessionSummary[]
  disabledItemIds: Record<string, true>
  issueReports: DrillIssueReport[]

  // Actions
  recordResult: (result: SessionItemResult) => void
  addSession: (session: DrillSessionSummary) => void
  getErrorsForTask: (taskNumber: number) => DrillItemProgress[]
  getProgressForTask: (taskNumber: number) => DrillItemProgress[]
  disableItem: (
    itemId: string,
    taskNumber: number,
    target: string,
    context: string,
    reason: DrillIssueReason,
    comment: string | undefined,
    itemSnapshot: DrillIssueReport['itemSnapshot']
  ) => void
  enableItem: (itemId: string) => void
  clearIssueReports: () => void
  exportIssueReports: () => string
  resetAll: () => void
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useDrillProgressStore = create<DrillProgressState>()(
  persist(
    (set, get) => ({
      byItemId: {},
      sessions: [],
      disabledItemIds: {},
      issueReports: [],

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

      disableItem: (
        itemId: string,
        taskNumber: number,
        target: string,
        context: string,
        reason: DrillIssueReason,
        comment: string | undefined,
        itemSnapshot: DrillIssueReport['itemSnapshot']
      ) => {
        const report: DrillIssueReport = {
          id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          itemId,
          taskNumber,
          target,
          context,
          reason,
          comment,
          createdAt: new Date().toISOString(),
          itemSnapshot,
        }

        set((state) => ({
          disabledItemIds: { ...state.disabledItemIds, [itemId]: true },
          issueReports: [...state.issueReports, report],
        }))
      },

      enableItem: (itemId: string) => {
        set((state) => {
          const { [itemId]: _, ...rest } = state.disabledItemIds
          return { disabledItemIds: rest }
        })
      },

      clearIssueReports: () => {
        set({ issueReports: [] })
      },

      exportIssueReports: () => {
        const { issueReports } = get()
        return JSON.stringify(issueReports, null, 2)
      },

      resetAll: () => {
        set({ byItemId: {}, sessions: [], disabledItemIds: {}, issueReports: [] })
      },
    }),
    {
      name: 'ege-drill-progress',
      partialize: (state) => ({
        byItemId: state.byItemId,
        sessions: state.sessions,
        disabledItemIds: state.disabledItemIds,
        issueReports: state.issueReports,
      }),
    }
  )
)

// ─── Helper: compute status and record ─────────────────────────────────────
// NOTE: DrillCard now computes status inline using isMechanismCorrect from
// drill-mechanism-normalizer. This helper remains for any external callers.

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
