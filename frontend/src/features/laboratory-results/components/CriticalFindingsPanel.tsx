import React from 'react'
import { motion } from 'framer-motion'
import { AlertOctagon, Clock, Stethoscope, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CriticalFinding } from '../types'

interface CriticalFindingsPanelProps {
  findings: CriticalFinding[]
}

const severityStyles: Record<string, string> = {
  critical: 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20',
  warning: 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20',
  info: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20',
}

const urgencyLabels: Record<string, string> = {
  immediate: 'Immediate',
  within_24h: 'Within 24 hours',
  within_week: 'Within a week',
  routine: 'Routine follow-up',
}

export const CriticalFindingsPanel: React.FC<CriticalFindingsPanelProps> = ({ findings }) => {
  if (findings.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-amber-50 p-6 dark:border-red-800 dark:from-red-900/20 dark:to-amber-900/20"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/50">
          <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-red-800 dark:text-red-200">Critical Findings</h3>
          <p className="text-xs text-red-600 dark:text-red-400">
            {findings.length} finding{findings.length > 1 ? 's' : ''} requiring attention
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {findings.map((finding, index) => (
          <motion.div
            key={finding.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className={cn('rounded-lg border p-4', severityStyles[finding.severity])}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{finding.testName}</h4>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {finding.value} {finding.unit}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{finding.clinicalMeaning}</p>
              </div>
              <span className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                finding.severity === 'critical' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                finding.severity === 'warning' ? 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200' :
                'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
              )}>
                {finding.severity}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                {urgencyLabels[finding.urgency]}
              </span>
              {finding.doctorConsultationNeeded && (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Stethoscope className="h-3 w-3" />
                  Doctor consultation needed
                </span>
              )}
              {finding.followUpTest && (
                <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <FlaskConical className="h-3 w-3" />
                  {finding.followUpTest}
                </span>
              )}
            </div>

            <div className="mt-3 rounded-lg bg-white/60 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Recommended Action:</p>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{finding.recommendedAction}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default CriticalFindingsPanel
