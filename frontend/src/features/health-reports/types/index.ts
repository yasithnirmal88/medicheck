export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high' | 'critical'
export type Trend = 'improving' | 'declining' | 'stable'
export type Severity = 'low' | 'moderate' | 'high'
export type ConfidenceTier = 'low' | 'moderate' | 'high'
export type ReportStatus = 'draft' | 'final' | 'reviewed' | 'preliminary'

export interface BodySystemScore {
  id: string
  name: string
  icon: string
  score: number
  riskLevel: RiskLevel
  trend: Trend
  aiConfidence: number
  symptomsFound: string[]
  positiveIndicators: string[]
  negativeIndicators: string[]
  coveragePct: number
  colorHex?: string
}

export interface PossibleCondition {
  id: string
  name: string
  probability: number
  confidence: number
  severity: Severity
  evidenceCount: number
  status: 'active' | 'resolved' | 'monitoring'
  doctorReviewed: boolean
  clinicalExplanation: string
  supportingSymptoms: string[]
  questionnaireEvidence: EvidenceItem[]
  labEvidence: EvidenceItem[]
  lifestyleEvidence: EvidenceItem[]
  protectiveFactors: string[]
  confidenceBreakdown: ConfidenceFactor[]
  recommendedTests: string[]
  educationalInfo: string
}

export interface EvidenceItem {
  label: string
  value: string
  source: 'questionnaire' | 'lab' | 'lifestyle' | 'measurement' | 'profile'
  weight: number
}

export interface ConfidenceFactor {
  name: string
  weight: number
  reason: string
}

export interface RiskMatrixCell {
  category: string
  icon: string
  risk: RiskLevel
  trend: Trend
  confidence: number
}

export interface LifestyleMetric {
  id: string
  name: string
  icon: string
  status: string
  score: number
  riskContribution: RiskLevel
  suggestions: string[]
}

export interface LabResult {
  id: string
  name: string
  value: string
  unit: string
  range: string
  status: 'normal' | 'abnormal' | 'critical'
  trend: Trend
  interpretation: string
  possibleCauses: string[]
  associatedDiseases: string[]
  followUp: string
}

export interface TimelineEvent {
  id: string
  type: 'questionnaire' | 'measurement' | 'lab' | 'event' | 'report' | 'doctor' | 'recommendation'
  title: string
  subtitle?: string
  date: string
  icon: string
  iconBg: string
}

export interface Recommendation {
  id: string
  category: 'immediate' | 'month' | 'six' | 'longterm'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  reason: string
  expectedBenefit: string
  riskReduction: string
  evidence: EvidenceItem[]
  actionLabel: string
}

export interface HealthReport {
  id: string
  title: string
  generatedDate: string
  version: string
  assessmentVersion: string
  overallScore: number
  previousScore?: number
  aiConfidence: number
  doctorReview: 'pending' | 'reviewed' | 'not_required'
  healthAge: number
  biologicalAge: number
  riskTrend: Trend
  status: ReportStatus
}
