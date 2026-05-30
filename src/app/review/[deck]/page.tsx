import { reviewDeckSlugs } from '@/lib/review/review-sources'
import ReviewDeckClient from './ReviewDeckClient'

export function generateStaticParams() {
  return reviewDeckSlugs().map((deck) => ({ deck }))
}

interface ReviewDeckPageProps {
  params: Promise<{ deck: string }>
}

export default async function ReviewDeckPage({ params }: ReviewDeckPageProps) {
  const { deck } = await params
  return <ReviewDeckClient deckSlug={deck} />
}
