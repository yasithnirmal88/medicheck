import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import Card from '@/shared/ui/Card'
import Skeleton from '@/shared/ui/Skeleton'
import Button from '@/shared/ui/Button'
import QuestionRenderer from '../components/QuestionRenderer'
import ProgressBar from '../components/ProgressBar'
import SectionHeader from '../components/SectionHeader'
import NavigationButtons from '../components/NavigationButtons'
import AutoSaveIndicator from '../components/AutoSaveIndicator'
import QuestionnaireComplete from '../components/QuestionnaireComplete'
import ReviewScreen from '../components/ReviewScreen'
import { useQuestionnaireSession } from '../hooks/useQuestionnaireSession'
import {
  useCompleteSession,
  usePauseSession,
  useResumeSession,
  useSearchQuestions,
} from '../hooks/useQuestionnaire'
import { cn } from '@/lib/utils'

type Phase = 'question' | 'review' | 'complete'

const QuestionnaireSessionPage: React.FC = () => {
  const { id: sessionId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<Phase>('question')
  const [localError, setLocalError] = useState<string | undefined>()
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, any>>({})

  const {
    currentQuestion,
    currentIndex,
    goNext,
    goBack,
    goToQuestion,
    saveAnswer,
    isFirst,
    isLast,
    progress,
    answers,
    elapsedTime,
    saveStatus,
    isSaving,
    error,
    isLoading,
    session,
    totalQuestions,
  } = useQuestionnaireSession(sessionId)

  const completeMutation = useCompleteSession()
  const pauseMutation = usePauseSession()
  const resumeMutation = useResumeSession()
  const searchMutation = useSearchQuestions()

  useEffect(() => {
    if (error) {
      setLocalError('An error occurred. Please try again.')
    } else {
      setLocalError(undefined)
    }
  }, [error])

  const handleAnswerChange = useCallback(
    (value: any) => {
      if (!currentQuestion) return
      setLocalError(undefined)
      saveAnswer(currentQuestion.id, { value })
    },
    [currentQuestion, saveAnswer]
  )

  const handleNext = useCallback(() => {
    if (!currentQuestion) return
    if (currentQuestion.is_required) {
      const val = answers[currentQuestion.id]
      const responseValue = val?.value
      if (responseValue === undefined || responseValue === null || responseValue === '') {
        setLocalError('This question is required')
        return
      }
    }
    if (isLast) {
      setReviewAnswers({ ...answers })
      setPhase('review')
    } else {
      goNext()
    }
  }, [currentQuestion, answers, isLast, goNext])

  const handleSubmitReview = useCallback(() => {
    if (!sessionId) return
    completeMutation.mutate(sessionId, {
      onSuccess: () => setPhase('complete'),
      onError: () => setLocalError('Failed to submit. Please try again.'),
    })
  }, [sessionId, completeMutation])

  const handleEdit = useCallback(
    (index: number) => {
      goToQuestion(index)
      setPhase('question')
    },
    [goToQuestion]
  )

  const handlePause = useCallback(() => {
    if (sessionId) pauseMutation.mutate(sessionId)
  }, [sessionId, pauseMutation])

  const handleResume = useCallback(() => {
    if (sessionId) resumeMutation.mutate(sessionId)
  }, [sessionId, resumeMutation])

  const handleReturnToDashboard = () => {
    navigate('/')
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto p-4">
          <Card>
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-20 mb-4" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </AppLayout>
    )
  }

  if (!session) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto p-4 text-center">
          <p className="text-gray-500">Session not found</p>
          <Button onClick={() => navigate('/questionnaires')} className="mt-4 min-h-[44px]">
            Back to Assessments
          </Button>
        </div>
      </AppLayout>
    )
  }

  if (phase === 'complete') {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto p-4">
          <QuestionnaireComplete
            session={session}
            score={null}
            onReturnToDashboard={handleReturnToDashboard}
          />
        </div>
      </AppLayout>
    )
  }

  if (phase === 'review') {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto p-4">
          <Card>
            <ReviewScreen
              questions={session.current_question ? [session.current_question] : []}
              answers={reviewAnswers}
              onEdit={handleEdit}
              onSubmit={handleSubmitReview}
            />
          </Card>
        </div>
      </AppLayout>
    )
  }

  const pct = progress?.completion_percentage ?? 0

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 order-2 lg:order-1">
            <Card>
              {session.status === 'paused' && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">Session is paused</p>
                  <Button onClick={handleResume} className="min-h-[44px]">
                    Resume
                  </Button>
                </div>
              )}

              {session.status === 'in_progress' && currentQuestion && (
                <div className="space-y-6">
                  <SectionHeader
                    groupName={null}
                    groupDescription={null}
                    questionIndex={currentIndex}
                    totalQuestions={totalQuestions}
                  />

                  <QuestionRenderer
                    question={currentQuestion}
                    value={answers[currentQuestion.id]?.value}
                    onChange={handleAnswerChange}
                    error={localError}
                    disabled={isSaving}
                    onSearch={async (q) => { const res = await searchMutation.mutateAsync(q); return res.map(r => ({ id: r.id, text: r.text, value: r.code })) }}
                  />

                  <NavigationButtons
                    onNext={handleNext}
                    onBack={goBack}
                    isFirst={isFirst}
                    isLast={isLast}
                    isSubmitting={isSaving}
                    canGoNext={true}
                  />
                </div>
              )}

              {session.status === 'in_progress' && !currentQuestion && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No more questions</p>
                  <Button onClick={() => setPhase('review')} className="mt-4 min-h-[44px]">
                    Review & Submit
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="w-full lg:w-72 order-1 lg:order-2 space-y-4">
            <Card className="space-y-4">
              <ProgressBar
                current={progress?.answered_questions ?? 0}
                total={totalQuestions}
                percentage={pct}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Auto-save</span>
                <AutoSaveIndicator status={saveStatus === 'saving' ? 'saving' : saveStatus === 'error' ? 'error' : 'saved'} />
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s</span>
              </div>
            </Card>

            {session.status === 'in_progress' && (
              <Button
                variant="ghost"
                onClick={handlePause}
                className="w-full min-h-[44px] text-sm"
              >
                Pause
              </Button>
            )}

            {localError && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs text-red-600 dark:text-red-400">{localError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default QuestionnaireSessionPage
