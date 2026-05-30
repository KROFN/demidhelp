'use client'

import MechanismTrainer from '@/components/lesson-3005/MechanismTrainer'
import {
  BLOCK14_ALGORITHM,
  BLOCK14_PRACTICE,
  BLOCK14_WORKED_EXAMPLES,
  type Block14Mechanism,
} from '@/lib/lesson-data-30'

const MECHANISM_OPTIONS: { value: Block14Mechanism; label: string }[] = [
  { value: 'conjunction', label: 'союз' },
  { value: 'adverb', label: 'наречие' },
  { value: 'preposition', label: 'производный предлог' },
  { value: 'pronoun-preposition', label: 'местоимение с предлогом / частицей' },
  { value: 'particle', label: 'частица' },
  { value: 'hyphen', label: 'дефисная модель' },
  { value: 'pol', label: 'пол- / полу-' },
]

export default function Block14Spelling() {
  return (
    <MechanismTrainer
      blockId="block14"
      title="№14. Слитно, раздельно, дефис: сначала часть речи"
      goal="Нужно отличать союз, наречие, производный предлог, местоимение с предлогом, частицу, дефисную модель и пол-/полу-."
      mainThought="№14 не про «как пишется», а про «что это в предложении»."
      algorithm={BLOCK14_ALGORITHM}
      examples={BLOCK14_WORKED_EXAMPLES}
      tasks={BLOCK14_PRACTICE}
      mechanismOptions={MECHANISM_OPTIONS}
      answerLabel="Ответ: запишите правильное написание"
      mechanismPrompt="Что решало написание?"
      promptLabel="Выберите написание через часть речи или конструкцию"
    />
  )
}
