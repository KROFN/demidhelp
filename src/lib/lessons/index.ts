import type { ComponentType } from 'react'

// ─── Lesson Registry Types ───────────────────────────────────────────────────

export interface LessonMeta {
  slug: string
  title: string
  date: string
  description: string
  goal: string
  coverTopics: string[]
  skipTopics: string[]
  blockIds: string[]
  /** Which block to prioritize (e.g. 'block26') */
  priorityBlock?: string
  /** Which blocks should be brief / control-only */
  briefBlocks?: string[]
  status: 'active' | 'completed' | 'planned'
}

export interface LessonEntry {
  meta: LessonMeta
  /** Lazy-loaded component reference — use dynamic import in the page */
  component: () => Promise<{ default: ComponentType }>
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const lessonRegistry: Record<string, LessonEntry> = {
  '2026-05-29': {
    meta: {
      slug: '2026-05-29',
      title: 'ЕГЭ по русскому языку: алгоритмы и практика',
      date: '29.05.2026',
      description:
        'Урок-практика по заданиям 4–6, 1–3, 22, 26. Алгоритмы вместо угадывания.',
      goal: 'Научиться решать задания 4–6, 1–3, 22, 26 через алгоритмы, а не угадывание',
      coverTopics: [
        '№4 — Ударения: ориентиры + личный словарь',
        '№5 — Паронимы: смысловые пары',
        '№6 — Лексическая правка: плеоназм / сочетаемость',
        '№1–3 — Микротекст: стиль, тип речи, доказательства',
        '№22 — ИВС: распознавание по признакам',
        '№26 — Средства связи: местоимения, части речи',
      ],
      skipTopics: [
        '№23–25 — только пробежка в ДЗ, не основной урок',
        'Орфография и пунктуация',
        'Сочинение',
      ],
      blockIds: [
        'block4',
        'block5',
        'block6',
        'block123',
        'block22',
        'block26',
        'homework',
      ],
      priorityBlock: 'block26',
      briefBlocks: ['block123'],
      status: 'active',
    },
    component: () =>
      import('@/components/lesson/Lesson29View').then((m) => ({
        default: m.default,
      })),
  },
  '2026-05-30': {
    meta: {
      slug: '2026-05-30',
      title: 'Орфография без угадайки: №11, №12, №14',
      date: '30.05.2026',
      description:
        'Глаголы и причастия, суффиксы, слитно-раздельно-дефис. В конце — короткая добивка 23–25.',
      goal: 'Перестать угадывать букву и начать решать через механизм: форма слова → часть речи → правило → ответ',
      coverTopics: [
        '№12 — Глаголы и причастия: буква зависит от формы',
        '№11 — Суффиксы: сначала часть речи',
        '№14 — Слитно, раздельно, дефис: сначала часть речи',
        '№23–25 — Дополнительный блок (напоминания)',
      ],
      skipTopics: [
        'Входной срез / диагностика',
        'Сочинение / задание 27',
        'Пунктуация',
      ],
      blockIds: [
        'block12',
        'block11',
        'block14',
        'block2325',
        'homework',
      ],
      priorityBlock: 'block12',
      briefBlocks: ['block2325'],
      status: 'active',
    },
    component: () =>
      import('@/components/lesson-3005/Lesson30View').then((m) => ({
        default: m.default,
      })),
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLesson(slug: string): LessonEntry | undefined {
  return lessonRegistry[slug]
}

export function getAllLessons(): LessonMeta[] {
  return Object.values(lessonRegistry).map((e) => e.meta)
}

/** Returns the first lesson with status 'active' (legacy helper) */
export function getActiveLesson(): LessonEntry | undefined {
  const active = Object.values(lessonRegistry).find(
    (e) => e.meta.status === 'active'
  )
  return active
}

/** Returns all non-completed lessons (active + planned), sorted: active first, then by date */
export function getUpcomingLessons(): LessonMeta[] {
  return Object.values(lessonRegistry)
    .map((e) => e.meta)
    .filter((m) => m.status !== 'completed')
    .sort((a, b) => {
      // active lessons first
      if (a.status === 'active' && b.status !== 'active') return -1
      if (a.status !== 'active' && b.status === 'active') return 1
      // then by date
      return a.date.localeCompare(b.date)
    })
}

export function lessonSlugs(): string[] {
  return Object.keys(lessonRegistry)
}
