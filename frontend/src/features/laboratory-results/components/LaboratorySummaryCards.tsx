import React from 'react'
import { motion } from 'framer-motion'
import { FileText, FlaskConical, AlertTriangle, AlertOctagon, TrendingUp, Calendar, Activity, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SummaryCard {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  bgColor: string
  hint?: string
}

interface LaboratorySummaryCardsProps {
  totalReports: number
  testsCompleted: number
  abnormalResults: number
  criticalResults: number
  trendingImprovements: number
  upcomingTests: number
  laboratoryHealthScore: number
  aiConfidence: number
}

export const LaboratorySummaryCards: React.FC<LaboratorySummaryCardsProps> = ({
  totalReports,
  testsCompleted,
  abnormalResults,
  criticalResults,
  trendingImprovements,
  upcomingTests,
  laboratoryHealthScore,
  aiConfidence,
}) => {
  const cards: SummaryCard[] = [
    { label: 'Total Reports', value: totalReports, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Tests Completed', value: testsCompleted, icon: FlaskConical, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-900/30' },
    { label: 'Abnormal Results', value: abnormalResults, icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/30', hint: 'Requires attention' },
    { label: 'Critical Results', value: criticalResults, icon: AlertOctagon, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/30', hint: 'Urgent' },
    { label: 'Trending Up', value: trendingImprovements, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Upcoming Tests', value: upcomingTests, icon: Calendar, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Lab Health Score', value: `${laboratoryHealthScore}%`, icon: Activity, color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-900/30' },
    { label: 'AI Confidence', value: `${aiConfidence}%`, icon: Brain, color: 'text-violet-600 dark:text-violet-400', bgColor: 'bg-violet-50 dark:bg-violet-900/30' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
        >
          <div className={cn('mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg', card.bgColor)}>
            <card.icon className={cn('h-4 w-4', card.color)} />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{card.value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
          {card.hint && (
            <p className="mt-0.5 text-[10px] text-amber-600 dark:text-amber-400">{card.hint}</p>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default LaboratorySummaryCards
