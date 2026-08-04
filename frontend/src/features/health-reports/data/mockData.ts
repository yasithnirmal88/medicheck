import type {
  BodySystemScore,
  PossibleCondition,
  RiskMatrixCell,
  LifestyleMetric,
  LabResult,
  TimelineEvent,
  Recommendation,
  HealthReport,
  ConfidenceFactor,
  EvidenceItem,
} from '../types'
import { bodySystems } from './bodySystems'

export const currentReport: HealthReport = {
  id: 'report-2026-0712',
  title: 'Comprehensive Health Report',
  generatedDate: '2026-07-12T10:24:00Z',
  version: 'v3.2.1',
  assessmentVersion: '2.4',
  overallScore: 86,
  previousScore: 81,
  aiConfidence: 92,
  doctorReview: 'reviewed',
  healthAge: 38,
  biologicalAge: 42,
  riskTrend: 'improving',
  status: 'final',
}

export const executiveSummary =
  'Based on your completed health profile, laboratory values, lifestyle information, and adaptive assessment responses, your cardiovascular health is excellent while kidney health requires closer monitoring due to elevated risk indicators. Your metabolic markers show steady improvement, and your overall biological age (42) is below your chronological age (38), reflecting positive lifestyle changes. The AI recommends a focused kidney function follow-up within 6 months.'

export const bodySystemScores: BodySystemScore[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    icon: 'heart-pulse',
    score: 94,
    riskLevel: 'low',
    trend: 'improving',
    aiConfidence: 95,
    symptomsFound: [],
    positiveIndicators: ['Normal resting heart rate', 'No chest discomfort', 'Controlled blood pressure'],
    negativeIndicators: ['Slightly elevated LDL'],
    coveragePct: 92,
    colorHex: '#ef4444',
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: 'wind',
    score: 88,
    riskLevel: 'low',
    trend: 'stable',
    aiConfidence: 89,
    symptomsFound: ['Occasional mild breathlessness on exertion'],
    positiveIndicators: ['No smoking history', 'No chronic cough', 'Normal spirometry'],
    negativeIndicators: ['Moderate exposure to urban pollution'],
    coveragePct: 80,
    colorHex: '#3b82f6',
  },
  {
    id: 'neurology',
    name: 'Neurological',
    icon: 'brain',
    score: 90,
    riskLevel: 'low',
    trend: 'improving',
    aiConfidence: 85,
    symptomsFound: [],
    positiveIndicators: ['No headaches', 'Good sleep quality', 'Sharp memory'],
    negativeIndicators: ['High work-related stress'],
    coveragePct: 78,
    colorHex: '#a855f7',
  },
  {
    id: 'kidneys',
    name: 'Kidneys',
    icon: 'kidney',
    score: 68,
    riskLevel: 'elevated',
    trend: 'declining',
    aiConfidence: 82,
    symptomsFound: ['Mild fatigue in the mornings'],
    positiveIndicators: ['Normal creatinine (last check)', 'Adequate hydration'],
    negativeIndicators: ['Family history of kidney disease', 'Occasional high sodium intake'],
    coveragePct: 70,
    colorHex: '#14b8a8',
  },
  {
    id: 'liver',
    name: 'Liver',
    icon: 'liver',
    score: 81,
    riskLevel: 'moderate',
    trend: 'stable',
    aiConfidence: 78,
    symptomsFound: [],
    positiveIndicators: ['Normal ALT/AST', 'No alcohol use'],
    negativeIndicators: ['Mild fatty liver noted in prior scan'],
    coveragePct: 75,
    colorHex: '#eab308',
  },
  {
    id: 'digestive',
    name: 'Digestive',
    icon: 'heart-hand',
    score: 85,
    riskLevel: 'low',
    trend: 'improving',
    aiConfidence: 80,
    symptomsFound: ['Occasional heartburn after spicy meals'],
    positiveIndicators: ['High fiber intake', 'Regular meals', 'No chronic abdominal pain'],
    negativeIndicators: ['Frequent spicy food consumption'],
    coveragePct: 82,
    colorHex: '#84cc16',
  },
  {
    id: 'endocrine',
    name: 'Endocrine',
    icon: 'activity',
    score: 83,
    riskLevel: 'low',
    trend: 'improving',
    aiConfidence: 88,
    symptomsFound: [],
    positiveIndicators: ['Normal fasting glucose', 'Stable HbA1c'],
    negativeIndicators: ['Borderline HbA1c (5.9%)'],
    coveragePct: 88,
    colorHex: '#a855f7',
  },
  {
    id: 'mental',
    name: 'Mental Health',
    icon: 'brain-circuit',
    score: 77,
    riskLevel: 'moderate',
    trend: 'declining',
    aiConfidence: 84,
    symptomsFound: ['Moderate work stress', 'Occasional sleep latency'],
    positiveIndicators: ['Strong social support', 'Regular exercise habit'],
    negativeIndicators: ['High workload stress', 'Screen time late at night'],
    coveragePct: 72,
    colorHex: '#8b5cf6',
  },
]

const evidence = (s: EvidenceItem): EvidenceItem => s

export const possibleConditions: PossibleCondition[] = [
  {
    id: 'ckd-stage1',
    name: 'Chronic Kidney Disease (Stage 1)',
    probability: 18,
    confidence: 82,
    severity: 'moderate',
    evidenceCount: 14,
    status: 'monitoring',
    doctorReviewed: false,
    clinicalExplanation:
      'Early-stage chronic kidney disease inferred from a family history of kidney disease combined with mild fatigue and a slightly elevated albumin-to-creatinine ratio documented in your last laboratory report.',
    supportingSymptoms: ['Mild fatigue in the mornings'],
    questionnaireEvidence: [
      evidence({ label: 'Family history of kidney disease', value: 'Yes', source: 'profile', weight: 0.4 }),
    ],
    labEvidence: [
      evidence({ label: 'eGFR', value: '88 mL/min/1.73m²', source: 'lab', weight: 0.35 }),
    ],
    lifestyleEvidence: [
      evidence({ label: 'High sodium intake', value: 'Often', source: 'lifestyle', weight: 0.1 }),
    ],
    protectiveFactors: ['No diabetes', 'No hypertension', 'Adequate hydration'],
    confidenceBreakdown: [
      { name: 'Profile data', weight: 0.4, reason: 'Strong family-history signal' },
      { name: 'Laboratory values', weight: 0.35, reason: 'eGFR borderline-low' },
      { name: 'Lifestyle', weight: 0.1, reason: 'Sodium intake increases risk' },
      { name: 'Questionnaire responses', weight: 0.15, reason: 'Fatigue reported' },
    ],
    recommendedTests: ['Serum creatinine', 'Urinalysis', 'eGFR', 'Urine albumin-to-creatinine ratio'],
    educationalInfo:
      'Stage 1 CKD requires normal or high measured GFR (≥90) with kidney damage. Monitoring kidney function annually is recommended.',
  },
  {
    id: 'hyperlipidemia',
    name: 'Hyperlipidemia (early)',
    probability: 14,
    confidence: 90,
    severity: 'moderate',
    evidenceCount: 11,
    status: 'monitoring',
    doctorReviewed: false,
    clinicalExplanation:
      'Elevated LDL cholesterol relative to HDL, combined with a family history of cardiovascular disease, suggests early dyslipidemia requiring lifestyle intervention.',
    supportingSymptoms: [],
    questionnaireEvidence: [
      evidence({ label: 'Family history of heart disease', value: 'Yes', source: 'profile', weight: 0.3 }),
    ],
    labEvidence: [
      evidence({ label: 'LDL cholesterol', value: '138 mg/dL', source: 'lab', weight: 0.45 }),
      evidence({ label: 'HDL cholesterol', value: '42 mg/dL', source: 'lab', weight: 0.25 }),
    ],
    lifestyleEvidence: [
      evidence({ label: 'Saturated fat intake', value: 'Moderate', source: 'lifestyle', weight: 0.15 }),
    ],
    protectiveFactors: ['Regular exercise', 'No smoking', 'No diabetes'],
    confidenceBreakdown: [
      { name: 'Laboratory values', weight: 0.6, reason: 'LDL above target' },
      { name: 'Profile data', weight: 0.3, reason: 'Family history' },
      { name: 'Lifestyle', weight: 0.1, reason: 'Dietary fats' },
    ],
    recommendedTests: ['Fasting lipid panel', 'hs-CRP'],
    educationalInfo:
      'LDL above 130 mg/dL is considered borderline high. Dietary modification and exercise can improve lipid profiles significantly.',
  },
]

export const riskMatrix: RiskMatrixCell[] = [
  { category: 'Heart', icon: 'heart', risk: 'low', trend: 'improving', confidence: 95 },
  { category: 'Kidneys', icon: 'kidney', risk: 'elevated', trend: 'declining', confidence: 82 },
  { category: 'Liver', icon: 'liver', risk: 'moderate', trend: 'stable', confidence: 78 },
  { category: 'Diabetes', icon: 'activity', risk: 'low', trend: 'improving', confidence: 84 },
  { category: 'Cancer', icon: 'scan', risk: 'low', trend: 'stable', confidence: 65 },
  { category: 'Stroke', icon: 'brain', risk: 'low', trend: 'improving', confidence: 70 },
  { category: 'Respiratory', icon: 'wind', risk: 'low', trend: 'stable', confidence: 89 },
  { category: 'Mental Health', icon: 'brain-circuit', risk: 'moderate', trend: 'declining', confidence: 84 },
  { category: 'Nutrition', icon: 'apple', risk: 'moderate', trend: 'improving', confidence: 80 },
]

