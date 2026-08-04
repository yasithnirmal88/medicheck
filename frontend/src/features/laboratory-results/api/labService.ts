import api from '@/lib/api'
import type {
  LabTestResult,
  LaboratoryReport,
  AIInterpretation,
  HealthImpactArea,
  CriticalFinding,
  LabTimelineEvent,
  LabRecommendation,
  TrendDataPoint,
  ReportComparisonItem,
} from '../types'

export interface LabReportRecord {
  id: string
  profile_id?: string
  test_name: string
  value?: number
  unit?: string
  reference_range?: string
  laboratory?: string
  date?: string
  notes?: string
  created_at?: string
}

export interface AddLabReportPayload {
  test_name: string
  value?: number
  unit?: string
  reference_range?: string
  laboratory?: string
  date?: string
  notes?: string
}

export interface LabAnalysis {
  tests: LabTestResult[]
  trends: LabTrendSummary[]
  interpretation: AIInterpretation
  criticalFindings: CriticalFinding[]
  healthImpacts: HealthImpactArea[]
  recommendations: LabRecommendation[]
  timelineEvents: LabTimelineEvent[]
  comparison: ReportComparisonItem[]
  totalReports: number
  totalTests: number
  abnormalCount: number
  criticalCount: number
}

export interface LabTrendSummary {
  testName: string
  direction: string
  firstValue: number
  lastValue: number
  changePercent: number
  dataPoints: TrendDataPoint[]
}

export interface LabTrendResponse {
  testName: string
  dataPoints: TrendDataPoint[]
}

// ── CRUD ────────────────────────────────────────────────────────────────────

export async function fetchLabReports(): Promise<LabReportRecord[]> {
  const { data } = await api.get<LabReportRecord[]>('/lab-results')
  return data
}

export async function addLabReport(payload: AddLabReportPayload): Promise<LabReportRecord> {
  const { data } = await api.post<LabReportRecord>('/lab-results', payload)
  return data
}

export async function uploadLabReport(
  file: File,
  options?: { test_name?: string; laboratory?: string; notes?: string },
): Promise<LabReportRecord> {
  const formData = new FormData()
  formData.append('file', file)
  if (options?.test_name) formData.append('test_name', options.test_name)
  if (options?.laboratory) formData.append('laboratory', options.laboratory)
  if (options?.notes) formData.append('notes', options.notes)

  const { data } = await api.post<LabReportRecord>('/lab-results/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteLabReport(reportId: string): Promise<void> {
  await api.delete(`/lab-results/${reportId}`)
}

// ── Analysis ────────────────────────────────────────────────────────────────

export async function fetchLabAnalysis(): Promise<LabAnalysis> {
  const { data } = await api.get<LabAnalysis>('/lab-results/analysis')
  return data
}

export async function fetchTestTrends(testName: string): Promise<LabTrendResponse> {
  const { data } = await api.get<LabTrendResponse>(`/lab-results/trends/${encodeURIComponent(testName)}`)
  return data
}

// ── Legacy mapper (kept for backward compat) ─────────────────────────────────

function parseReference(range?: string): { low?: number; high?: number } {
  if (!range) return {}
  const pair = range.match(/(\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(\d+(?:\.\d+)?)/i)
  if (pair) return { low: parseFloat(pair[1]), high: parseFloat(pair[2]) }
  const single = range.match(/([<>])\s*(\d+(?:\.\d+)?)/)
  if (single) {
    const num = parseFloat(single[2])
    return single[1] === '<' ? { high: num } : { low: num }
  }
  return {}
}

function deriveStatus(value: number | string, ref: { low?: number; high?: number }): LabTestResult['status'] {
  if (typeof value === 'number' && ref.low != null && ref.high != null) {
    if (value > ref.high) return 'high'
    if (value < ref.low) return 'low'
  }
  return 'normal'
}

export function mapLabRecordsToReports(records: LabReportRecord[]): LaboratoryReport[] {
  const groups = new Map<string, LabReportRecord[]>()
  for (const record of records) {
    const key = `${record.laboratory ?? 'Unknown'}__${record.date ?? record.created_at ?? 'unknown'}`
    const bucket = groups.get(key) ?? []
    bucket.push(record)
    groups.set(key, bucket)
  }

  return Array.from(groups.values()).map((group, index) => {
    const first = group[0]
    const tests: LabTestResult[] = group.map((record) => {
      const ref = parseReference(record.reference_range)
      const value = record.value ?? '—'
      return {
        id: record.id,
        name: record.test_name,
        category: 'blood_chemistry',
        value,
        unit: record.unit ?? '',
        referenceRange: record.reference_range ?? '—',
        referenceLow: ref.low ?? 0,
        referenceHigh: ref.high ?? 0,
        status: deriveStatus(value, ref),
        trend: 'new',
      }
    })

    return {
      id: `lab-${index}-${first.id}`,
      laboratoryName: first.laboratory ?? 'Unknown Laboratory',
      reportDate: first.date ?? first.created_at ?? new Date().toISOString(),
      collectionDate: first.date ?? first.created_at ?? new Date().toISOString(),
      reportType: 'Laboratory Report',
      doctor: '—',
      status: 'completed',
      tests,
      abnormalCount: tests.filter((t) => t.status !== 'normal').length,
      criticalCount: tests.filter((t) => t.status === 'critical').length,
      aiInterpretationAvailable: false,
      notes: first.notes,
    }
  })
}
