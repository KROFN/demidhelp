'use client'

import { motion } from 'framer-motion'
import { BookOpen, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { reviewDecks } from '@/lib/review/review-sources'

const deckColors: Record<string, { bg: string; text: string; border: string }> = {
  '7': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    border: 'hover:border-emerald-300',
  },
  '8': {
    bg: 'bg-teal-100',
    text: 'text-teal-600',
    border: 'hover:border-teal-300',
  },
  '9-15': {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    border: 'hover:border-orange-300',
  },
  '16-18': {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    border: 'hover:border-violet-300',
  },
  '19-21': {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    border: 'hover:border-amber-300',
  },
}

export default function ReviewDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <BookOpen className="h-7 w-7 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Повторение прошлых тем
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Это не полные уроки, а сжатые конспекты и быстрые тесты по уже пройденному
          материалу.
        </p>
      </motion.div>

      {/* Deck cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-lg font-semibold mb-3">Разделы</h2>
        <div className="space-y-3">
          {reviewDecks.map((deck, i) => {
            const colors = deckColors[deck.slug] || deckColors['7']
            return (
              <motion.div
                key={deck.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
              >
                <a href={`/review/${deck.slug}`}>
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${colors.border}`}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}
                        >
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base">
                            {deck.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {deck.subtitle}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{deck.sections.length} разделов</span>
                        <span>{deck.fastTest.length} вопросов</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
