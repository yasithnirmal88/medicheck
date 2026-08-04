// ─── Lab Value Status ─────────────────────────────────────────────────────────
export type LabValueStatus = 'normal' | 'borderline' | 'high' | 'low' | 'critical'

// ─── Lab Category ─────────────────────────────────────────────────────────────
export type LabCategory =
  | 'cbc'
  | 'blood_chemistry'
  | 'liver'
  | 'kidney'
  | 'cardiac'
  | 'lipid'
  | 'endocrine'
  | 'hormones'
  | 'diabetes'
  | 'urinalysis'
  | 'inflammation'
  | 'vitamins'
  | 'minerals'
  | 'thyroid'
  | 'immunology'
  | 'coagulation'
  | 'tumor_markers'

export const LAB_CATEGORY_LABELS: Record<LabCategory, string> = {
  cbc: 'Complete Blood Count',
  blood_chemistry: 'Blood Chemistry',
  liver: 'Liver Function',
  kidney: 'Kidney Function',
  cardiac: 'Cardiac Markers',
  lipid: 'Lipid Profile',
  endocrine: 'Endocrine',
  hormones: 'Hormones',
  diabetes: 'Diabetes',
  urinalysis: 'Urinalysis',
  inflammation: 'Inflammation',
  vitamins: 'Vitamin Levels',
  minerals: 'Minerals',
  thyroid: 'Thyroid',
  immunology: 'Immunology',
  coagulation: 'Coagulation',
  tumor_markers: 'Tumor Markers',
}

// ─── Trend Direction ──────────────────────────────────────────────────────────
export type TrendDirection = 'improving' | 'stable' | 'worsening' | 'new'

// ─── Report Status ────────────────────────────────────────────────────────────
export type ReportStatus = 'completed' | 'pending_review' | 'processing' | 'failed'

// ─── Severity ─────────────────────────────────────────────────────────────────
export type Severity = 'info' | 'warning' | 'critical'

// ─── Lab Test Result ──────────────────────────────────────────────────────────
export interface LabTestResult {
  id: string
  name: string
  category: LabCategory
  value: number | string
  unit: string
  referenceRange: string
  referenceLow: number
  referenceHigh: number
  status: LabValueStatus
  trend: TrendDirection
  previousValue?: number
  previousDate?: string
  interpretation?: string
  description?: string
  purpose?: string
  whyItMatters?: string
  clinicalInterpretation?: string
  possibleCauses?: string[]
  associatedDiseases?: string[]
  lifestyleFactors?: string[]
  relatedSymptoms?: string[]
  recommendations?: string[]
  medicalReferences?: string[]
  knowledgeGraphLinks?: string[]
  trendData?: TrendDataPoint[]
}

// ─── Trend Data Point ─────────────────────────────────────────────────────────
export interface TrendDataPoint {
  date: string
  value: number
  referenceLow?: number
  referenceHigh?: number
}

// ─── Laboratory Report ────────────────────────────────────────────────────────
export interface LaboratoryReport {
  id: string
  laboratoryName: string
  reportDate: string
  collectionDate: string
  reportType: string
  doctor: string
  status: ReportStatus
  tests: LabTestResult[]
  abnormalCount: number
  criticalCount: number
  aiInterpretationAvailable: boolean
  attachments?: LabAttachment[]
  notes?: string
}

// ─── Lab Attachment ───────────────────────────────────────────────────────────
export interface LabAttachment {
  id: string
  name: string
  type: 'pdf' | 'image' | 'document'
  url: string
  size: string
  uploadedAt: string
}

// ─── AI Interpretation ────────────────────────────────────────────────────────
export interface AIInterpretation {
  summary: string
  healthRisks: string[]
  positiveFindings: string[]
  areasRequiringAttention: string[]
  confidenceScore: number
  evidenceCount: number
  generatedDate: string
  bodySystemContributions: BodySystemContribution[]
}

export interface BodySystemContribution {
  system: string
  impact: number
  confidence: number
  contributingTests: string[]
}

// ─── Health Impact ────────────────────────────────────────────────────────────
export interface HealthImpactArea {
  id: string
  area: string
  icon: string
  impactLevel: 'high' | 'medium' | 'low'
  confidence: number
  contributingTests: string[]
  description: string
}

// ─── Critical Finding ─────────────────────────────────────────────────────────
export interface CriticalFinding {
  id: string
  testName: string
  value: number | string
  unit: string
  severity: Severity
  clinicalMeaning: string
  recommendedAction: string
  urgency: 'immediate' | 'within_24h' | 'within_week' | 'routine'
  doctorConsultationNeeded: boolean
  followUpTest?: string
}

// ─── Timeline Event ───────────────────────────────────────────────────────────
export interface LabTimelineEvent {
  id: string
  type: string
  title: string
  description: string
  date: string
  icon: string
  expandable?: boolean
  details?: string[]
}

// ─── Laboratory Recommendation ────────────────────────────────────────────────
export interface LabRecommendation {
  id: string
  title: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  evidence: string
  expectedBenefit: string
  category: string
}

// ─── Explainability Item ──────────────────────────────────────────────────────
export interface ExplainabilityItem {
  label: string
  value: string
}

// ─── Reference Information ────────────────────────────────────────────────────
export interface ReferenceInfo {
  testName: string
  purpose: string
  normalFunction: string
  referenceRange: string
  preparationInstructions: string[]
  causesOfHigh: string[]
  causesOfLow: string[]
  lifestyleEffects: string[]
}

// ─── Comparison Data ──────────────────────────────────────────────────────────
export interface ReportComparisonItem {
  testName: string
  currentValue: number | string
  previousValue: number | string
  unit: string
  difference: number | string
  trend: TrendDirection
  status: LabValueStatus
  clinicalMeaning: string
  isImprovement: boolean
}
