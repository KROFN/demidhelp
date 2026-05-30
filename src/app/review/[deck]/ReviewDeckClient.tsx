'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getDeckBySlug } from '@/lib/review/review-sources'
import ReviewDeckOverview from '@/components/review/ReviewDeckOverview'
import ReviewFastTest from '@/components/review/ReviewFastTest'

interface ReviewDeckClientProps {
  deckSlug: string
}

export default function ReviewDeckClient({ deckSlug }: ReviewDeckClientProps) {
  const deck = getDeckBySlug(deckSlug)

  if (!deck) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8">
        <h1 className="text-2xl font-bold text-rose-600 mb-2">
          Раздел не найден
        </h1>
        <p className="text-muted-foreground mb-6">
          Раздел «{deckSlug}» не найден.
        </p>
        <a
          href="/review"
          className="text-emerald-600 hover:text-emerald-700 underline"
        >
          ← Вернуться к повторению
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-3xl mx-auto px-4 flex items-center h-12">
          <Button variant="ghost" size="sm" asChild className="gap-1.5">
            <a href="/review">
              <ArrowLeft className="h-4 w-4" />
              Повторение
            </a>
          </Button>
          <Separator orientation="vertical" className="mx-3 h-5" />
          <span className="font-semibold text-sm">{deck.title}</span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Deck header */}
        <div>
          <h1 className="text-2xl font-bold">{deck.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{deck.subtitle}</p>
        </div>

        {/* Tabs: Обзор / Быстрый тест */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="fast-test">Быстрый тест</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <ReviewDeckOverview sections={deck.sections} />
          </TabsContent>

          <TabsContent value="fast-test" className="mt-6">
            <ReviewFastTest
              deckSlug={deck.slug}
              questions={deck.fastTest}
              title={deck.title}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-muted-foreground border-t bg-white">
        <a href="/" className="hover:text-emerald-600 transition-colors">
          ← На главную
        </a>
        <span className="mx-2">•</span>
        {deck.title}
      </footer>
    </div>
  )
}
