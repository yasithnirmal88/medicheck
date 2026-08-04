import React from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, FlaskConical, HeartPulse, Apple, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LabRecommendation } from '../types'

interface LaboratoryRecommendationsProps {
  recommendations: LabRecommendation[]
}

const priorityStyles: Record<string, string> = {
  high: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
  medium: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20',
  low: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
}

const priorityBadge: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
}

const categoryIcons: Record<string, React.ElementType> = {
  'Follow-up': FlaskConical,
  'Lifestyle': Apple,
  'Supplement': HeartPulse,
  'Consultation': Stethoscope,
  'Default': ClipboardList,
}

export const LaboratoryRecommendations: React.FC<LaboratoryRecommendationsProps> = ({ recommendations }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
          <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Recommendations from Lab Results</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">AI-generated action items based on your results</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = categoryIcons[rec.category] ?? categoryIcons.Default
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              className={cn('rounded-lg border-l-4 p-4', priorityStyles[rec.priority])}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/80 dark:bg-slate-800/80">
                    <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{rec.title}</h4>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{rec.reason}</p>
                  </div>
                </div>
                <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase', priorityBadge[rec.priority])}>
                  {rec.priority}
                </span>
              </div>

              <div className="mt-3 ml-11 grid gap-2 text-xs sm:grid-cols-2">
                <div className="rounded bg-white/60 p-2 dark:bg-slate-800/60">
                  <p className="font-medium text-slate-500 dark:text-slate-400">Evidence</p>
                  <p className="text-slate-700 dark:text-slate-200">{rec.evidence}</p>
                </div>
                <div className="rounded bg-white/60 p-2 dark:bg-slate-800/60">
                  <p className="font-medium text-slate-500 dark:text-slate-400">Expected Benefit</p>
                  <p className="text-slate-700 dark:text-slate-200">{rec.expectedBenefit}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default LaboratoryRecommendations
