'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export type BlockId = 'block4' | 'block5' | 'block6' | 'block123' | 'block22' | 'block26' | 'homework'

export type AnswerStatus = 'unanswered' | 'correct' | 'incorrect'

export interface PracticeAnswer {
  questionId: string
  blockId: BlockId
  answer: string
  status: AnswerStatus
  errorNote: string
  timestamp: number
}

export interface BlockProgress {
  blockId: BlockId
  started: boolean
  completed: boolean
  correctCount: number
  incorrectCount: number
  totalQuestions: number
}

export interface LessonState {
  lessonStarted: boolean
  currentBlock: BlockId | null
  completedBlocks: BlockId[]
  practiceAnswers: Record<string, PracticeAnswer>
  blockProgress: Record<BlockId, BlockProgress>
  errorNotes: Record<string, string>
  homeworkChecks: Record<string, boolean[]>
  visitedSections: Record<string, string[]>

  // Actions
  startLesson: () => void
  setCurrentBlock: (block: BlockId | null) => void
  markBlockCompleted: (block: BlockId) => void
  setPracticeAnswer: (answer: PracticeAnswer) => void
  updateBlockProgress: (blockId: BlockId, progress: Partial<BlockProgress>) => void
  setErrorNote: (questionId: string, note: string) => void
  getBlockProgress: (blockId: BlockId) => BlockProgress
  setHomeworkChecks: (checks: Record<string, boolean[]>) => void
  markSectionVisited: (blockId: string, sectionKey: string) => void
  resetLesson: () => void
}

const defaultBlockProgress: Record<BlockId, BlockProgress> = {
  block4: { blockId: 'block4', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 5 },
  block5: { blockId: 'block5', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 8 },
  block6: { blockId: 'block6', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 6 },
  block123: { blockId: 'block123', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 3 },
  block22: { blockId: 'block22', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 0 },
  block26: { blockId: 'block26', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 0 },
  homework: { blockId: 'homework', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 0 },
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set, get) => ({
      lessonStarted: false,
      currentBlock: null,
      completedBlocks: [],
      practiceAnswers: {},
      blockProgress: { ...defaultBlockProgress },
      errorNotes: {},
      homeworkChecks: {},
      visitedSections: {},

      startLesson: () => set({ lessonStarted: true }),

      setCurrentBlock: (block) => {
        if (!block) {
          set({ currentBlock: null })
          return
        }
        set((state) => {
          const progress = { ...state.blockProgress[block] }
          if (!progress.started) {
            progress.started = true
          }
          return {
            currentBlock: block,
            blockProgress: { ...state.blockProgress, [block]: progress }
          }
        })
      },

      markBlockCompleted: (block) => set((state) => ({
        completedBlocks: state.completedBlocks.includes(block)
          ? state.completedBlocks
          : [...state.completedBlocks, block],
        blockProgress: {
          ...state.blockProgress,
          [block]: { ...state.blockProgress[block], completed: true }
        }
      })),

      setPracticeAnswer: (answer) => set((state) => {
        const blockProgress = { ...state.blockProgress[answer.blockId] }
        const existing = state.practiceAnswers[answer.questionId]

        // Remove previous counts if updating
        if (existing) {
          if (existing.status === 'correct') blockProgress.correctCount--
          if (existing.status === 'incorrect') blockProgress.incorrectCount--
        }

        if (answer.status === 'correct') blockProgress.correctCount++
        if (answer.status === 'incorrect') blockProgress.incorrectCount++

        return {
          practiceAnswers: { ...state.practiceAnswers, [answer.questionId]: answer },
          blockProgress: { ...state.blockProgress, [answer.blockId]: blockProgress }
        }
      }),

      updateBlockProgress: (blockId, progress) => set((state) => ({
        blockProgress: {
          ...state.blockProgress,
          [blockId]: { ...state.blockProgress[blockId], ...progress }
        }
      })),

      setErrorNote: (questionId, note) => set((state) => ({
        errorNotes: { ...state.errorNotes, [questionId]: note }
      })),

      getBlockProgress: (blockId) => get().blockProgress[blockId],

      setHomeworkChecks: (checks) => set({ homeworkChecks: checks }),

      markSectionVisited: (blockId, sectionKey) => set((state) => {
        const current = state.visitedSections[blockId] ?? []
        if (current.includes(sectionKey)) return state
        return {
          visitedSections: {
            ...state.visitedSections,
            [blockId]: [...current, sectionKey],
          },
        }
      }),

      resetLesson: () => set({
        lessonStarted: false,
        currentBlock: null,
        completedBlocks: [],
        practiceAnswers: {},
        blockProgress: { ...defaultBlockProgress },
        errorNotes: {},
        homeworkChecks: {},
        visitedSections: {},
      }),
    }),
    {
      name: 'ege-lesson-storage',
      // Exclude volatile navigation state from persistence
      partialize: (state) => ({
        lessonStarted: state.lessonStarted,
        completedBlocks: state.completedBlocks,
        practiceAnswers: state.practiceAnswers,
        blockProgress: state.blockProgress,
        errorNotes: state.errorNotes,
        homeworkChecks: state.homeworkChecks,
        visitedSections: state.visitedSections,
      }),
      merge: (persisted, current) => {
        if (!persisted || typeof persisted !== 'object') return current
        const p = persisted as Partial<LessonState>
        return {
          ...current,
          ...p,
          // Don't persist currentBlock (volatile navigation state)
          currentBlock: null,
        }
      },
    }
  )
)
