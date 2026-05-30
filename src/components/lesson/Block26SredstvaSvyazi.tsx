'use client'

import React, { useState, useCallback } from 'react'
import { FadeUp, SlideIn } from '@/lib/motion'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Link2,
  ChevronDown,
  ChevronUp,
  PenLine,
  AlertOctagon,
  ArrowRight,
  ArrowRightLeft,
  GitBranch,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLessonStore } from '@/lib/store'
import { BLOCK26_MEANS, BLOCK26_PRACTICE_PAIRS, block26Content } from '@/lib/lesson-data'

// ─── Types ───────────────────────────────────────────────────────────────────

type MeanItem = (typeof BLOCK26_MEANS)[number]
type PracticePair = (typeof BLOCK26_PRACTICE_PAIRS)[number]

interface SelfStudyEntry {
  sentence1: string
  sentence2: string
  meanType: string
  specificWord: string
  connectsTo: string
}

// ─── Means Card ──────────────────────────────────────────────────────────────

function MeanCard({ item, index }: { item: MeanItem; index: number }) {
  const [expanded, setExpanded] = useState(false)

  const hasImportant = 'important' in item && item.important
  const hasDifference = 'difference' in item && item.difference

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <Card
        className={`transition-all hover:border-amber-400 dark:hover:border-amber-600 ${
          hasImportant ? 'border-rose-300 dark:border-rose-700' : 'border-amber-200 dark:border-amber-800'
        }`}
      >
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <CardTitle className="text-base">{item.name}</CardTitle>
                <Badge
                  variant="outline"
                  className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                >
                  {item.words.split(',')[0]}...
                </Badge>
                {hasImportant && (
                  <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 border-rose-300">
                    <AlertOctagon className="size-3 mr-1" />
                    Важно!
                  </Badge>
                )}
                <div className="ml-auto">
                  {expanded ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            <Separator />

            {/* Words list */}
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                Слова:
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300">{item.words}</p>
            </div>

            {/* Question */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                <GitBranch className="size-3" />
                Вопрос, на который отвечает:
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300">{item.question}</p>
            </div>

            {/* Example with highlighted connection words */}
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                Пример:
              </p>
              <p className="text-sm text-emerald-800 dark:text-emerald-300">{item.example}</p>
            </div>

            {/* Explanation */}
            <div className="rounded-lg bg-muted/50 border p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Объяснение:</p>
              <p className="text-sm text-foreground">{item.explanation}</p>
            </div>

            {/* Important note for ms2 */}
            {hasImportant && (
              <Alert className="border-rose-300 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800">
                <AlertOctagon className="size-4 text-rose-600 dark:text-rose-400" />
                <AlertTitle className="text-rose-800 dark:text-rose-300">
                  ВАЖНО: его / её / их — и личные, и притяжательные!
                </AlertTitle>
                <AlertDescription className="text-rose-700 dark:text-rose-400 space-y-2 mt-2">
                  <div className="rounded bg-rose-100/60 dark:bg-rose-900/30 p-2">
                    <p className="text-sm font-mono">
                      &laquo;Я увидел его.&raquo; → <strong>кого? его</strong> — ЛИЧНОЕ
                    </p>
                  </div>
                  <div className="rounded bg-emerald-100/60 dark:bg-emerald-900/30 p-2">
                    <p className="text-sm font-mono">
                      &laquo;Его книга лежала на столе.&raquo; → <strong>чья книга? его</strong> — ПРИТЯЖАТЕЛЬНОЕ
                    </p>
                  </div>
                  <p className="text-xs mt-1">
                    Различайте по вопросу: &laquo;кого/что?&raquo; → личное, &laquo;чей/чья/чье?&raquo; → притяжательное
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Difference note for ms9 */}
            {hasDifference && (
              <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
                <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">
                  Различие: лексический повтор vs форма слова
                </AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400 whitespace-pre-line text-sm">
                  {item.difference}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ─── Key Differences Section ─────────────────────────────────────────────────

function KeyDifferencesSection() {
  const kd = block26Content.keyDifferences

  // Color mapping for each difference group
  const diffColors: Record<string, { border: string; title: string; itemColors: string[] }> = {
    'ego-eyo-ih': {
      border: 'border-rose-200 dark:border-rose-700',
      title: 'text-rose-700 dark:text-rose-300',
      itemColors: ['bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800', 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'],
    },
    'repeat-form-cognate': {
      border: 'border-amber-200 dark:border-amber-700',
      title: 'text-amber-700 dark:text-amber-300',
      itemColors: ['bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800', 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800'],
    },
    'synonyms-context': {
      border: 'border-blue-200 dark:border-blue-700',
      title: 'text-blue-700 dark:text-blue-300',
      itemColors: ['bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'],
    },
  }

  const badgeColors: Record<string, string[]> = {
    'ego-eyo-ih': ['bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 border-rose-300', 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-300'],
    'repeat-form-cognate': ['bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-amber-300', 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 border-teal-300', 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 border-violet-300'],
    'synonyms-context': ['bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-300', 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-purple-300'],
  }

  const textColor: Record<string, string[]> = {
    'ego-eyo-ih': ['text-rose-600 dark:text-rose-400', 'text-emerald-600 dark:text-emerald-400'],
    'repeat-form-cognate': ['text-amber-600 dark:text-amber-400', 'text-teal-600 dark:text-teal-400', 'text-violet-600 dark:text-violet-400'],
    'synonyms-context': ['text-blue-600 dark:text-blue-400', 'text-purple-600 dark:text-purple-400'],
  }

  return (
    <Card className="border-rose-200 dark:border-rose-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertOctagon className="size-5 text-rose-600 dark:text-rose-400" />
          <CardTitle className="text-lg">{kd.title}</CardTitle>
        </div>
        <CardDescription>
          {kd.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {kd.differences.map((diff) => {
          const colors = diffColors[diff.id]
          const badges = badgeColors[diff.id]
          const texts = textColor[diff.id]
          if (!colors) return null

          const gridCols = diff.items.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'

          return (
            <div key={diff.id} className={`rounded-xl border-2 ${colors.border} p-4 space-y-3`}>
              <h4 className={`font-semibold ${colors.title} flex items-center gap-2`}>
                <ArrowRightLeft className="size-4" />
                {diff.title}
              </h4>
              <div className={`grid gap-3 ${gridCols}`}>
                {diff.items.map((item, i) => (
                  <div key={i} className={`rounded-lg border ${colors.itemColors?.[i] ?? ''} p-3 space-y-1`}>
                    <Badge className={`${badges?.[i] ?? ''} mb-1`}>
                      {item.label}
                    </Badge>
                    <p className="text-sm font-mono">{item.example}</p>
                    <p className={`text-xs ${texts?.[i] ?? ''}`}>
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ─── Algorithm 26 Section ────────────────────────────────────────────────────

function Algorithm26Section() {
  const steps = block26Content.algorithm26.steps

  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-amber-600 dark:text-amber-400" />
          <CardTitle className="text-lg">{block26Content.algorithm26.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {steps.map((stepText, i) => (
            <SlideIn key={i} direction={-1} delay={i * 0.1} duration={0.25} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="pt-1 text-foreground">{stepText}</span>
            </SlideIn>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

// ─── Main Warning ────────────────────────────────────────────────────────────

function MainWarning() {
  const warning = block26Content.mainWarning

  return (
    <Alert className="border-rose-400 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800">
      <AlertOctagon className="size-5 text-rose-600 dark:text-rose-400" />
      <AlertTitle className="text-rose-800 dark:text-rose-300 text-base font-bold">
        {warning.title}
      </AlertTitle>
      <AlertDescription className="text-rose-700 dark:text-rose-400 space-y-3 mt-2">
        <p className="font-semibold">
          {warning.mainText}
        </p>
        <div className="rounded-lg bg-white/60 dark:bg-rose-900/30 p-3 space-y-2 border border-rose-200 dark:border-rose-700">
          <p className="text-sm font-mono text-foreground">
            {warning.example}
          </p>
          <div className="space-y-1 text-sm">
            {warning.exampleExplanation.map((ex, i) => (
              <p key={i} className="flex items-start gap-2">
                <ArrowRight className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>{ex.word}</strong> {ex.explanation}
                </span>
              </p>
            ))}
          </div>
        </div>
        <p className="text-xs italic">
          {warning.closing}
        </p>
      </AlertDescription>
    </Alert>
  )
}

// ─── Practice Pair Card ──────────────────────────────────────────────────────

function PracticePairCard({ pair, index }: { pair: PracticePair; index: number }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <Card
      className={`transition-all hover:border-amber-400 dark:hover:border-amber-600 ${
        revealed ? 'border-emerald-300 dark:border-emerald-700' : 'border-amber-200 dark:border-amber-800'
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
            {index + 1}
          </span>
          <CardTitle className="text-sm font-semibold">Задание {index + 1}</CardTitle>
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 rounded-md px-2 py-0.5 break-words whitespace-normal">
              <GitBranch className="size-3 shrink-0" />
              {pair.question}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Two sentences */}
        <div className="space-y-2">
          <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-3">
            <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-1">
              Предыдущее предложение:
            </p>
            <p className="text-sm text-orange-800 dark:text-orange-300">{pair.sentence1}</p>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
              Указанное предложение:
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">{pair.sentence2}</p>
          </div>
        </div>

        {/* Reveal button / answer */}
        {!revealed ? (
            <Button
              variant="outline"
              onClick={() => setRevealed(true)}
              className="w-full border-dashed border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            >
              <Lightbulb className="size-4 mr-2" />
              Показать ответ
            </Button>
          ) : (
            <FadeUp duration={0.25} className="space-y-2">
              {/* Mean type */}
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  Средство связи:
                </p>
                <p className="text-sm text-emerald-800 dark:text-emerald-300 font-semibold">
                  {pair.meanTypeName}
                </p>
              </div>

              {/* Specific word */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                  <Link2 className="size-3" />
                  Конкретное слово:
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300 font-mono font-semibold">
                  {pair.specificWord}
                </p>
              </div>

              {/* Connects to */}
              <div className="rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 p-3">
                <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-1">
                  Связано с:
                </p>
                <p className="text-sm text-violet-800 dark:text-violet-300 font-mono">
                  {pair.connectsTo}
                </p>
              </div>

              {/* Explanation */}
              <div className="rounded-lg bg-muted/50 border p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Объяснение:</p>
                <p className="text-sm text-foreground">{pair.explanation}</p>
              </div>
            </FadeUp>
          )}
      </CardContent>
    </Card>
  )
}

// ─── Practice Template (Self-study) ─────────────────────────────────────────

function PracticeTemplate() {
  const { setErrorNote, errorNotes } = useLessonStore()
  const [entries, setEntries] = useState<SelfStudyEntry[]>([
    {
      sentence1: '',
      sentence2: '',
      meanType: '',
      specificWord: '',
      connectsTo: '',
    },
  ])

  const addEntry = useCallback(() => {
    setEntries((prev) => [
      ...prev,
      {
        sentence1: '',
        sentence2: '',
        meanType: '',
        specificWord: '',
        connectsTo: '',
      },
    ])
  }, [])

  const updateEntry = useCallback(
    (index: number, field: keyof SelfStudyEntry, value: string) => {
      setEntries((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], [field]: value }
        return updated
      })
    },
    []
  )

  const removeEntry = useCallback((index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const meanOptions = BLOCK26_MEANS.map((m) => ({
    value: m.id,
    label: m.name,
  }))

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PenLine className="size-5 text-orange-600 dark:text-orange-400" />
          <CardTitle className="text-lg">Своя пара предложений</CardTitle>
        </div>
        <CardDescription>
          Введите свою пару предложений и найдите средство связи между ними.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Format explanation */}
        <div className="rounded-lg bg-muted/50 border p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Формат ответа:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="rounded bg-orange-100 dark:bg-orange-900/30 p-2 text-center font-medium text-orange-700 dark:text-orange-300">
              Средство связи
            </div>
            <div className="rounded bg-blue-100 dark:bg-blue-900/30 p-2 text-center font-medium text-blue-700 dark:text-blue-300">
              Конкретное слово
            </div>
            <div className="rounded bg-emerald-100 dark:bg-emerald-900/30 p-2 text-center font-medium text-emerald-700 dark:text-emerald-300">
              Предложение
            </div>
            <div className="rounded bg-violet-100 dark:bg-violet-900/30 p-2 text-center font-medium text-violet-700 dark:text-violet-300">
              С чем связано в предыдущем
            </div>
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <FadeUp key={index} duration={0.2} className="rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-700 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-orange-300">
                  Разбор {index + 1}
                </Badge>
                {entries.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(index)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <XCircle className="size-4" />
                  </Button>
                )}
              </div>

              {/* Two sentences */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Предыдущее предложение:
                  </label>
                  <Input
                    placeholder="Введите предыдущее предложение..."
                    value={entry.sentence1}
                    onChange={(e) => updateEntry(index, 'sentence1', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Указанное предложение:
                  </label>
                  <Input
                    placeholder="Введите указанное предложение..."
                    value={entry.sentence2}
                    onChange={(e) => updateEntry(index, 'sentence2', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Mean type selection */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Средство связи:
                </label>
                <Select
                  value={entry.meanType}
                  onValueChange={(value) => updateEntry(index, 'meanType', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Выберите средство связи..." />
                  </SelectTrigger>
                  <SelectContent>
                    {meanOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specific word */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Конкретное слово (которое связывает):
                </label>
                <Input
                  placeholder="Напишите конкретное слово..."
                  value={entry.specificWord}
                  onChange={(e) => updateEntry(index, 'specificWord', e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Connects to */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  С чем связано в предыдущем предложении:
                </label>
                <Input
                  placeholder="На что указывает / что заменяет в предыдущем..."
                  value={entry.connectsTo}
                  onChange={(e) => updateEntry(index, 'connectsTo', e.target.value)}
                  className="text-sm"
                />
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Add entry button */}
        <Button variant="outline" onClick={addEntry} className="w-full">
          + Добавить ещё разбор
        </Button>

        {/* General error note */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Заметки по блоку 26:
          </label>
          <Textarea
            placeholder="Запишите, что нужно запомнить, где ошибаетесь..."
            defaultValue={errorNotes['block26-general'] ?? ''}
            onBlur={(e) => setErrorNote('block26-general', e.target.value)}
            className="text-sm min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Block26SredstvaSvyazi() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    visitedSections,
    markSectionVisited,
  } = useLessonStore()

  const [activeSection, setActiveSection] = useState<
    'theory' | 'differences' | 'algorithm' | 'practice'
  >('theory')

  const isCompleted = completedBlocks.includes('block26')
  const progress = blockProgress['block26']

  const visited = visitedSections['block26'] ?? []
  const requiredSections = ['theory', 'differences', 'algorithm', 'practice']
  const visitedCount = requiredSections.filter((s) => visited.includes(s)).length
  const allSectionsVisited = visitedCount === requiredSections.length

  const handleComplete = useCallback(() => {
    markBlockCompleted('block26')
  }, [markBlockCompleted])

  const sections = [
    { key: 'theory' as const, label: 'Средства связи', shortLabel: 'Ср-ва', icon: Link2 },
    { key: 'differences' as const, label: 'Различия', shortLabel: 'Разн.', icon: ArrowRightLeft },
    { key: 'algorithm' as const, label: 'Алгоритм', shortLabel: 'Алг.', icon: Shield },
    { key: 'practice' as const, label: 'Практика', shortLabel: 'Практ.', icon: PenLine },
  ]

  const handleTabClick = useCallback((key: 'theory' | 'differences' | 'algorithm' | 'practice') => {
    setActiveSection(key)
    markSectionVisited('block26', key)
  }, [markSectionVisited])

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 overflow-x-auto">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.key}
              onClick={() => handleTabClick(section.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors flex-shrink-0 flex-1 justify-center ${
                activeSection === section.key
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              <span className="sm:hidden text-xs">{section.shortLabel}</span>
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          )
        })}
      </div>

      {activeSection === 'theory' && (
        <FadeUp key="theory" duration={0.3} className="space-y-4">
            {/* Main Warning — at top of theory tab */}
            <MainWarning />

            {/* Intro */}
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Link2 className="size-5 text-orange-600 dark:text-orange-400" />
                  <CardTitle className="text-lg">{block26Content.theoryIntro.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-4 space-y-2">
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                    {block26Content.theoryIntro.mainText}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400">
                    <Link2 className="size-4" />
                    <span className="font-bold">{block26Content.theoryIntro.metaphor}</span>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {block26Content.theoryIntro.tips.map((tip, i) => (
                    <div key={i} className={`rounded-lg border p-3 ${
                      i === 0 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                    }`}>
                      <p className={`text-sm ${
                        i === 0 ? 'text-amber-800 dark:text-amber-300' : 'text-rose-800 dark:text-rose-300'
                      }`}>
                        <strong>{tip}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Means Cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-bold text-foreground">
                  Все 12 средств связи
                </h3>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-orange-300">
                  {BLOCK26_MEANS.length} средств
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {BLOCK26_MEANS.map((item, i) => (
                  <MeanCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>
        </FadeUp>
      )}

      {/* Key Differences */}
      {activeSection === 'differences' && (
        <FadeUp key="differences" duration={0.3} className="space-y-4">
            <KeyDifferencesSection />
        </FadeUp>
      )}

      {/* Algorithm */}
      {activeSection === 'algorithm' && (
        <FadeUp key="algorithm" duration={0.3} className="space-y-4">
            <Algorithm26Section />

            {/* Reminder of the main warning */}
            <Alert className="border-rose-400 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800">
              <AlertOctagon className="size-4 text-rose-600 dark:text-rose-400" />
              <AlertTitle className="text-rose-800 dark:text-rose-300">
                Помните главное!
              </AlertTitle>
              <AlertDescription className="text-rose-700 dark:text-rose-400">
                {block26Content.algorithmReminder}
              </AlertDescription>
            </Alert>
        </FadeUp>
      )}

      {/* Practice Template */}
      {activeSection === 'practice' && (
        <FadeUp key="practice" duration={0.3} className="space-y-4">
            {/* Training Pairs */}
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-amber-600 dark:text-amber-400" />
                  <CardTitle className="text-lg">Тренировочные задания</CardTitle>
                </div>
                <CardDescription>
                  Определите средство связи между предложениями в каждой паре.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* practiceNotice Alert */}
                <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
                  <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
                    {block26Content.practiceNotice}
                  </AlertDescription>
                </Alert>

                <div className="grid gap-3 sm:grid-cols-2">
                  {BLOCK26_PRACTICE_PAIRS.map((pair, i) => (
                    <PracticePairCard key={pair.id} pair={pair} index={i} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Self-study template */}
            <PracticeTemplate />
        </FadeUp>
      )}

      <Separator />

      {/* Complete Block */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isCompleted
            ? 'Блок пройден.'
            : allSectionsVisited
              ? 'Все разделы просмотрены. Можете завершить блок.'
              : `Посмотрите все разделы: ${visitedCount} из ${requiredSections.length} просмотрено`}
        </p>
        <Button
          onClick={handleComplete}
          disabled={isCompleted || !allSectionsVisited}
          variant={isCompleted ? 'outline' : 'default'}
          className={isCompleted ? '' : 'bg-orange-600 hover:bg-orange-700'}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              Блок пройден
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              Завершить блок
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
