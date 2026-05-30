'use client'

import ReviewDashboard from '@/components/review/ReviewDashboard'

export default function ReviewPageClient() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <ReviewDashboard />
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-muted-foreground border-t bg-white">
        <a href="/" className="hover:text-emerald-600 transition-colors">
          ← На главную
        </a>
        <span className="mx-2">•</span>
        Повторение
      </footer>
    </div>
  )
}
