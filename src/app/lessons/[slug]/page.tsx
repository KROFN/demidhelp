import { lessonSlugs } from '@/lib/lessons'
import LessonRouteClient from './LessonRouteClient'

export function generateStaticParams() {
  return lessonSlugs().map((slug) => ({ slug }))
}

interface LessonPageProps {
  params: Promise<{ slug: string }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params
  return <LessonRouteClient slug={slug} />
}
