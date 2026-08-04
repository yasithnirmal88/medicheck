import api from '@/lib/api'
import type {
  QuestionnaireTemplate,
  AssessmentSession,
  AnswerResponse,
  SaveAnswerRequest,
  SessionProgress,
  Question,
  QuestionFilters,
} from '../types'

/**
 * Normalize a raw backend session payload into the shape the UI expects.
 * The backend uses `session_id`, an `active` status and keeps timestamps /
 * template linkage on the entity but not always on every response DTO, so we
 * reconcile those here at the integration boundary (API → domain).
 */
const normalizeSession = (raw: Record<string, any>): AssessmentSession => {
  const rawStatus = String(raw.status ?? '') as string
  const status: AssessmentSession['status'] =
    rawStatus === 'active' || rawStatus === 'draft' ? 'in_progress' : (raw.status as AssessmentSession['status'] ?? 'in_progress')
  const now = new Date().toISOString()
  return {
    id: raw.id ?? raw.session_id ?? '',
    status,
    current_question: raw.current_question ?? null,
    progress: raw.progress
      ? ({ ...raw.progress } as SessionProgress)
      : {
          current_section: null,
          completed_questions: 0,
          total_questions: 0,
          answered_questions: 0,
          skipped_questions: 0,
          completion_percentage: 0,
          estimated_time_remaining: null,
        },
    questionnaire_template_id: raw.questionnaire_template_id ?? null,
    created_at: raw.created_at ?? now,
    updated_at: raw.updated_at ?? now,
  }
}

export const fetchTemplates = async (): Promise<QuestionnaireTemplate[]> => {
  const resp = await api.get('/questionnaires')
  return resp.data
}

export const fetchTemplate = async (id: string): Promise<QuestionnaireTemplate> => {
  const resp = await api.get(`/questionnaires/${id}`)
  return resp.data
}

export const startSession = async (templateId: string): Promise<AssessmentSession> => {
  const resp = await api.post(`/questionnaires/${templateId}/start`)
  return normalizeSession({ ...resp.data, questionnaire_template_id: templateId })
}

export const fetchSession = async (sessionId: string): Promise<AssessmentSession> => {
  const resp = await api.get(`/questionnaires/sessions/${sessionId}`)
  return normalizeSession(resp.data)
}

export const saveAnswer = async (
  sessionId: string,
  data: SaveAnswerRequest
): Promise<AnswerResponse> => {
  const resp = await api.post(`/questionnaires/sessions/${sessionId}/answer`, data)
  return resp.data
}

export const pauseSession = async (sessionId: string): Promise<AssessmentSession> => {
  const resp = await api.post(`/questionnaires/sessions/${sessionId}/pause`)
  return resp.data
}

export const resumeSession = async (sessionId: string): Promise<AssessmentSession> => {
  const resp = await api.post(`/questionnaires/sessions/${sessionId}/resume`)
  return resp.data
}

export const completeSession = async (sessionId: string): Promise<AssessmentSession> => {
  const resp = await api.post(`/questionnaires/sessions/${sessionId}/complete`)
  return resp.data
}

export const fetchProgress = async (sessionId: string): Promise<SessionProgress> => {
  const resp = await api.get(`/questionnaires/sessions/${sessionId}/progress`)
  return resp.data
}

export const fetchSessions = async (): Promise<AssessmentSession[]> => {
  const resp = await api.get('/questionnaires/sessions')
  return resp.data.map(normalizeSession)
}

export const fetchQuestions = async (params?: QuestionFilters): Promise<Question[]> => {
  const resp = await api.get('/questions', { params })
  return resp.data
}

export const searchQuestions = async (query: string): Promise<Question[]> => {
  const resp = await api.get('/questions/search', { params: { q: query } })
  return resp.data
}
