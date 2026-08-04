export type TimelineEventType =
  | 'profile_updated'
  | 'questionnaire_started'
  | 'questionnaire_completed'
  | 'assessment_started'
  | 'assessment_completed'
  | 'health_report_generated'
  | 'laboratory_uploaded'
  | 'laboratory_updated'
  | 'medication_added'
  | 'medication_changed'
  | 'vaccination_recorded'
  | 'doctor_review'
  | 'lifestyle_goal_created'
  | 'lifestyle_goal_completed'
  | 'exercise_milestone'
  | 'weight_updated'
  | 'blood_pressure_updated'
  | 'blood_sugar_updated'
  | 'hospital_visit'
  | 'medical_procedure'
  | 'emergency_event'
  | 'followup_reminder'
  | 'ai_recommendation'
  | 'risk_level_changed'
  | 'health_score_improved'
  | 'health_score_declined'
  | 'future_appointment'

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical'

export type EventStatus =
  | 'completed'
  | 'in_progress'
  | 'scheduled'
  | 'pending'
  | 'overdue'
  | 'reviewed'
  | 'cancelled'

export type Importance = 'routine' | 'important' | 'critical'

export type BodySystemName =
  | 'heart'
  | 'kidneys'
  | 'liver'
  | 'lungs'
  | 'brain'
  | 'mental_health'
  | 'nutrition'
  | 'sleep'
  | 'exercise'
  | 'digestive'
  | 'eyes'
  | 'bones'
  | 'immune'
  | 'general'
  | 'lifestyle'

export type SourceModule =
  | 'profile'
  | 'assessment'
  | 'laboratory'
  | 'medication'
  | 'vaccination'
  | 'doctor'
  | 'lifestyle'
  | 'hospital'
  | 'ai'
  | 'wearable'
  | 'manual'

export interface LabResult {
  test: string
  result: string
  unit?: string
  reference?: string
  status: 'normal' | 'elevated' | 'low' | 'borderline' | 'critical'
  trend?: 'up' | 'down' | 'flat'
  date?: string
}

export interface TimelineAttachment {
  id: string
  name: string
  kind: 'pdf' | 'image' | 'report' | 'note' | 'scan'
  meta?: string
  size?: string
}

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  date: string
  time: string
  status: EventStatus
  importance: Importance
  severity?: EventSeverity
  bodySystem: BodySystemName
  source: SourceModule
  aiGenerated?: boolean
  doctorReviewed?: boolean
  manualEntry?: boolean
  healthScore?: number
  detail?: {
    summary: string
    information: string[]
    relatedAssessment?: string
    relatedReport?: string
    laboratoryResults?: LabResult[]
    aiExplanation?: string
    clinicalNotes?: string
    recommendations?: string[]
    evidence?: string[]
    attachments?: TimelineAttachment[]
  }
}

export interface KpiMetric {
  key: string
  label: string
  value: number
  suffix?: string
  prefix?: string
  icon: 'events' | 'assessments' | 'reports' | 'lab' | 'doctor' | 'score' | 'ai' | 'followup'
  trend?: 'up' | 'down' | 'flat'
  trendLabel?: string
  tone: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
}

export interface TimelineFilters {
  query: string
  dateRange: 'all' | '30' | '90' | '365'
  eventType: TimelineEventType | 'all'
  bodySystem: BodySystemName | 'all'
  severity: EventSeverity | 'all'
  source: SourceModule | 'all'
  doctorReviewed: boolean
  aiGenerated: boolean
  manualEntry: boolean
}

export interface JourneyStage {
  key: string
  label: string
  description: string
  state: 'done' | 'current' | 'upcoming'
}

export interface ScoreRange {
  key: '7d' | '30d' | '90d' | '1y' | 'all'
  label: string
}

export interface ScorePoint {
  label: string
  date: string
  overall: number
  risk: number
  confidence: number
  completion: number
  heart?: number
  kidneys?: number
  liver?: number
  lungs?: number
  mental?: number
}

export interface BodySystemSummary {
  id: BodySystemName
  label: string
  status: 'optimal' | 'good' | 'monitor' | 'attention' | 'critical'
  score: number
  trend: 'up' | 'down' | 'flat'
  events: number
}

export interface LaboratoryTest {
  id: string
  testName: string
  category: string
  date: string
  result: string
  unit?: string
  referenceRange: string
  status: 'normal' | 'elevated' | 'low' | 'borderline' | 'critical'
  trend: 'up' | 'down' | 'flat'
  interpretation: string
  previousResults: { date: string; result: string }[]
  clinicalMeaning: string
  aiCommentary: string
  recommendations: string[]
}

export interface MedicationEntry {
  id: string
  name: string
  action: 'started' | 'dose_changed' | 'stopped'
  dose?: string
  reason: string
  doctor: string
  startedAt: string
  duration?: string
  status: 'active' | 'discontinued'
}

export interface AiInsight {
  id: string
  title: string
  text: string
  confidence: number
  evidence: string[]
  relatedReports: string[]
  tone: 'positive' | 'warning' | 'info'
  date: string
}

export interface RecommendationStatus {
  id: string
  title: string
  category: 'nutrition' | 'exercise' | 'medical' | 'lifestyle'
  created: string
  status: 'created' | 'accepted' | 'completed' | 'ignored' | 'expired'
  completedAt?: string
}

export interface HealthMilestone {
  id: string
  title: string
  description: string
  date: string
  badge: 'first_assessment' | 'weight' | 'bp' | 'smoking' | 'exercise' | 'score' | 'bmi'
}

export interface UpcomingEvent {
  id: string
  title: string
  type: 'assessment' | 'medication' | 'vaccination' | 'appointment' | 'laboratory' | 'lifestyle' | 'followup'
  dueDate: string
  window: string
  priority: 'low' | 'medium' | 'high'
  description: string
}

export interface ComparisonData {
  periodA: string
  periodB: string
  healthScore: { before: number; after: number; change: number }
  bodySystems: { id: BodySystemName; label: string; before: number; after: number }[]
  riskLevels: { label: string; before: string; after: string; improved: boolean }[]
  laboratoryChanges: { test: string; before: string; after: string; status: 'improved' | 'worsened' | 'stable' }[]
  lifestyleChanges: string[]
  recommendations: { label: string; completed: boolean }[]
  improvements: string[]
}

export type TrendDirection = 'up' | 'down' | 'flat'
