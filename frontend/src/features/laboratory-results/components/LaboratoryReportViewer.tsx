import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Printer, Download, Calendar, User, Building2, FileText } from 'lucide-react'
import { LabStatusBadge } from './LabStatusBadge'
import { LaboratoryTestTable } from './LaboratoryTestTable'
import { AttachmentsViewer } from './AttachmentsViewer'
import type { LaboratoryReport } from '../types'

interface LaboratoryReportViewerProps {
  report: LaboratoryReport
  onClose: () => void
}

export const LaboratoryReportViewer: React.FC<LaboratoryReportViewerProps> = ({ report, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-8 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{report.laboratoryName}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{report.reportType}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300">
                <Printer className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300">
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Report Metadata */}
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase text-slate-400">Collection</p>
                  <p className="font-medium">{new Date(report.collectionDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase text-slate-400">Report Date</p>
                  <p className="font-medium">{new Date(report.reportDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <User className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase text-slate-400">Doctor</p>
                  <p className="font-medium">{report.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Building2 className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase text-slate-400">Laboratory</p>
                  <p className="font-medium">{report.laboratoryName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <FileText className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase text-slate-400">Status</p>
                  <LabStatusBadge status={report.status} />
                </div>
              </div>
            </div>
            {report.notes && (
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                <strong>Notes:</strong> {report.notes}
              </p>
            )}
          </div>

          {/* Tests Table */}
          <div className="px-6 py-4">
            <LaboratoryTestTable tests={report.tests} />
          </div>

          {/* Attachments */}
          {report.attachments && report.attachments.length > 0 && (
            <div className="px-6 pb-6">
              <AttachmentsViewer attachments={report.attachments} />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LaboratoryReportViewer
