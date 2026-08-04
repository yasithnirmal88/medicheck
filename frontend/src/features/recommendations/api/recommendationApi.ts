import api from '@/lib/api'
import type { Recommendation, RecommendationStatus } from '../types'

export const fetchRecommendations = async (): Promise<Recommendation[]> => {
  const res = await api.get('/recommendations')
  return res.data
}

export const fetchRecommendation = async (id: string): Promise<Recommendation> => {
  const res = await api.get(`/recommendations/${id}`)
  return res.data
}

export const updateRecommendationStatus = async (
  id: string,
  status: RecommendationStatus,
): Promise<Recommendation> => {
  const res = await api.patch(`/recommendations/${id}`, { status })
  return res.data
}

export const fetchRecommendationsByReport = async (reportId: string): Promise<Recommendation[]> => {
  const res = await api.get(`/reports/${reportId}/recommendations`)
  return res.data
}

export const fetchRecommendationsByAssessment = async (assessmentId: string): Promise<Recommendation[]> => {
  const res = await api.get(`/assessments/${assessmentId}/recommendations`)
  return res.data
}
