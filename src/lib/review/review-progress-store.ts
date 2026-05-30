'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ReviewStatus = 'new' | 'known' | 'repeat' | 'error'

export interface QuestionProgress {
  deckSlug: string
  questionId: string
  status: ReviewStatus
  seenCount: number
  errorCount: number
  lastReviewedAt: number | null
}

export interface ReviewProgressState {
  // Question progress (persisted)
  questionProgress: Record<string, QuestionProgress>

  // Actions
  setQuestionStatus: (
    deckSlug: string,
    questionId: string,
    status: ReviewStatus
  ) => void
  getQuestionProgress: (questionId: string) => QuestionProgress | undefined
  getDeckProgress: (deckSlug: string) => QuestionProgress[]
  resetAllProgress: () => void
}

const makeKey = (deckSlug: string, questionId: string) =>
  `${deckSlug}::${questionId}`

const defaultProgress = (
  deckSlug: string,
  questionId: string
): QuestionProgress => ({
  deckSlug,
  questionId,
  status: 'new',
  seenCount: 0,
  errorCount: 0,
  lastReviewedAt: null,
})

export const useReviewProgressStore = create<ReviewProgressState>()(
  persist(
    (set, get) => ({
      questionProgress: {},

      setQuestionStatus: (deckSlug, questionId, status) =>
        set((state) => {
          const key = makeKey(deckSlug, questionId)
          const existing = state.questionProgress[key]
          const prev: QuestionProgress = existing || defaultProgress(deckSlug, questionId)

          const updated: QuestionProgress = {
            ...prev,
            deckSlug,
            questionId,
            status,
            seenCount: prev.seenCount + 1,
            errorCount: status === 'error' ? prev.errorCount + 1 : prev.errorCount,
            lastReviewedAt: Date.now(),
          }

          return {
            questionProgress: {
              ...state.questionProgress,
              [key]: updated,
            },
          }
        }),

      getQuestionProgress: (questionId) => {
        const state = get()
        // Find by questionId across all decks
        const entry = Object.values(state.questionProgress).find(
          (p) => p.questionId === questionId
        )
        return entry
      },

      getDeckProgress: (deckSlug) => {
        const state = get()
        return Object.values(state.questionProgress).filter(
          (p) => p.deckSlug === deckSlug
        )
      },

      resetAllProgress: () =>
        set({
          questionProgress: {},
        }),
    }),
    {
      name: 'ege-review-progress-storage',
      partialize: (state) => ({
        questionProgress: state.questionProgress,
      }),
    }
  )
)
