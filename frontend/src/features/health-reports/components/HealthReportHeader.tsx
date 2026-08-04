import { motion } from 'framer-motion'
import { CalendarDays, Download, FileText, Printer, Share2 } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import { ReportStatusBadge } from './StatusBadges'
import type { HealthReport } from '../types'

export const HealthReportHeader = ({ report }: { report: HealthReport }) => (
  <motion.header
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="relative"
  >
    <Card
      className={cn(
        'relative isolate overflow-hidden border-0 p-6 md:p-8',
        'bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 text-white',
      )}
    >
      <div
        className={cn(
          'absolute inset-0 -z-10',
          'before:absolute before:inset-0 before:rounded-full before:bg-white/5 before:blur-3xl',
        )}
      />
      <div className="absolute inset-0 -z-20" />
      <div className="grid gap-6 md:grid-cols-3 md:items-center">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-200" />
            <span className="text-xs font-medium text-indigo-200">Health Report</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{report.title}</h1>
          <p className="mt-1 text-sm text-indigo-100">
            Generated on {new Date(report.generatedDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-indigo-50">
            <span>Version <span className="font-medium">{report.version}</span></span>
            <span>Assessment Version <span className="font-medium">{report.assessmentVersion}</span></span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              Last Updated {new Date(report.generatedDate).toLocaleDateString(undefined, { dateStyle: 'short' })}
            </span>
            <ReportStatusBadge status={report.status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15"
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Report
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
        </div>
      </div>
    </Card>
  </motion.header>
)
