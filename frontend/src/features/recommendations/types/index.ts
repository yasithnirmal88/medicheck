export type RecommendationPriority = 'urgent' | 'high' | 'medium' | 'low' | 'preventive'

export type RecommendationCategory = 'immediate' | 'month' | 'six' | 'longterm'

export type RecommendationStatus = 'pending' | 'in_progress' | 'completed' | 'dismissed' | 'deferred'

export interface RecommendationEvidence {
  label: string
  value: string
  source: 'questionnaire' | 'lab' | 'lifestyle' | 'measurement' | 'profile'
  weight: number
}

export interface Recommendation {
  id: string
  title: string
  category: RecommendationCategory
  priority: RecommendationPriority
  status: RecommendationStatus
  reason: string
  expectedBenefit: string
  riskReduction: string
  evidence: RecommendationEvidence[]
  actionLabel: string
  reportId?: string
  reportTitle?: string
  assessmentId?: string
  assessmentTitle?: string
  bodySystem?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}
