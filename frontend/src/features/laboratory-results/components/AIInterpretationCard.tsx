import React from 'react'
import { motion } from 'framer-motion'
import { Brain, AlertTriangle, CheckCircle, AlertCircle, Hash } from 'lucide-react'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { AIInterpretation } from '../types'

interface AIInterpretationCardProps {
  interpretation: AIInterpretation
}

export const AIInterpretationCard: React.FC<AIInterpretationCardProps> = ({ interpretation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-6 dark:border-violet-800 dark:from-violet-900/20 dark:to-blue-900/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/50">
            <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">AI Clinical Interpretation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generated {new Date(interpretation.generatedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceBadge score={interpretation.confidenceScore} />
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            <Hash className="h-3 w-3" />
            {interpretation.evidenceCount} evidence
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{interpretation.summary}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" />
            Health Risks
          </h4>
          <ul className="space-y-1.5">
            {interpretation.healthRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-red-600 dark:text-red-300/80">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                {risk}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle className="h-4 w-4" />
            Positive Findings
          </h4>
          <ul className="space-y-1.5">
            {interpretation.positiveFindings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-emerald-600 dark:text-emerald-300/80">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                {finding}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
            <AlertCircle className="h-4 w-4" />
            Areas Requiring Attention
          </h4>
          <ul className="space-y-1.5">
            {interpretation.areasRequiringAttention.map((area, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-300/80">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default AIInterpretationCard