export const lifestyleMetrics: LifestyleMetric[] = [
  { id: 'nutrition', name: 'Nutrition', icon: 'apple', status: 'Good — balanced diet, high fiber', score: 82, riskContribution: 'moderate', suggestions: ['Add more omega-3', 'Reduce processed carbs'] },
  { id: 'exercise', name: 'Exercise', icon: 'dumbbell', status: 'Excellent — 150 min/week', score: 94, riskContribution: 'low', suggestions: ['Maintain routine'] },
  { id: 'sleep', name: 'Sleep', icon: 'moon', status: 'Fair — 6.5 hrs avg', score: 68, riskContribution: 'moderate', suggestions: ['Aim for 7-8 hrs', 'Avoid screens before bed'] },
  { id: 'stress', name: 'Stress', icon: 'brain', status: 'Moderate — work-related', score: 54, riskContribution: 'high', suggestions: ['Try meditation', 'Set work boundaries'] },
  { id: 'smoking', name: 'Smoking', icon: 'smoke', status: 'Never', score: 100, riskContribution: 'low', suggestions: ['Maintain'] },
  { id: 'alcohol', name: 'Alcohol', icon: 'wine', status: 'Low — occasional', score: 88, riskContribution: 'low', suggestions: ['Keep within limits'] },
  { id: 'hydration', name: 'Hydration', icon: 'droplet', status: 'Good — 2.2L/day', score: 85, riskContribution: 'low', suggestions: ['Stay consistent'] },
  { id: 'bmi', name: 'BMI', icon: 'weight', status: '23.4 — Normal', score: 90, riskContribution: 'low', suggestions: ['Maintain'] },
  { id: 'waist', name: 'Waist-to-Height', icon: 'ruler', status: '0.47 — Optimal', score: 92, riskContribution: 'low', suggestions: ['Keep steady'] },
]

export const labResults: LabResult[] = [
  {
    id: 'creatinine',
    name: 'Serum Creatinine',
    value: '0.85',
    unit: 'mg/dL',
    range: '0.6–1.2',
    status: 'normal',
    trend: 'stable',
    interpretation: 'Within normal limits, consistent with prior values.',
    possibleCauses: [],
    associatedDiseases: ['CKD stage 1 (screening)'],
    followUp: 'Repeat annually or if eGFR declines.',
  },
  {
    id: 'ldl',
    name: 'LDL Cholesterol',
    value: '138',
    unit: 'mg/dL',
    range: '<100',
    status: 'abnormal',
    trend: 'declining',
    interpretation: 'Borderline high. Recommend dietary modification and exercise.',
    possibleCauses: ['Familial hypercholesterolemia', 'High saturated fat intake'],
    associatedDiseases: ['Hyperlipidemia', 'Cardiovascular disease'],
    followUp: 'Recheck in 3 months with diet/lifestyle changes.',
  },
  {
    id: 'glucose',
    name: 'Fasting Glucose',
    value: '94',
    unit: 'mg/dL',
    range: '70–99',
    status: 'normal',
    trend: 'improving',
    interpretation: 'Normal fasting glucose; improving trend.',
    possibleCauses: [],
    associatedDiseases: ['Prediabetes screening'],
    followUp: 'Maintain current lifestyle; recheck in 6 months.',
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    value: '5.9',
    unit: '%',
    range: '<5.7',
    status: 'abnormal',
    trend: 'stable',
    interpretation: 'Borderline elevated. Early sign of insulin resistance.',
    possibleCauses: ['Prediabetes', 'Metabolic syndrome'],
    associatedDiseases: ['Type 2 diabetes'],
    followUp: 'Dietary counseling and re-evaluation in 3 months.',
  },
]

export const timelineEventsData: TimelineEvent[] = [
  { id: 'e1', type: 'questionnaire', title: 'General Health Assessment completed', subtitle: 'Score 86', date: '2026-07-12', icon: 'clipboard-text', iconBg: 'bg-indigo-500' },
  { id: 'e2', type: 'questionnaire', title: 'Heart Health Assessment started', subtitle: '68% complete', date: '2026-07-05', icon: 'heart', iconBg: 'bg-rose-500' },
  { id: 'e3', type: 'lab', title: 'Laboratory Results Added', subtitle: 'CMP + Lipid Panel', date: '2026-06-22', icon: 'flask', iconBg: 'bg-amber-500' },
  { id: 'e4', type: 'measurement', title: 'Measurements updated', subtitle: 'Weight, BP, BMI', date: '2026-06-18', icon: 'weight', iconBg: 'bg-cyan-500' },
  { id: 'e5', type: 'report', title: 'AI Report Generated', subtitle: 'v3.2.1', date: '2026-05-30', icon: 'bot', iconBg: 'bg-purple-500' },
  { id: 'e6', type: 'recommendation', title: 'Recommendations Generated', subtitle: '3 new items', date: '2026-05-30', icon: 'lightbulb', iconBg: 'bg-fuchsia-500' },
  { id: 'e7', type: 'doctor', title: 'Dr. Sarah Chen reviewed report', subtitle: 'Added notes', date: '2026-07-15', icon: 'user-md', iconBg: 'bg-emerald-500' },
]

export const recommendations: Recommendation[] = [
  {
    id: 'r1',
    category: 'immediate',
    priority: 'urgent',
    reason: 'Elevated LDL (138 mg/dL) and family history of heart disease.',
    expectedBenefit: 'Reduce 10-year CVD risk by ~15%.',
    riskReduction: '15%',
    evidence: [
      evidence({ label: 'LDL cholesterol', value: '138 mg/dL', source: 'lab', weight: 0.5 }),
      evidence({ label: 'Family history', value: 'Yes', source: 'profile', weight: 0.3 }),
    ],
    actionLabel: 'Schedule lipid counseling',
  },
  {
    id: 'r2',
    category: 'month',
    priority: 'high',
    reason: 'Borderline HbA1c (5.9%) with elevated BMI.',
    expectedBenefit: 'Lower HbA1c to <5.7 and reduce diabetes risk.',
    riskReduction: '28%',
    evidence: [
      evidence({ label: 'HbA1c', value: '5.9%', source: 'lab', weight: 0.6 }),
      evidence({ label: 'BMI', value: '23.4', source: 'measurement', weight: 0.2 }),
    ],
    actionLabel: 'Start prediabetes program',
  },
  {
    id: 'r3',
    category: 'month',
    priority: 'high',
    reason: 'Kidney risk trending down with mild fatigue reported.',
    expectedBenefit: 'Stabilize kidney function and reduce progression risk.',
    riskReduction: '22%',
    evidence: [
      evidence({ label: 'eGFR', value: '88', source: 'lab', weight: 0.7 }),
      evidence({ label: 'Family history — kidney disease', value: 'Yes', source: 'profile', weight: 0.2 }),
    ],
    actionLabel: 'Order urine ACR',
  },
  {
    id: 'r4',
    category: 'six',
    priority: 'medium',
    reason: 'Work stress contributing to sleep latency and mild burnout risk.',
    expectedBenefit: 'Improve sleep quality and reduce stress markers.',
    riskReduction: '18%',
    evidence: [
      evidence({ label: 'Work stress', value: 'Moderate', source: 'questionnaire', weight: 0.5 }),
      evidence({ label: 'Sleep latency', value: 'Elevated', source: 'questionnaire', weight: 0.3 }),
    ],
    actionLabel: 'Try stress-reduction program',
  },
  {
    id: 'r5',
    category: 'longterm',
    priority: 'medium',
    reason: 'Fatty liver noted; borderline lipids.',
    expectedBenefit: 'Normalize liver enzymes and lipid panel within 1 year.',
    riskReduction: '25%',
    evidence: [
      evidence({ label: 'Fatty liver', value: 'Mild', source: 'lab', weight: 0.4 }),
      evidence({ label: 'LDL', value: '138 mg/dL', source: 'lab', weight: 0.3 }),
    ],
    actionLabel: 'Follow metabolic wellness path',
  },
]

export const reportVersions = [
  { version: 'v3.2.1', date: '2026-07-12', generatedBy: 'AI Engine 2.4', assessment: '2.4', status: 'Final' },
  { version: 'v3.1.0', date: '2026-05-30', generatedBy: 'AI Engine 2.3', assessment: '2.3', status: 'Final' },
  { version: 'v1.0.0-draft', date: '2026-04-10', generatedBy: 'AI Engine 2.1', assessment: '2.0', status: 'Draft' },
]

export const attachments = [
  { id: 'a1', name: 'Lab Report — June 2026', type: 'pdf', icon: 'file-text', preview: '8 pages' },
  { id: 'a2', name: 'Chest X-ray — Jan 2026', type: 'image', icon: 'image', preview: '1 image' },
  { id: 'a3', name: 'Doctor Notes — Dr. Chen', type: 'pdf', icon: 'file-text', preview: '3 pages' },
]

export const healthScoreTrend = [
  { date: 'Jan', score: 74 },
  { date: 'Feb', score: 76 },
  { date: 'Mar', score: 78 },
  { date: 'Apr', score: 80 },
  { date: 'May', score: 81 },
  { date: 'Jun', score: 84 },
  { date: 'Jul', score: 86 },
]

export const projectedScores = [
  { date: 'Now', score: 86 },
  { date: '3 Months', score: 88 },
  { date: '6 Months', score: 90 },
  { date: '1 Year', score: 92 },
]

export { bodySystems }
