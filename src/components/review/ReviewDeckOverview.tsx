'use client'

import { Badge } from '@/components/ui/badge'
import type { ReviewSection } from '@/lib/review/review-sources'
import { FadeUp } from '@/lib/motion'

interface ReviewDeckOverviewProps {
  sections: ReviewSection[]
}

// Section kind labels — UI labels only
const kindLabels: Record<ReviewSection['kind'], string> = {
  overview: 'Обзор',
  algorithm: 'Алгоритм',
  trap: 'Ловушки',
  example: 'Мини-примеры',
  'before-test': 'Перед пробником',
}

const kindColors: Record<ReviewSection['kind'], string> = {
  overview: 'bg-slate-100 text-slate-700 border-slate-300',
  algorithm: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  trap: 'bg-rose-100 text-rose-700 border-rose-300',
  example: 'bg-sky-100 text-sky-700 border-sky-300',
  'before-test': 'bg-amber-100 text-amber-700 border-amber-300',
}

const kindIcons: Record<ReviewSection['kind'], string> = {
  overview: '\uD83D\uDCD6',
  algorithm: '\u2699\uFE0F',
  trap: '\uD83D\uDCA3',
  example: '\uD83D\uDCDD',
  'before-test': '\u26A0\uFE0F',
}

// Display order for section kinds
const kindOrder: ReviewSection['kind'][] = [
  'overview',
  'algorithm',
  'trap',
  'example',
  'before-test',
]

export default function ReviewDeckOverview({ sections }: ReviewDeckOverviewProps) {
  // Group by kind
  const grouped = new Map<ReviewSection['kind'], ReviewSection[]>()
  for (const section of sections) {
    const existing = grouped.get(section.kind) || []
    existing.push(section)
    grouped.set(section.kind, existing)
  }

  return (
    <div className="space-y-8">
      {kindOrder.map((kind) => {
        const groupSections = grouped.get(kind)
        if (!groupSections || groupSections.length === 0) return null

        return (
          <FadeUp key={kind} duration={0.3}>
            {/* Group header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{kindIcons[kind]}</span>
              <h3 className="text-lg font-semibold">{kindLabels[kind]}</h3>
              <Badge variant="outline" className="text-xs">
                {groupSections.length}
              </Badge>
            </div>

            {/* Sections in this group */}
            <div className="space-y-4">
              {groupSections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-xl border bg-white p-4 sm:p-5 shadow-sm"
                >
                  {/* Section title */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge className={kindColors[section.kind]}>
                      {kindLabels[section.kind]}
                    </Badge>
                    <h4 className="font-semibold text-base">{section.title}</h4>
                  </div>

                  {/* Section content */}
                  <div className="space-y-1">
                    {section.content.map((line, i) => {
                      if (line === '') {
                        return <div key={i} className="h-2" />
                      }
                      return (
                        <p
                          key={i}
                          className="text-sm leading-relaxed whitespace-pre-line"
                        >
                          {line}
                        </p>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        )
      })}
    </div>
  )
}
