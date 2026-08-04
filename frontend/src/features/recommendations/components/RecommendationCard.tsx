import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, ExternalLink, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import Card from '@/shared/ui/Card'
import { cn } from '@/lib/utils'
import { PriorityBadge } from '../components/PriorityBadge'
import { CATEGORY_LABEL, STATUS_LABEL } from '../data/mockData'
import type { Recommendation, RecommendationCategory, RecommendationStatus } from '../types'

const CATEGORY_STYLE: Record<RecommendationCategory, string> = {
  immediate: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  month: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  six: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  longterm: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
}

const STATUS_ICON: Record<RecommendationStatus, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5 text-gray-400" />,
  in_progress: <ArrowRight className="h-3.5 w-3.5 text-blue-500" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  dismissed: <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300" />,
  deferred: <Clock className="h-3.5 w-3.5 text-amber-400" />,
}

const STATUS_STYLE: Record<RecommendationStatus, string> = {
  pending: 'text-gray-500 dark:text-gray-400',
  in_progress: 'text-blue-600 dark:text-blue-400',
  completed: 'text-emerald-600 dark:text-emerald-400',
  dismissed: 'text-gray-400 dark:text-gray-500',
  deferred: 'text-amber-600 dark:text-amber-400',
}

interface RecommendationCardProps {
  recommendation: Recommendation
  onStatusChange?: (id: string, status: RecommendationStatus) => void
  onViewReport?: (reportId: string) => void
  onViewAssessment?: (assessmentId: string) => void
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation: rec,
  onStatusChange,
  onViewReport,
  onViewAssessment,
}) => {
  const isCompleted = rec.status === 'completed'
  const isDismissed = rec.status === 'dismissed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all',
          isCompleted && 'opacity-70',
          isDismissed && 'opacity-50',
        )}
      >
        <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l', CATEGORY_STYLE[rec.category].split(' ')[0])} />

        <div className="pl-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={rec.priority} />
                <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border', CATEGORY_STYLE[rec.category])}>
                  {CATEGORY_LABEL[rec.category]}
                </span>
                <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium', STATUS_STYLE[rec.status])}>
                  {STATUS_ICON[rec.status]}
                  {STATUS_LABEL[rec.status]}
                </span>
              </div>
              <h3 className={cn('mt-2 text-sm font-semibold', isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100')}>
                {rec.title}
              </h3>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{rec.reason}</p>
            </div>

            {rec.riskReduction && (
              <div className="shrink-0 flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 dark:bg-emerald-950/30">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{rec.riskReduction}</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-500 dark:text-gray-400">
            <span>Expected: {rec.expectedBenefit}</span>
            {rec.bodySystem && <span>System: {rec.bodySystem}</span>}
          </div>

          {rec.evidence.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {rec.evidence.map((e) => (
                <span
                  key={e.label}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-slate-800 dark:text-gray-400"
                >
                  <span className="font-medium">{e.label}:</span> {e.value}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {rec.reportId && (
              <button
                type="button"
                onClick={() => onViewReport?.(rec.reportId!)}
                className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <ExternalLink className="h-3 w-3" />
                {rec.reportTitle ?? 'View Report'}
              </button>
            )}
            {rec.assessmentId && (
              <button
                type="button"
                onClick={() => onViewAssessment?.(rec.assessmentId!)}
                className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <ExternalLink className="h-3 w-3" />
                {rec.assessmentTitle ?? 'View Assessment'}
              </button>
            )}
          </div>

          {!isCompleted && !isDismissed && onStatusChange && (
            <div className="mt-3 flex flex-wrap gap-2">
              {rec.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => onStatusChange(rec.id, 'in_progress')}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300"
                >
                  Start
                </button>
              )}
              {rec.status === 'in_progress' && (
                <button
                  type="button"
                  onClick={() => onStatusChange(rec.id, 'completed')}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Mark Complete
                </button>
              )}
              <button
                type="button"
                onClick={() => onStatusChange(rec.id, 'dismissed')}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {rec.completedAt && (
            <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
              <Calendar className="h-3 w-3" />
              Completed {new Date(rec.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
