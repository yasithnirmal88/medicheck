import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle, ClipboardList } from 'lucide-react'
import AppLayout from '@/layouts/AppLayout'
import Card from '@/shared/ui/Card'
import Skeleton from '@/shared/ui/Skeleton'
import { cn } from '@/lib/utils'
import Button from '@/shared/ui/Button'
import QuestionnaireHeader from '../components/QuestionnaireHeader'
import NavigationButtons from '../components/NavigationButtons'
import AutoSaveIndicator from '../components/AutoSaveIndicator'
import QuestionnaireComplete from '../components/QuestionnaireComplete'
import ReviewScreen from '../components/ReviewScreen'
import QuestionnaireAIAssistant from '../components/ai/QuestionnaireAIAssistant'
import { useQuestionnaireSession } from '../hooks/useQuestionnaireSession'
import {
  useCompleteSession,
  usePauseSession,
  useResumeSession,
  useSearchQuestions,
} from '../hooks/useQuestionnaire'

type Phase = 'question' | 'review' | 'complete'

const bodySystemLookup: Record<string, string> = {
  cardiovascular: 'Cardiovascular',
  neurological: 'Neurological',
  respiratory: 'Respiratory',
  endocrine: 'Endocrine',
  renal: 'Renal',
  gastrointestinal: 'Digestive',
  musculoskeletal: 'Musculoskeletal',
  dermatological: 'Dermatological',
  ophthalmological: 'Ophthalmological',
  otorhinolaryngological: 'ENT',
  psychiatric: 'Neurological',
  general: 'General',
}

const resolveBodySystem = (question: { body_system_id?: string | null; body_system?: string | null }): string | null => {
  if (question.body_system) return question.body_system
  if (question.body_system_id) return bodySystemLookup[question.body_system_id.toLowerCase()] ?? question.body_system_id
  return null
}

const QuestionnaireSessionPage: React.FC = () => {
  const { id: sessionId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<Phase>('question')
  const [localError, setLocalError] = useState<string | undefined>()
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, unknown>>({})

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
      setLocalError('An error occurred loading the session. Please try again.')
    } else {
      setLocalError(undefined)
    }
  }, [error])

  const handleAnswerChange = useCallback(
    (value: unknown) => {
      if (!currentQuestion) return
      setLocalError(undefined)
      saveAnswer(currentQuestion.id, { value })
    },
    [currentQuestion, saveAnswer],
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
    [goToQuestion],
  )

  const handlePause = useCallback(() => {
    if (sessionId) pauseMutation.mutate(sessionId)
  }, [sessionId, pauseMutation])

  const handleResume = useCallback(() => {
    if (sessionId) resumeMutation.mutate(sessionId)
  }, [sessionId, resumeMutation])

  const handleSaveDraft = useCallback(() => {
    if (currentQuestion && answers[currentQuestion.id]) {
      saveAnswer(currentQuestion.id, answers[currentQuestion.id])
    }
  }, [currentQuestion, answers, saveAnswer])

  const handleExit = useCallback(() => {
    if (window.confirm('Exit the assessment? Progress is saved automatically.')) {
      navigate('/questionnaires')
    }
  }, [navigate])

  const handleReturnToDashboard = () => navigate('/')
  const handleBackToAssessments = () => navigate('/questionnaires')

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-5xl p-4">
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <div className="mt-4 space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!session) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl p-4 text-center">
          <div className="mb-6 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <AlertCircle className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-gray-500">Session not found</p>
          <Button onClick={handleBackToAssessments} className="mt-4 min-h-[44px]">
            Back to Assessments
          </Button>
        </div>
      </AppLayout>
    )
  }

  if (phase === 'complete') {
    return (
      <AppLayout>
        <div className="mx-auto max-w-3xl p-4">
          <QuestionnaireComplete session={session} score={null} onReturnToDashboard={handleReturnToDashboard} />
        </div>
      </AppLayout>
    )
  }

  if (phase === 'review') {
    return (
      <AppLayout>
        <div className="mx-auto max-w-3xl p-4">
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

  const bodySystemName = currentQuestion ? resolveBodySystem(currentQuestion) : null

  // Paused state still renders the header so users can resume.
  const isPaused = session.status === 'paused'

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl p-4">
        {/* Main content + AI Assistant side panel */}
        <div className="flex flex-col-reverse gap-6 xl:flex-row xl:items-start">
          {/* Main column */}
          <div className="flex-1 space-y-6">
            {/* Header: progress, q# body system, time, save, exit */}
            <QuestionnaireHeader
              session={session}
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              answered={progress?.answered_questions ?? 0}
              elapsedTime={elapsedTime}
              saveStatus={saveStatus}
              isSaving={isSaving}
              bodySystemName={bodySystemName}
              onPause={handlePause}
              onExit={handleExit}
              onSaveDraft={handleSaveDraft}
            />

            {/* Question card */}
            <Card className={cn('min-h-[220px]', isPaused && 'opacity-60')}>
              {isPaused && (
                <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center dark:border-yellow-900/50 dark:bg-yellow-900/20">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    This assessment is paused.
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Your progress is saved. Click Resume to continue.
                  </p>
                </div>
              )}

              {currentQuestion ? (
                <QuestionPlaceholder question={currentQuestion} />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                    <ClipboardList className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="text-gray-500 dark:text-gray-300">No question available</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Connect a question source to begin answering.
                  </p>
                </div>
              )}
            </Card>

            {/* Navigation: Previous / Next + Resume */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={isFirst || isSaving}
                className="min-h-[44px]"
              >
                Previous
              </Button>

              {isPaused ? (
                <Button onClick={handleResume} disabled={resumeMutation.isPending} className="min-h-[44px]">
                  Resume
                </Button>
              ) : isLast ? (
                <Button onClick={() => {
                  setReviewAnswers({ ...answers })
                  setPhase('review')
                }} disabled={isSaving} className="min-h-[44px]">
                  Review & Submit
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={isSaving} className="min-h-[44px]">
                  Next
                </Button>
              )}
            </div>

            {localError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                <AlertCircle className="mt-0.25 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{localError}</span>
              </div>
            )}
          </div>

          {/* AI Assistant panel */}
          <div className="w-full max-w-sm xl:w-80">
            <QuestionnaireAIAssistant />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

const QuestionPlaceholder: React.FC<{ question: { id: string; text: string; description?: string | null } }> = ({
  question,
}) => (
  <div className="space-y-4">
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40">
        <ClipboardList className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Section: Medical History</p>
        <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{question.text}</h3>
        {question.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{question.description}</p>
        )}
      </div>
    </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" className="min-h-[36px]">
          Yes
        </Button>
        <Button variant="ghost" className="min-h-[36px]">
          No
        </Button>
      </div>

    <p className="text-xs text-gray-400 dark:text-gray-500">
      Question source is not yet configured — this is a placeholder for the live question renderer.
    </p>
  </div>
)

export default QuestionnaireSessionPage
