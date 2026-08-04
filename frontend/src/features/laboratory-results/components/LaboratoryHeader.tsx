import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Brain, Download, Calendar, FileText, FlaskConical, AlertTriangle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LaboratoryHeaderProps {
  latestReportDate: string
  totalReports: number
  testsTracked: number
  abnormalFindings: number
  healthScoreImpact: number
  onUpload: () => void
  onGenerateAI: () => void
  onDownload: () => void
}

export const LaboratoryHeader: React.FC<LaboratoryHeaderProps> = ({
  latestReportDate,
  totalReports,
  testsTracked,
  abnormalFindings,
  healthScoreImpact,
  onUpload,
  onGenerateAI,
  onDownload,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-xl sm:p-8"
    >
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
      <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <FlaskConical className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-blue-100">Laboratory Results</span>
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Manage, analyze, and understand your laboratory results
            </h1>
            <p className="max-w-xl text-sm text-blue-100">
              AI-powered clinical insights transform raw lab data into actionable health intelligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onUpload}
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:bg-white/25"
            >
              <Upload className="h-4 w-4" />
              Upload Report
            </button>
            <button
              onClick={onGenerateAI}
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:bg-white/25"
            >
              <Brain className="h-4 w-4" />
              Generate AI Interpretation
            </button>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:bg-white/25"
            >
              <Download className="h-4 w-4" />
              Download Summary
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Latest Report', value: latestReportDate, icon: Calendar },
            { label: 'Total Reports', value: totalReports.toString(), icon: FileText },
            { label: 'Tests Tracked', value: testsTracked.toString(), icon: FlaskConical },
            { label: 'Abnormal Findings', value: abnormalFindings.toString(), icon: AlertTriangle, accent: abnormalFindings > 0 },
            { label: 'Health Score Impact', value: `${healthScoreImpact}%`, icon: TrendingUp, accent: healthScoreImpact > 50 },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                'rounded-xl bg-white/10 p-3 backdrop-blur-sm',
                stat.accent && 'ring-1 ring-white/20',
              )}
            >
              <div className="flex items-center gap-1.5 text-blue-200">
                <stat.icon className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">{stat.label}</span>
              </div>
              <p className="mt-1 text-lg font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default LaboratoryHeader
