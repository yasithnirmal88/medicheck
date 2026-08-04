import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import Card from '@/shared/ui/Card'
import { cn } from '@/lib/utils'
import type { Recommendation, RecommendationStatus } from '../types'

interface CompletionStatsProps {
  recommendations: Recommendation[]
}

const statCard = (label: string, value: number | string, icon: React.ReactNode, color: string) => (
  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', color)}>
      {icon}
    </div>
    <div>
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
)

export const CompletionStats: React.FC<CompletionStatsProps> = ({ recommendations }) => {
  const total = recommendations.length
  const completed = recommendations.filter((r) => r.status === 'completed').length
  const inProgress = recommendations.filter((r) => r.status === 'in_progress').length
  const pending = recommendations.filter((r) => r.status === 'pending').length
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0

  const urgentPending = recommendations.filter((r) => r.priority === 'urgent' && r.status !== 'completed' && r.status !== 'dismissed').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Completion Overview</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">{completed} of {total} completed</span>
        </div>

        <div className="relative h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <motion.div
            className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {statCard('Total', total, <TrendingUp className="h-4 w-4 text-indigo-600" />, 'bg-indigo-100 dark:bg-indigo-950/40')}
          {statCard('Completed', completed, <CheckCircle2 className="h-4 w-4 text-emerald-600" />, 'bg-emerald-100 dark:bg-emerald-950/40')}
          {statCard('In Progress', inProgress, <Clock className="h-4 w-4 text-blue-600" />, 'bg-blue-100 dark:bg-blue-950/40')}
          {statCard('Urgent Pending', urgentPending, <AlertTriangle className="h-4 w-4 text-rose-600" />, 'bg-rose-100 dark:bg-rose-950/40')}
        </div>
      </Card>
    </motion.div>
  )
}
