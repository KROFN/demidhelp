'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  PenLine,
  FileText,
  Eye,
  MessageSquare,
  Shield,
  ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useLessonStore } from '@/lib/store'
import {
  BLOCK1_MAP,
  BLOCK3_STYLES,
  BLOCK3_SPEECH_TYPES,
  block123Content,
  BLOCK123_PRACTICE,
} from '@/lib/lesson-data'

// ─── Style card colors ──────────────────────────────────────────────────────

const STYLE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string; badgeText: string; darkBg: string; darkBorder: string; darkText: string }> = {
  scientific: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    badge: 'bg-blue-100 border-blue-300 text-blue-700',
    badgeText: 'text-blue-600',
    darkBg: 'dark:bg-blue-950/40',
    darkBorder: 'dark:border-blue-800',
    darkText: 'dark:text-blue-200',
  },
  journalistic: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    badge: 'bg-orange-100 border-orange-300 text-orange-700',
    badgeText: 'text-orange-600',
    darkBg: 'dark:bg-orange-950/40',
    darkBorder: 'dark:border-orange-800',
    darkText: 'dark:text-orange-200',
  },
  artistic: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    badge: 'bg-purple-100 border-purple-300 text-purple-700',
    badgeText: 'text-purple-600',
    darkBg: 'dark:bg-purple-950/40',
    darkBorder: 'dark:border-purple-800',
    darkText: 'dark:text-purple-200',
  },
  conversational: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-900',
    badge: 'bg-teal-100 border-teal-300 text-teal-700',
    badgeText: 'text-teal-600',
    darkBg: 'dark:bg-teal-950/40',
    darkBorder: 'dark:border-teal-800',
    darkText: 'dark:text-teal-200',
  },
  official: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-900',
    badge: 'bg-slate-100 border-slate-300 text-slate-700',
    badgeText: 'text-slate-600',
    darkBg: 'dark:bg-slate-950/40',
    darkBorder: 'dark:border-slate-800',
    darkText: 'dark:text-slate-200',
  },
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StyleCard({ style }: { style: (typeof BLOCK3_STYLES)[number] }) {
  const [open, setOpen] = useState(false)
  const colors = STYLE_COLORS[style.id] || STYLE_COLORS.scientific

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className={`overflow-hidden transition-shadow hover:shadow-md ${colors.border}`}>
        <CollapsibleTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={`${colors.badge} text-xs`}>{style.name}</Badge>
                </div>
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="size-5 text-muted-foreground" />
                </motion.div>
              </div>
              <CardDescription className="mt-2">{style.howToRecognize}</CardDescription>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-2 space-y-3">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* Features */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Типовые признаки
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {style.features.map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Markers */}
              <div className={`rounded-lg ${colors.bg} ${colors.darkBg} border ${colors.border} ${colors.darkBorder} p-3`}>
                <p className={`text-xs font-medium ${colors.badgeText} ${colors.darkText} mb-1`}>
                  Фразы-маркеры
                </p>
                {style.markers.map((marker, i) => (
                  <p key={i} className={`text-sm ${colors.text} ${colors.darkText} font-medium`}>
                    {marker}
                  </p>
                ))}
              </div>

              {/* Traps */}
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                  Ловушки
                </p>
                <p className="text-sm text-amber-900 dark:text-amber-200">{style.traps}</p>
              </div>
            </motion.div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

function SpeechTypeCard({ type }: { type: (typeof BLOCK3_SPEECH_TYPES)[number] }) {
  const speechIcons: Record<string, React.ReactNode> = {
    narration: <FileText className="size-5 text-emerald-600 dark:text-emerald-400" />,
    description: <Eye className="size-5 text-blue-600 dark:text-blue-400" />,
    reasoning: <MessageSquare className="size-5 text-purple-600 dark:text-purple-400" />,
  }

  const speechColors: Record<string, string> = {
    narration: 'border-emerald-200 dark:border-emerald-800',
    description: 'border-blue-200 dark:border-blue-800',
    reasoning: 'border-purple-200 dark:border-purple-800',
  }

  return (
    <Card className={`overflow-hidden ${speechColors[type.id] || ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {speechIcons[type.id]}
          <CardTitle className="text-base">{type.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs shrink-0">
            Вопрос:
          </Badge>
          <span className="text-sm font-medium">{type.question}</span>
        </div>
        <p className="text-sm text-muted-foreground">{type.description}</p>
      </CardContent>
    </Card>
  )
}

function Block3PracticeWalkthrough() {
  const [step, setStep] = useState(0)
  const walkthroughSteps = block123Content.walkthrough.steps

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <PenLine className="size-5" />
          {block123Content.walkthrough.title}
        </CardTitle>
        <CardDescription>
          Пошаговый шаблон разбора
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {walkthroughSteps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: step >= i ? 1 : 0.3, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2">
              <div
                className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step >= i
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= i ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
            {s.content && step >= i && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground ml-8"
              >
                {s.content}
              </motion.p>
            )}
          </motion.div>
        ))}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Назад
          </Button>
          <Button
            size="sm"
            onClick={() => setStep((s) => Math.min(walkthroughSteps.length - 1, s + 1))}
            disabled={step === walkthroughSteps.length - 1}
          >
            Далее
          </Button>
        </div>


      </CardContent>
    </Card>
  )
}

// ─── Tab 1: Пропуск (Задание №1) ────────────────────────────────────────────

function Tab1Propusk() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Algorithm explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="size-5 text-emerald-500" />
            Алгоритм задания №1
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
              {block123Content.algorithm1.intro}
            </p>
          </div>

          <div className="space-y-3">
            {block123Content.algorithm1.steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  i === 0 ? 'bg-rose-100 dark:bg-rose-900' :
                  i === 1 ? 'bg-amber-100 dark:bg-amber-900' :
                  'bg-emerald-100 dark:bg-emerald-900'
                }`}>
                  <span className={`text-xs font-bold ${
                    i === 0 ? 'text-rose-700 dark:text-rose-300' :
                    i === 1 ? 'text-amber-700 dark:text-amber-300' :
                    'text-emerald-700 dark:text-emerald-300'
                  }`}>{i + 1}</span>
                </div>
                <p className="text-sm text-foreground">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mini-map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Карта функций → слов</CardTitle>
          <CardDescription>
            По логической функции пропуска определяем, какое слово нужно
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Функция
                  </th>
                  <th className="text-left py-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Слово
                  </th>
                </tr>
              </thead>
              <tbody>
                {BLOCK1_MAP.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="border-b last:border-b-0"
                  >
                    <td className="py-2.5 pr-4">
                      <Badge variant="outline" className="text-xs font-medium">
                        {item.function}
                      </Badge>
                    </td>
                    <td className="py-2.5">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {item.word}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


    </motion.div>
  )
}

// ─── Tab 2: Значение слова (Задание №2) ─────────────────────────────────────

function Tab2Znachenie() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Algorithm explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="size-5 text-emerald-500" />
            Алгоритм задания №2
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
              {block123Content.algorithm2.intro}
            </p>
          </div>

          {/* 4-step algorithm */}
          <div className="space-y-3">
            {block123Content.algorithm2.steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: (i + 1) * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                    i === 0 ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300' :
                    i === 1 ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' :
                    i === 2 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                    'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  <span className="text-sm font-bold">{i + 1}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{s.text}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Example */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{block123Content.algorithm2.exampleSreda.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <Badge variant="outline" className="text-xs border-rose-300 text-rose-600">
                {block123Content.algorithm2.exampleSreda.meaning1.label}
              </Badge>
              <p className="text-sm font-medium">{block123Content.algorithm2.exampleSreda.meaning1.text}</p>
              <p className="text-xs text-muted-foreground">
                {block123Content.algorithm2.exampleSreda.meaning1.example}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-600">
                {block123Content.algorithm2.exampleSreda.meaning2.label}
              </Badge>
              <p className="text-sm font-medium">{block123Content.algorithm2.exampleSreda.meaning2.text}</p>
              <p className="text-xs text-muted-foreground">
                {block123Content.algorithm2.exampleSreda.meaning2.example}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {block123Content.algorithm2.exampleSreda.explanation}
            </p>
          </div>
        </CardContent>
      </Card>


    </motion.div>
  )
}

// ─── Tab 3: Характеристики текста (Задание №3) ─────────────────────────────

function Tab3Harakteristiki() {
  const { errorNotes, setErrorNote } = useLessonStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Style intro */}
      <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-950/40 dark:border-purple-800">
        <Shield className="size-4 text-purple-600 dark:text-purple-400" />
        <AlertTitle className="text-purple-800 dark:text-purple-300">
          Что такое стиль?
        </AlertTitle>
        <AlertDescription className="text-purple-700 dark:text-purple-400">
          {block123Content.styleExplanation}
        </AlertDescription>
      </Alert>

      {/* Style cards */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Стили речи</h3>
        {BLOCK3_STYLES.map((style) => (
          <StyleCard key={style.id} style={style} />
        ))}
      </div>

      <Separator />

      {/* Speech types */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Типы речи</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {BLOCK3_SPEECH_TYPES.map((type) => (
            <SpeechTypeCard key={type.id} type={type} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Key rule */}
      <Alert className="border-rose-300 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800">
        <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
        <AlertTitle className="text-rose-800 dark:text-rose-300">
          {block123Content.rule3.title}
        </AlertTitle>
        <AlertDescription className="text-rose-700 dark:text-rose-400">
          {block123Content.rule3.text}
        </AlertDescription>
      </Alert>

      {/* Practice walkthrough */}
      <Block3PracticeWalkthrough />

      {/* Error note */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">
          Заметки по блоку 1-3
        </label>
        <Textarea
          placeholder="Запишите, что нужно запомнить по заданиям №1-3..."
          defaultValue={errorNotes['block123-general'] ?? ''}
          onBlur={(e) => setErrorNote('block123-general', e.target.value)}
          className="text-sm min-h-[60px]"
        />
      </div>
    </motion.div>
  )
}

// ─── Tab Practice: Практика (Задания 1-3) ────────────────────────────────────

function Practice123Section() {
  const { practiceAnswers, setPracticeAnswer, errorNotes, setErrorNote } = useLessonStore()
  const data = BLOCK123_PRACTICE

  // Task 1 state
  const [task1Answer, setTask1Answer] = useState('')
  const [task1Checked, setTask1Checked] = useState(false)
  const existingT1 = practiceAnswers[data.task1.id]

  // Task 2 state
  const [task2Selected, setTask2Selected] = useState<Set<number>>(new Set())
  const [task2Checked, setTask2Checked] = useState(false)
  const existingT2 = practiceAnswers[data.task2.id]

  // Task 3 state
  const [task3Selected, setTask3Selected] = useState<Set<number>>(new Set())
  const [task3Checked, setTask3Checked] = useState(false)
  const existingT3 = practiceAnswers[data.task3.id]

  const handleTask1Check = useCallback(() => {
    if (!task1Answer.trim()) return
    const isCorrect = task1Answer.trim().toLowerCase() === data.task1.answer.toLowerCase()
    setTask1Checked(true)
    setPracticeAnswer({
      questionId: data.task1.id,
      blockId: 'block123',
      answer: task1Answer.trim(),
      status: isCorrect ? 'correct' : 'incorrect',
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [task1Answer, data.task1, setPracticeAnswer])

  const handleTask2Toggle = useCallback((num: number) => {
    if (task2Checked) return
    setTask2Selected((prev) => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }, [task2Checked])

  const handleTask2Check = useCallback(() => {
    if (task2Selected.size === 0) return
    const correctSet = new Set(data.task2.options.filter((o) => o.isCorrect).map((o) => o.number))
    const isCorrect =
      task2Selected.size === correctSet.size &&
      [...task2Selected].every((n) => correctSet.has(n))
    setTask2Checked(true)
    setPracticeAnswer({
      questionId: data.task2.id,
      blockId: 'block123',
      answer: [...task2Selected].sort().join(', '),
      status: isCorrect ? 'correct' : 'incorrect',
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [task2Selected, data.task2, setPracticeAnswer])

  const handleTask3Toggle = useCallback((num: number) => {
    if (task3Checked) return
    setTask3Selected((prev) => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }, [task3Checked])

  const handleTask3Check = useCallback(() => {
    if (task3Selected.size === 0) return
    const correctSet = new Set(data.task3.options.filter((o) => o.isCorrect).map((o) => o.number))
    const isCorrect =
      task3Selected.size === correctSet.size &&
      [...task3Selected].every((n) => correctSet.has(n))
    setTask3Checked(true)
    setPracticeAnswer({
      questionId: data.task3.id,
      blockId: 'block123',
      answer: [...task3Selected].sort().join(', '),
      status: isCorrect ? 'correct' : 'incorrect',
      errorNote: '',
      timestamp: Date.now(),
    })
  }, [task3Selected, data.task3, setPracticeAnswer])

  const t1Status = existingT1?.status
  const t2Status = existingT2?.status
  const t3Status = existingT3?.status

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Microtext */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="size-5 text-emerald-500" />
            Микротекст
          </CardTitle>
          <CardDescription>Прочитайте текст для выполнения заданий №1–3</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-48">
            <p className="text-sm leading-relaxed whitespace-pre-line break-words">{data.microtext}</p>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Task 1: Input answer */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs shrink-0">№1</Badge>
            <CardTitle className="text-base min-w-0 break-words">{data.task1.title}</CardTitle>
            <div className="ml-auto">
              {t1Status === 'correct' && <CheckCircle2 className="size-5 text-emerald-500" />}
              {t1Status === 'incorrect' && <XCircle className="size-5 text-rose-500" />}
            </div>
          </div>
          <CardDescription className="break-words">{data.task1.text}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-3 break-words">
            <p className="text-sm font-medium">{data.task1.question}</p>
          </div>

          <div className="flex gap-2">
            <Input
              value={task1Answer}
              onChange={(e) => !task1Checked && setTask1Answer(e.target.value)}
              placeholder="Введите слово..."
              disabled={task1Checked}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleTask1Check()}
            />
            <Button
              onClick={handleTask1Check}
              disabled={task1Checked || !task1Answer.trim()}
              size="sm"
            >
              Проверить
            </Button>
          </div>

          <AnimatePresence>
            {task1Checked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className={`rounded-lg border-2 p-3 ${
                  t1Status === 'correct'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {t1Status === 'correct' ? (
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="size-4 text-rose-600 dark:text-rose-400" />
                    )}
                    <span className={`text-sm font-semibold ${
                      t1Status === 'correct'
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-700 dark:text-rose-300'
                    }`}>
                      Правильный ответ: {data.task1.answer}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.task1.explanation}</p>
                </div>

                {data.task1.checkNote && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Совет</span>
                    </div>
                    <p className="text-sm text-amber-800 dark:text-amber-200">{data.task1.checkNote}</p>
                  </div>
                )}

                {t1Status === 'incorrect' && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Заметка / что запомнить
                    </label>
                    <Textarea
                      placeholder="Запишите, чтобы запомнить..."
                      defaultValue={errorNotes[data.task1.id] ?? ''}
                      onBlur={(e) => setErrorNote(data.task1.id, e.target.value)}
                      className="text-sm min-h-[50px]"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Task 2: Checkboxes with options */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs shrink-0">№2</Badge>
            <CardTitle className="text-base min-w-0 break-words">{data.task2.title}</CardTitle>
            <div className="ml-auto">
              {t2Status === 'correct' && <CheckCircle2 className="size-5 text-emerald-500" />}
              {t2Status === 'incorrect' && <XCircle className="size-5 text-rose-500" />}
            </div>
          </div>
          <CardDescription className="break-words">{data.task2.text}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-3 break-words">
            <p className="text-sm font-medium">{data.task2.question}</p>
          </div>

          <div className="space-y-2">
            {data.task2.options.map((option) => {
              const isSelected = task2Selected.has(option.number)
              const isCorrect = option.isCorrect

              let optionClass = 'rounded-lg border-2 p-3 transition-all '
              if (!task2Checked) {
                optionClass += isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40 hover:bg-accent/50 cursor-pointer'
              } else if (isCorrect) {
                optionClass += 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
              } else if (isSelected && !isCorrect) {
                optionClass += 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
              } else {
                optionClass += 'border-border opacity-50'
              }

              return (
                <div
                  key={option.number}
                  className={optionClass}
                  onClick={() => handleTask2Toggle(option.number)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      disabled={task2Checked}
                      className="mt-0.5"
                      onCheckedChange={() => handleTask2Toggle(option.number)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs shrink-0">
                          {option.number}
                        </Badge>
                        <span className="text-sm font-semibold">{option.word}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{option.definition}</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {task2Checked && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 ml-8"
                      >
                        <div className={`flex items-start gap-2 text-sm ${
                          isCorrect
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : isSelected
                              ? 'text-rose-700 dark:text-rose-300'
                              : 'text-muted-foreground'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="size-4 mt-0.5 shrink-0" />
                          ) : null}
                          <span>{option.explanation}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {data.task2.hint && !task2Checked && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Подсказка</span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{data.task2.hint}</p>
            </div>
          )}

          <Button
            onClick={handleTask2Check}
            disabled={task2Checked || task2Selected.size === 0}
            size="sm"
          >
            Проверить
          </Button>

          {task2Checked && t2Status === 'incorrect' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Заметка / что запомнить
              </label>
              <Textarea
                placeholder="Запишите, чтобы запомнить..."
                defaultValue={errorNotes[data.task2.id] ?? ''}
                onBlur={(e) => setErrorNote(data.task2.id, e.target.value)}
                className="text-sm min-h-[50px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task 3: Checkboxes with options */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs shrink-0">№3</Badge>
            <CardTitle className="text-base min-w-0 break-words">{data.task3.title}</CardTitle>
            <div className="ml-auto">
              {t3Status === 'correct' && <CheckCircle2 className="size-5 text-emerald-500" />}
              {t3Status === 'incorrect' && <XCircle className="size-5 text-rose-500" />}
            </div>
          </div>
          <CardDescription className="break-words">{data.task3.text}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-3 break-words">
            <p className="text-sm font-medium">{data.task3.question}</p>
          </div>

          <div className="space-y-2">
            {data.task3.options.map((option) => {
              const isSelected = task3Selected.has(option.number)
              const isCorrect = option.isCorrect

              let optionClass = 'rounded-lg border-2 p-3 transition-all '
              if (!task3Checked) {
                optionClass += isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40 hover:bg-accent/50 cursor-pointer'
              } else if (isCorrect) {
                optionClass += 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
              } else if (isSelected && !isCorrect) {
                optionClass += 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
              } else {
                optionClass += 'border-border opacity-50'
              }

              return (
                <div
                  key={option.number}
                  className={optionClass}
                  onClick={() => handleTask3Toggle(option.number)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      disabled={task3Checked}
                      className="mt-0.5"
                      onCheckedChange={() => handleTask3Toggle(option.number)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs shrink-0">
                          {option.number}
                        </Badge>
                        <span className="text-sm">{option.text}</span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {task3Checked && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 ml-8"
                      >
                        <div className={`flex items-start gap-2 text-sm ${
                          isCorrect
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : isSelected
                              ? 'text-rose-700 dark:text-rose-300'
                              : 'text-muted-foreground'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="size-4 mt-0.5 shrink-0" />
                          ) : null}
                          <span>{option.explanation}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <Button
            onClick={handleTask3Check}
            disabled={task3Checked || task3Selected.size === 0}
            size="sm"
          >
            Проверить
          </Button>

          {task3Checked && t3Status === 'incorrect' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Заметка / что запомнить
              </label>
              <Textarea
                placeholder="Запишите, чтобы запомнить..."
                defaultValue={errorNotes[data.task3.id] ?? ''}
                onBlur={(e) => setErrorNote(data.task3.id, e.target.value)}
                className="text-sm min-h-[50px]"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Block123Microtext() {
  const {
    completedBlocks,
    markBlockCompleted,
    blockProgress,
    visitedSections,
    markSectionVisited,
  } = useLessonStore()

  const [activeSection, setActiveSection] = useState<'tab1' | 'tab2' | 'tab3' | 'practice'>('tab1')

  const isCompleted = completedBlocks.includes('block123')
  const progress = blockProgress['block123']

  const visited = visitedSections['block123'] ?? []
  const requiredSections = ['tab1', 'tab2', 'tab3', 'practice']
  const visitedCount = requiredSections.filter((s) => visited.includes(s)).length
  const allSectionsVisited = visitedCount === requiredSections.length

  const sections = [
    { key: 'tab1' as const, label: '№1 Пропуск', shortLabel: '№1', icon: Sparkles },
    { key: 'tab2' as const, label: '№2 Значение', shortLabel: '№2', icon: BookOpen },
    { key: 'tab3' as const, label: '№3 Характеристики', shortLabel: '№3', icon: FileText },
    { key: 'practice' as const, label: 'Практика', shortLabel: 'Практ.', icon: PenLine },
  ]

  const handleTabClick = useCallback((key: 'tab1' | 'tab2' | 'tab3' | 'practice') => {
    setActiveSection(key)
    markSectionVisited('block123', key)
  }, [markSectionVisited])

  const handleComplete = useCallback(() => {
    markBlockCompleted('block123')
  }, [markBlockCompleted])

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.key}
              onClick={() => handleTabClick(section.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors flex-1 justify-center ${
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

      <AnimatePresence mode="wait">
        {activeSection === 'tab1' && (
          <motion.div
            key="tab1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Tab1Propusk />
          </motion.div>
        )}

        {activeSection === 'tab2' && (
          <motion.div
            key="tab2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Tab2Znachenie />
          </motion.div>
        )}

        {activeSection === 'tab3' && (
          <motion.div
            key="tab3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Tab3Harakteristiki />
          </motion.div>
        )}

        {activeSection === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Practice123Section />
          </motion.div>
        )}
      </AnimatePresence>

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
