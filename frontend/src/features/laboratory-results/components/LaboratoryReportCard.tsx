import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, FileText, AlertTriangle, Brain, ChevronRight, Download, Eye } from 'lucide-react'
import { LabStatusBadge } from './LabStatusBadge'
import type { LaboratoryReport } from '../types'

interface LaboratoryReportCardProps {
  report: LaboratoryReport
  onView: (report: LaboratoryReport) => void
  onDownload: (report: LaboratoryReport) => void
}

export const LaboratoryReportCard: React.FC<LaboratoryReportCardProps> = ({
  report,
  onView,
  onDownload,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      onClick={() => onView(report)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">{report.laboratoryName}</h3>
            <LabStatusBadge status={report.status} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{report.reportType}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-blue-500" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {new Date(report.reportDate).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <User className="h-3.5 w-3.5 text-slate-400" />
          {report.doctor}
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <FileText className="h-3.5 w-3.5 text-slate-400" />
          {report.tests.length} tests
        </div>
        <div className="flex items-center gap-1.5">
          {report.abnormalCount > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              {report.abnormalCount} abnormal
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
        <div className="flex items-center gap-3">
          {report.aiInterpretationAvailable && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400">
              <Brain className="h-3.5 w-3.5" />
              AI Available
            </span>
          )}
          {report.attachments && report.attachments.length > 0 && (
            <span className="text-xs text-slate-400">
              {report.attachments.length} attachment{report.attachments.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(report) }}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onView(report) }}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default LaboratoryReportCard
