import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LabStatusBadge } from './LabStatusBadge'
import type { ReportComparisonItem } from '../types'

interface ReportComparisonProps {
  items: ReportComparisonItem[]
}

const trendIcons: Record<string, React.ElementType> = {
  improving: TrendingUp,
  worsening: TrendingDown,
  stable: Minus,
  new: Minus,
}

const trendColors: Record<string, string> = {
  improving: 'text-emerald-600 dark:text-emerald-400',
  worsening: 'text-red-600 dark:text-red-400',
  stable: 'text-slate-500 dark:text-slate-400',
  new: 'text-blue-600 dark:text-blue-400',
}

export const ReportComparison: React.FC<ReportComparisonProps> = ({ items }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
          <ArrowLeftRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Report Comparison</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">March 2026 vs December 2025</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="pb-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Test</th>
              <th className="pb-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Previous</th>
              <th className="pb-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Current</th>
              <th className="pb-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Change</th>
              <th className="pb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">Trend</th>
              <th className="pb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((item, index) => {
              const TrendIcon = trendIcons[item.trend] ?? Minus
              return (
                <motion.tr
                  key={item.testName}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    'transition hover:bg-slate-50 dark:hover:bg-slate-700/50',
                    item.isImprovement && 'bg-emerald-50/50 dark:bg-emerald-900/10',
                  )}
                >
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{item.testName}</td>
                  <td className="py-3 text-right text-slate-600 dark:text-slate-300">{item.previousValue} {item.unit}</td>
                  <td className="py-3 text-right font-semibold text-slate-900 dark:text-white">{item.currentValue} {item.unit}</td>
                  <td className={cn('py-3 text-right font-medium', trendColors[item.trend])}>
                    {item.difference}
                  </td>
                  <td className="py-3 text-center">
                    <TrendIcon className={cn('mx-auto h-4 w-4', trendColors[item.trend])} />
                  </td>
                  <td className="py-3 text-center">
                    <LabStatusBadge status={item.status} />
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Improvement
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          Worsening
        </span>
      </div>
    </motion.div>
  )
}

export default ReportComparison
