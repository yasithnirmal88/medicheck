import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import Card from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import Skeleton from '@/shared/ui/Skeleton'
import { useTemplates, useStartSession, useSessions } from '../hooks/useQuestionnaire'
import type { QuestionnaireTemplate } from '../types'

const TemplateCard: React.FC<{ template: QuestionnaireTemplate; onStart: (id: string) => void }> = ({
  template,
  onStart,
}) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{template.name}</h3>
          {template.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{template.description}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {template.estimated_time_minutes && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {template.estimated_time_minutes} min
          </span>
        )}
        {template.target_audience && (
          <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded text-xs">
            {template.target_audience}
          </span>
        )}
      </div>
      <div className="mt-auto">
        <Button onClick={() => onStart(template.id)} className="w-full min-h-[44px]">
          Start Assessment
        </Button>
      </div>
    </Card>
  )
}

const QuestionnaireListPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: templates, isLoading, error } = useTemplates()
  const { data: sessions } = useSessions()
  const startSession = useStartSession()

  const handleStart = (templateId: string) => {
    startSession.mutate(templateId, {
      onSuccess: (session) => {
        navigate(`/questionnaires/${session.id}`)
      },
    })
  }

  const inProgressSession = sessions?.find(
    (s) => s.status === 'in_progress' || s.status === 'paused'
  )

  const handleContinue = (sessionId: string) => {
    navigate(`/questionnaires/${sessionId}`)
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Assessments</h1>
            <p className="text-sm text-gray-500">Select an assessment to begin</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/questionnaires/history')} className="min-h-[44px]">
            View History
          </Button>
        </div>

        {inProgressSession && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  You have an assessment in progress
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Resume where you left off
                </p>
              </div>
              <Button
                onClick={() => handleContinue(inProgressSession.id)}
                className="min-h-[44px]"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-24 mb-3" />
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">Failed to load assessments</p>
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {templates && templates.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No assessments available at this time</p>
          </div>
        )}

        {templates && templates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} onStart={handleStart} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default QuestionnaireListPage
