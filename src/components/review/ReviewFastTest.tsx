'use client'

import { useState, useCallback } from 'react'
import { FadeUp } from '@/lib/motion'
import { Eye, CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { FastTestQuestion } from '@/lib/review/review-sources'
import type { ReviewStatus } from '@/lib/review/review-progress-store'
import { useReviewProgressStore } from '@/lib/review/review-progress-store'

interface ReviewFastTestProps {
  deckSlug: string
  questions: FastTestQuestion[]
  title: string
}

export default function ReviewFastTest({
  deckSlug,
  questions,
  title,
}: ReviewFastTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [knownCount, setKnownCount] = useState(0)
  const [repeatCount, setRepeatCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)

  const { setQuestionStatus } = useReviewProgressStore()

  const currentQuestion = questions[currentIndex]

  const handleShowAnswer = useCallback(() => {
    setIsAnswerVisible(true)
  }, [])

  const handleStatus = useCallback(
    (status: ReviewStatus) => {
      if (!currentQuestion) return

      setQuestionStatus(deckSlug, currentQuestion.id, status)

      if (status === 'known') setKnownCount((c) => c + 1)
      if (status === 'repeat') setRepeatCount((c) => c + 1)
      if (status === 'error') setErrorCount((c) => c + 1)

      // Move to next question
      if (currentIndex + 1 >= questions.length) {
        setIsFinished(true)
      } else {
        setCurrentIndex((i) => i + 1)
        setIsAnswerVisible(false)
      }
    },
    [currentQuestion, currentIndex, questions.length, deckSlug, setQuestionStatus]
  )

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setIsAnswerVisible(false)
    setIsFinished(false)
    setKnownCount(0)
    setRepeatCount(0)
    setErrorCount(0)
  }, [])

  // Finished state
  if (isFinished) {
    return (
      <FadeUp className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Тест завершён!</h2>
          <p className="text-muted-foreground">
            {questions.length} вопросов пройдено
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{knownCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Знаю</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{repeatCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Повторить</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 text-center">
              <p className="text-2xl font-bold text-rose-600">{errorCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ошибки</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={handleRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Ещё раз
          </Button>
        </div>
      </FadeUp>
    )
  }

  // Active question
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100)

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <Progress value={progressPct} className="h-2 flex-1" />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <Badge variant="outline" className="text-xs">
        {title}
      </Badge>

      {/* Question card */}
      <FadeUp key={currentQuestion.id} duration={0.2}>
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Question */}
              <h3 className="text-lg font-semibold leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Show answer button / Answer */}
              {!isAnswerVisible ? (
                <div className="flex justify-center pt-2">
                  <Button
                    size="lg"
                    onClick={handleShowAnswer}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  >
                    <Eye className="h-5 w-5" />
                    Показать ответ
                  </Button>
                </div>
              ) : (
                <>
                  {/* Answer */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-base leading-relaxed">
                      {currentQuestion.answer}
                    </p>
                  </div>

                  {/* Status buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleStatus('known')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      size="lg"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Знаю
                    </Button>
                    <Button
                      onClick={() => handleStatus('repeat')}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white gap-1.5"
                      size="lg"
                    >
                      <RotateCcw className="h-5 w-5" />
                      Повторить
                    </Button>
                    <Button
                      onClick={() => handleStatus('error')}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
                      size="lg"
                    >
                      <XCircle className="h-5 w-5" />
                      Ошибка
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
      </FadeUp>
    </div>
  )
}
