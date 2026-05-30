'use client'

import React, { useState, useCallback } from 'react'
import {
  ClipboardList,
  CheckCircle2,
  ExternalLink,
  ListChecks,
  ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useLessonStore } from '@/lib/store'
import { HOMEWORK_KES_ITEMS, HOMEWORK_KES_COMPACT, HOMEWORK_COUNTS_FINAL } from '@/lib/lesson-data'

// ─── KES Task Row (compact + expandable) ────────────────────────────────────

function KesTaskRow({ compactItem }: { compactItem: (typeof HOMEWORK_KES_COMPACT)[number] }) {
  const [open, setOpen] = useState(false)

  // Find the full item by task number
  const fullItem = HOMEWORK_KES_ITEMS.find((i) => i.task === compactItem.task)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border p-3">
        {/* Compact row */}
        <div className="flex items-start gap-3">
          <Badge variant="secondary" className="mt-0.5 shrink-0">
            {compactItem.task}
          </Badge>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold break-words">{compactItem.title}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {compactItem.codes.map((code) => (
                <Badge key={code} variant="outline" className="text-xs font-mono">
                  {code}
                </Badge>
              ))}
            </div>
          </div>
          {fullItem && fullItem.kes.length > 0 && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="shrink-0 text-xs text-muted-foreground gap-1 px-2">
                <span>{open ? 'Свернуть' : 'Подробнее'}</span>
                <ChevronDown className={`size-3 transition-transform ${open ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          )}
        </div>

        {/* Expanded: full KES items */}
        {fullItem && fullItem.kes.length > 0 && (
          <CollapsibleContent>
            <div className="mt-2 ml-0 space-y-1.5 pt-2 border-t">
              {fullItem.kes.map((ke) => (
                <div key={ke.code} className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">
                    {ke.code}
                  </Badge>
                  <p className="text-xs text-muted-foreground break-words">{ke.name}</p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function HomeworkSection() {
  const {
    completedBlocks,
    markBlockCompleted,
  } = useLessonStore()

  const isCompleted = completedBlocks.includes('homework')

  const handleComplete = useCallback(() => {
    markBlockCompleted('homework')
  }, [markBlockCompleted])

  return (
    <div className="space-y-6">
      {/* КЭС для ФИПИ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="size-5" />
            КЭС для ФИПИ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {HOMEWORK_KES_COMPACT.map((item) => (
              <KesTaskRow key={item.task} compactItem={item} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FIPI link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ExternalLink className="size-5" />
            Банк заданий ФИПИ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href="https://ege.fipi.ru/bank/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Перейти на ege.fipi.ru/bank →
          </a>
        </CardContent>
      </Card>

      {/* Task counts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="size-5" />
            Количество заданий
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {HOMEWORK_COUNTS_FINAL.map((item) => (
              <div
                key={item.task}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Badge variant="secondary" className="mt-0.5 shrink-0">
                  {item.task}
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm font-semibold break-words">
                    {item.title}{' '}
                    <span className="text-primary">({item.count})</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">{item.format}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Complete button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Ознакомьтесь с информацией выше</p>
        <Button
          onClick={handleComplete}
          disabled={isCompleted}
          variant={isCompleted ? 'outline' : 'default'}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              Домашка просмотрена
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              Отметить как просмотренную
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
