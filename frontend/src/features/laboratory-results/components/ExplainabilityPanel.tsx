import React from 'react'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { ExplainabilityItem } from '../types'

interface ExplainabilityPanelProps {
  items: ExplainabilityItem[]
  confidenceScore: number
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ items, confidenceScore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
            <Eye className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">AI Explainability</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">How the AI reached its conclusions</p>
          </div>
        </div>
        <ConfidenceBadge score={confidenceScore} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/50"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ExplainabilityPanel
