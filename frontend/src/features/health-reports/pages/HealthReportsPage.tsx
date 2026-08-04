import AppLayout from '@/layouts/AppLayout'
import { HealthReportHeader } from '../components/HealthReportHeader'
import { OverallHealthScoreCard } from '../components/OverallHealthScoreCard'
import { ExecutiveSummaryCard } from '../components/ExecutiveSummaryCard'
import { BodySystemAccordion } from '../components/BodySystemAccordion'
import { RiskMatrixCard } from '../components/RiskMatrixCard'
import { LifestyleMetricsCard } from '../components/LifestyleMetricsCard'
import { LabResultsSummaryCard } from '../components/LabResultsSummaryCard'
import { PossibleConditionsTable } from '../components/PossibleConditionsTable'
import { ExplainabilityPanel } from '../components/ExplainabilityPanel'
import { RecommendationsCard } from '../components/RecommendationsCard'
import { TimelineCard } from '../components/TimelineCard'
import { ProjectedScoreCard } from '../components/ProjectedScoreCard'
import { ReportVersionHistoryCard } from '../components/ReportVersionHistoryCard'
import { AttachmentsCard } from '../components/AttachmentsCard'
import { ExportActions } from '../components/ExportActions'
import {
  currentReport,
  executiveSummary,
  bodySystemScores,
  possibleConditions,
  riskMatrix,
  lifestyleMetrics,
  labResults,
  timelineEventsData,
  recommendations,
  reportVersions,
  attachments,
  projectedScores,
} from '../data/mockData'

const EXPLANATION_DATA = {
  explanation:
    'The AI model analyzed your profile, questionnaire responses, laboratory results, and lifestyle data to generate a comprehensive risk assessment. Each body system was evaluated independently, then cross-referenced with your medical history and family history for calibration.',
  reasoningSteps: [
    { step: 1, title: 'Data Ingestion', description: 'Collected 47 data points from your profile, 86 questionnaire answers, 12 lab values, and 9 lifestyle metrics.' },
    { step: 2, title: 'Evidence Weighting', description: 'Applied clinical knowledge graph to weight each evidence source by reliability and relevance.' },
    { step: 3, title: 'Risk Modeling', description: 'Ran Bayesian risk models across 8 body systems, calibrated against population norms.' },
    { step: 4, title: 'Cross-Validation', description: 'Cross-referenced findings against your risk factors, family history, and prior assessments.' },
    { step: 5, title: 'Report Generation', description: 'Synthesized results into actionable recommendations with confidence intervals.' },
  ],
  evidenceWeighting: [
    { label: 'Laboratory Values', value: '35%', source: 'lab' as const, weight: 0.35 },
    { label: 'Questionnaire Responses', value: '28%', source: 'questionnaire' as const, weight: 0.28 },
    { label: 'Profile Data', value: '22%', source: 'profile' as const, weight: 0.22 },
    { label: 'Lifestyle Metrics', value: '15%', source: 'lifestyle' as const, weight: 0.15 },
  ],
  missingInfo: [
    'Complete lipid panel (only LDL available)',
    'Recent HbA1c (last was 6 months ago)',
    'Sleep study results',
    'Mental health screening scores',
  ],
  confidenceBreakdown: [
    { name: 'Profile data', weight: 0.22, reason: 'Strong family-history signals' },
    { name: 'Lab values', weight: 0.35, reason: 'Recent and reliable' },
    { name: 'Questionnaire', weight: 0.28, reason: 'Comprehensive responses' },
    { name: 'Lifestyle', weight: 0.15, reason: 'Self-reported, moderate reliability' },
  ],
}

export default function HealthReportsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6 p-4">
        <HealthReportHeader report={currentReport} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OverallHealthScoreCard report={currentReport} />
          <ExecutiveSummaryCard
            summary={executiveSummary}
            aiConfidence={currentReport.aiConfidence}
            evidenceCount={47}
            bodySystemsEvaluated={bodySystemScores.length}
            lastUpdated={new Date(currentReport.generatedDate).toLocaleDateString()}
          />
        </div>

        <BodySystemAccordion systems={bodySystemScores} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RiskMatrixCard cells={riskMatrix} />
          <LifestyleMetricsCard metrics={lifestyleMetrics} />
        </div>

        <LabResultsSummaryCard results={labResults} />

        <PossibleConditionsTable conditions={possibleConditions} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProjectedScoreCard scores={projectedScores} />
          <TimelineCard events={timelineEventsData} />
        </div>

        <ExplainabilityPanel
          explanation={EXPLANATION_DATA.explanation}
          reasoningSteps={EXPLANATION_DATA.reasoningSteps}
          evidenceWeighting={EXPLANATION_DATA.evidenceWeighting}
          missingInfo={EXPLANATION_DATA.missingInfo}
          confidenceBreakdown={EXPLANATION_DATA.confidenceBreakdown}
        />

        <RecommendationsCard items={recommendations} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ReportVersionHistoryCard versions={reportVersions} />
          <AttachmentsCard attachments={attachments} />
        </div>

        <ExportActions />
      </div>
    </AppLayout>
  )
}
