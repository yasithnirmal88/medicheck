import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LaboratoryHeader } from '../components/LaboratoryHeader'
import { LaboratorySummaryCards } from '../components/LaboratorySummaryCards'
import { LaboratoryReportCard } from '../components/LaboratoryReportCard'
import { LaboratoryReportViewer } from '../components/LaboratoryReportViewer'
import { LaboratoryTestTable } from '../components/LaboratoryTestTable'
import { AIInterpretationCard } from '../components/AIInterpretationCard'
import { LaboratoryCategoryAccordion } from '../components/LaboratoryCategoryAccordion'
import { TrendChart } from '../components/TrendChart'
import { HealthImpactGrid } from '../components/HealthImpactGrid'
import { ExplainabilityPanel } from '../components/ExplainabilityPanel'
import { CriticalFindingsPanel } from '../components/CriticalFindingsPanel'
import { LaboratoryTimeline } from '../components/LaboratoryTimeline'
import { ReportUploadCard } from '../components/ReportUploadCard'
import { ReportComparison } from '../components/ReportComparison'
import { LaboratoryRecommendations } from '../components/LaboratoryRecommendations'
import { ReferenceInformationCard } from '../components/ReferenceInformationCard'
import { AttachmentsViewer } from '../components/AttachmentsViewer'

import {
  mockReports,
  mockAIInterpretation,
  mockHealthImpacts,
  mockCriticalFindings,
  mockTimelineEvents,
  mockRecommendations,
  mockReferenceInfo,
  mockComparisonData,
} from '../data/mockData'

import type { LaboratoryReport, LabTestResult, ExplainabilityItem } from '../types'
import { useLabReports } from '../hooks/useLabReports'
import { addLabReport, mapLabRecordsToReports } from '../api/labService'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function LaboratoryResultsPage() {
  const [selectedReport, setSelectedReport] = useState<LaboratoryReport | null>(null)
  const [selectedTest] = useState<LabTestResult | null>(null)

  const { data: apiRecords, refetch } = useLabReports()
  const apiReports = useMemo(() => (apiRecords ? mapLabRecordsToReports(apiRecords) : []), [apiRecords])
  const reports = apiReports.length > 0 ? apiReports : mockReports

  const latestReport = reports[0]
  const allTests = reports[0]?.tests ?? []

  const abnormalCount = allTests.filter((t) => t.status !== 'normal').length
  const criticalCount = allTests.filter((t) => t.status === 'critical').length
  const improvingCount = allTests.filter((t) => t.trend === 'improving').length

  const explainabilityItems: ExplainabilityItem[] = [
    { label: 'Laboratory Values Used', value: `${allTests.length} test values analyzed` },
    { label: 'Reference Ranges', value: 'WHO & AACC standard ranges' },
    { label: 'Clinical Rules Applied', value: '12 evidence-based rules' },
    { label: 'Knowledge Graph Evidence', value: '45 linked clinical articles' },
    { label: 'Body Systems Affected', value: '5 systems evaluated' },
    { label: 'Confidence Score', value: `${mockAIInterpretation.confidenceScore}%` },
  ]

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        await addLabReport({
          test_name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Laboratory Report',
          laboratory: 'Uploaded Report',
          date: new Date().toISOString().slice(0, 10),
          notes: 'Uploaded laboratory report — awaiting AI extraction',
        })
      } catch (err) {
        console.error('Upload failed for', file.name, err)
      }
    }
    await refetch()
  }

  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp}>
          <LaboratoryHeader
            latestReportDate={latestReport ? new Date(latestReport.reportDate).toLocaleDateString() : 'N/A'}
            totalReports={reports.length}
            testsTracked={allTests.length}
            abnormalFindings={abnormalCount}
            healthScoreImpact={72}
            onUpload={() => handleUpload([])}
            onGenerateAI={() => {}}
            onDownload={() => {}}
          />
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={fadeUp}>
          <LaboratorySummaryCards
            totalReports={reports.length}
            testsCompleted={allTests.length}
            abnormalResults={abnormalCount}
            criticalResults={criticalCount}
            trendingImprovements={improvingCount}
            upcomingTests={2}
            laboratoryHealthScore={72}
            aiConfidence={mockAIInterpretation.confidenceScore}
          />
        </motion.div>

        {/* Critical Findings */}
        {mockCriticalFindings.length > 0 && (
          <motion.div variants={fadeUp}>
            <CriticalFindingsPanel findings={mockCriticalFindings} />
          </motion.div>
        )}

        {/* AI Interpretation */}
        <motion.div variants={fadeUp}>
          <AIInterpretationCard interpretation={mockAIInterpretation} />
        </motion.div>

        {/* Recent Reports */}
        <motion.div variants={fadeUp}>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Recent Laboratory Reports</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <LaboratoryReportCard
                key={report.id}
                report={report}
                onView={setSelectedReport}
                onDownload={(r) => console.log('Download:', r)}
              />
            ))}
          </div>
        </motion.div>

        {/* Health Impact Grid */}
        <motion.div variants={fadeUp}>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Health Impact</h2>
          <HealthImpactGrid impacts={mockHealthImpacts} />
        </motion.div>

        {/* Trend Chart - Show first abnormal test */}
        {selectedTest ? (
          <motion.div variants={fadeUp}>
            <TrendChart test={selectedTest} />
          </motion.div>
        ) : allTests.find((t) => t.trendData && t.trendData.length > 0) ? (
          <motion.div variants={fadeUp}>
            <TrendChart test={allTests.find((t) => t.trendData && t.trendData.length > 0)!} />
          </motion.div>
        ) : null}

        {/* Report Comparison */}
        <motion.div variants={fadeUp}>
          <ReportComparison items={mockComparisonData} />
        </motion.div>

        {/* Category Accordion */}
        <motion.div variants={fadeUp}>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Laboratory Categories</h2>
          <LaboratoryCategoryAccordion tests={allTests} />
        </motion.div>

        {/* Test Table */}
        <motion.div variants={fadeUp}>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">All Test Results</h2>
          <LaboratoryTestTable tests={allTests} />
        </motion.div>

        {/* Recommendations */}
        <motion.div variants={fadeUp}>
          <LaboratoryRecommendations recommendations={mockRecommendations} />
        </motion.div>

        {/* Explainability Panel */}
        <motion.div variants={fadeUp}>
          <ExplainabilityPanel items={explainabilityItems} confidenceScore={mockAIInterpretation.confidenceScore} />
        </motion.div>

        {/* Reference Information */}
        {Object.values(mockReferenceInfo).slice(0, 2).map((ref) => (
          <motion.div key={ref.testName} variants={fadeUp}>
            <ReferenceInformationCard reference={ref} />
          </motion.div>
        ))}

        {/* Timeline & Upload side by side */}
        <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
          <LaboratoryTimeline events={mockTimelineEvents} />
          <ReportUploadCard onUpload={handleUpload} />
        </motion.div>

        {/* Attachments from latest report */}
        {latestReport?.attachments && latestReport.attachments.length > 0 && (
          <motion.div variants={fadeUp}>
            <AttachmentsViewer attachments={latestReport.attachments} />
          </motion.div>
        )}
      </motion.div>

      {/* Report Viewer Modal */}
      {selectedReport && (
        <LaboratoryReportViewer
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </DashboardLayout>
  )
}
