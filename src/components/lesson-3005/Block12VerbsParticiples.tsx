'use client'

import MechanismTrainer from '@/components/lesson-3005/MechanismTrainer'
import {
  BLOCK12_ALGORITHM,
  BLOCK12_PRACTICE,
  BLOCK12_WORKED_EXAMPLES,
  type Block12Mechanism,
} from '@/lib/lesson-data-30'

const MECHANISM_OPTIONS: { value: Block12Mechanism; label: string }[] = [
  { value: 'conjugation', label: 'спряжение' },
  { value: 'present-participle-active', label: 'действительное причастие настоящего времени' },
  { value: 'present-participle-passive', label: 'страдательное причастие настоящего времени' },
  { value: 'past-infinitive', label: 'прошедшее / инфинитив' },
  { value: 'imperative', label: 'повелительное наклонение' },
  { value: 'trap', label: 'исключение / словарная мина' },
]

export default function Block12VerbsParticiples() {
  return (
    <MechanismTrainer
      blockId="block12"
      title="№12. Глаголы и причастия: буква зависит от формы"
      goal="Нужно отличать личную форму, причастие настоящего времени, прошедшее/инфинитив, повелительное наклонение и словарные мины."
      mainThought="№12 решается не по звучанию, а через производящий глагол."
      algorithm={BLOCK12_ALGORITHM}
      examples={BLOCK12_WORKED_EXAMPLES}
      tasks={BLOCK12_PRACTICE}
      mechanismOptions={MECHANISM_OPTIONS}
      answerLabel="Ответ: напишите полное слово"
      mechanismPrompt="Почему именно эта буква?"
      promptLabel="Вставьте букву и определите форму"
    />
  )
}
