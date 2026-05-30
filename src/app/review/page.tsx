import { Suspense } from 'react'
import ReviewPageClient from '@/components/review/ReviewPageClient'

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Загрузка…</p>
          </div>
        </div>
      }
    >
      <ReviewPageClient />
    </Suspense>
  )
}
