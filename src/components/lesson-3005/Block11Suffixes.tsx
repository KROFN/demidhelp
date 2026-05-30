'use client'

import MechanismTrainer from '@/components/lesson-3005/MechanismTrainer'
import {
  BLOCK11_ALGORITHM,
  BLOCK11_PRACTICE,
  BLOCK11_WORKED_EXAMPLES,
  type Block11Mechanism,
} from '@/lib/lesson-data-30'

const MECHANISM_OPTIONS: { value: Block11Mechanism; label: string }[] = [
  { value: 'adjective', label: 'прилагательное' },
  { value: 'noun', label: 'существительное' },
  { value: 'verb', label: 'глагол' },
  { value: 'adverb', label: 'наречие' },
  { value: 'trap', label: 'исключение / словарная мина' },
]

export default function Block11Suffixes() {
  return (
    <MechanismTrainer
      blockId="block11"
      title="№11. Суффиксы: сначала часть речи"
      goal="Одна буква может появляться из разных правил, поэтому сначала определяем часть речи, а уже потом выбираем суффикс."
      mainThought="В №11 одна и та же буква может быть результатом разных правил. Сначала часть речи — потом суффикс."
      algorithm={BLOCK11_ALGORITHM}
      examples={BLOCK11_WORKED_EXAMPLES}
      tasks={BLOCK11_PRACTICE}
      mechanismOptions={MECHANISM_OPTIONS}
      answerLabel="Ответ: напишите полное слово"
      mechanismPrompt="Что проверялось?"
      promptLabel="Определите часть речи и суффикс"
    />
  )
}
