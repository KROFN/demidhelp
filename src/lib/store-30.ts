'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types for Lesson 30
export type BlockId30 = 'block12' | 'block11' | 'block14' | 'block2325' | 'homework'

export type AnswerStatus30 = 'unanswered' | 'correct' | 'incorrect'

export interface PracticeAnswer30 {
  questionId: string
  blockId: BlockId30
  answer: string
  mechanism: string
  status: AnswerStatus30
  errorNote: string
  timestamp: number
}

export interface BlockProgress30 {
  blockId: BlockId30
  started: boolean
  completed: boolean
  correctCount: number
  incorrectCount: number
  totalQuestions: number
}

export interface Lesson30State {
  lessonStarted: boolean
  currentBlock: BlockId30 | null
  completedBlocks: BlockId30[]
  practiceAnswers: Record<string, PracticeAnswer30>
  blockProgress: Record<BlockId30, BlockProgress30>
  errorNotes: Record<string, string>
  homeworkChecks: Record<string, boolean[]>
  visitedSections: Record<string, string[]>
  homeworkMode: 'main' | 'light'

  // Actions
  startLesson: () => void
  setCurrentBlock: (block: BlockId30 | null) => void
  markBlockCompleted: (block: BlockId30) => void
  setPracticeAnswer: (answer: PracticeAnswer30) => void
  updateBlockProgress: (blockId: BlockId30, progress: Partial<BlockProgress30>) => void
  setErrorNote: (questionId: string, note: string) => void
  getBlockProgress: (blockId: BlockId30) => BlockProgress30
  setHomeworkChecks: (checks: Record<string, boolean[]>) => void
  markSectionVisited: (blockId: string, sectionKey: string) => void
  setHomeworkMode: (mode: 'main' | 'light') => void
  resetLesson: () => void
}

const defaultBlockProgress30: Record<BlockId30, BlockProgress30> = {
  block12: { blockId: 'block12', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 8 },
  block11: { blockId: 'block11', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 8 },
  block14: { blockId: 'block14', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 8 },
  block2325: { blockId: 'block2325', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 3 },
  homework: { blockId: 'homework', started: false, completed: false, correctCount: 0, incorrectCount: 0, totalQuestions: 0 },
}

export const useLesson30Store = create<Lesson30State>()(
  persist(
    (set, get) => ({
      lessonStarted: false,
      currentBlock: null,
      completedBlocks: [],
      practiceAnswers: {},
      blockProgress: { ...defaultBlockProgress30 },
      errorNotes: {},
      homeworkChecks: {},
      visitedSections: {},
      homeworkMode: 'main',

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

      setHomeworkMode: (mode) => set({ homeworkMode: mode }),

      resetLesson: () => set({
        lessonStarted: false,
        currentBlock: null,
        completedBlocks: [],
        practiceAnswers: {},
        blockProgress: { ...defaultBlockProgress30 },
        errorNotes: {},
        homeworkChecks: {},
        visitedSections: {},
        homeworkMode: 'main',
      }),
    }),
    {
      name: 'ege-lesson-30-storage',
    }
  )
)
