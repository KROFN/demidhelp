'use client'

import { useCallback } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  ListChecks,
  SearchCheck,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BLOCK2325_MACROTEXT, BLOCK2325_PRACTICE, BLOCK2325_REMINDERS } from '@/lib/lesson-data-30'
import { useLesson30Store } from '@/lib/store-30'

const TASK_FORMAT = [
  '№23 — содержание текста',
  '№24 — типы речи / логико-смысловые отношения',
  '№25 — лексика, фразеологизм, синонимы или антонимы',
] as const

function sourceMissing() {
  return (
    BLOCK2325_MACROTEXT.sourceId.includes('TODO_LESSON_30_SOURCE') ||
    BLOCK2325_MACROTEXT.text.includes('TODO_LESSON_30_SOURCE') ||
    BLOCK2325_PRACTICE.some((task) => task.sourceId.includes('TODO_LESSON_30_SOURCE'))
  )
}

export default function Block2325MacrotextControl() {
  const { completedBlocks, markBlockCompleted } = useLesson30Store()
  const isCompleted = completedBlocks.includes('block2325')
  const missingSource = sourceMissing()

  const handleComplete = useCallback(() => {
    markBlockCompleted('block2325')
  }, [markBlockCompleted])

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            105–115 минут
          </Badge>
          <h2 className="text-xl font-semibold tracking-tight">
            №23–25. Макротекст: контроль без раздувания
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Здесь не появляется новая теория. Блок нужен только для короткой проверки, что навык макротекста не развалился после орфографии.
          </p>
        </div>

        {missingSource && (
          <Alert className="border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40">
            <AlertTriangle className="size-4 text-sky-600 dark:text-sky-400" />
            <AlertTitle className="text-sky-900 dark:text-sky-300">
              Source-файл для макротекста не подключён
            </AlertTitle>
            <AlertDescription className="text-sky-800 dark:text-sky-300">
              По контентному lock нельзя придумывать текст и задания. Поэтому заглушка скрыта из тренировки, а блок оставлен как контрольный чек-лист до подключения реального корпуса.
            </AlertDescription>
          </Alert>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {TASK_FORMAT.map((item) => (
          <Card key={item}>
            <CardContent className="flex h-full items-start gap-3 p-4">
              <FileText className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-sm font-medium leading-relaxed">{item}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ListChecks className="size-5 text-primary" />
          <h3 className="text-base font-semibold">Три напоминания перед текстом</h3>
        </div>
        <div className="space-y-2">
          {BLOCK2325_REMINDERS.map((reminder, index) => (
            <div key={reminder} className="flex gap-3 rounded-lg border bg-background p-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed">{reminder}</p>
            </div>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <SearchCheck className="size-5" />
            Как должен работать блок после подключения источника
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Показать прокручиваемый макротекст, затем отдельные поля ответа для №23, №24 и №25.</p>
          <p>После проверки показать правильный ответ, доказательство в тексте и тип ошибки, если ответ неверный.</p>
          <p>Сейчас это намеренно не рендерится как практика, потому что реальный текст отсутствует.</p>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Блок можно отметить как пройденный после фиксации напоминаний.
        </p>
        <Button
          onClick={handleComplete}
          disabled={isCompleted}
          variant={isCompleted ? 'outline' : 'default'}
        >
          <CheckCircle2 className="mr-2 size-4" />
          {isCompleted ? 'Блок пройден' : 'Зафиксировал напоминания'}
        </Button>
      </div>
    </div>
  )
}
