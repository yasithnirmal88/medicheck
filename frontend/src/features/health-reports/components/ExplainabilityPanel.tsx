import { motion } from 'framer-motion'
import { CheckCircle, HelpCircle, Minus, Plus } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import type { ConfidenceFactor, EvidenceItem } from '../types'

export const ExplainabilityPanel = ({
  explanation,
  reasoningSteps,
  evidenceWeighting,
  missingInfo,
  confidenceBreakdown,
}: {
  explanation: string
  reasoningSteps: { step: number; title: string; description: string }[]
  evidenceWeighting: EvidenceItem[]
  missingInfo: string[]
  confidenceBreakdown: ConfidenceFactor[]
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Explainable AI Reasoning</h2>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{explanation}</p>

      <div className="mt-5 space-y-4">
        {reasoningSteps.map((r, i) => (
          <motion.div
            key={r.step}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.28, ease: 'easeOut' }}
            className="flex gap-4"
          >
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                'bg-gradient-to-br from-indigo-500 to-teal-500',
              )}
            >
              {r.step}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{r.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Evidence Weighting</p>
          <div className="mt-2 space-y-2">
            {evidenceWeighting.map((e) => (
              <div key={e.label} className="flex items-center gap-2">
                <span className="w-32 truncate text-xs text-gray-600 dark:text-gray-300">{e.label}</span>
                <div className="h-1.5 flex-1 rounded-sm bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-1.5 rounded-sm bg-indigo-500"
                    style={{ width: `${Math.round(e.weight * 100)}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-gray-900 dark:text-gray-100">{Math.round(e.weight * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Missing Information</p>
          <ul className="mt-2 space-y-1">
            {missingInfo.map((m) => (
              <li key={m} className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                <Plus className="mt-0.5 h-3 w-3" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Confidence Breakdown</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {confidenceBreakdown.map((c) => (
              <div key={c.name} className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-300">{c.name}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{Math.round(c.weight * 100)}%</p>
                <p className="mt-0.5 text-[10px] text-gray-500">{c.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-slate-200/80 dark:border-slate-700/60 p-6 text-center">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Reasoning Graph</p>
        <svg viewBox="0 0 420 120" className="mx-auto mt-2 h-24 w-full max-w-md text-slate-300 dark:text-slate-600">
          <line x1="20" y1="60" x2="400" y2="60" stroke="currentColor" strokeWidth="1" />
          {['Profile', 'Questionnaire', 'Labs', 'Lifestyle', 'Knowledge Graph', 'AI'].map((n, i) => {
            const x = 30 + (i * 63)
            return (
              <g key={n}>
                <circle cx={x} cy="60" r="16" fill="white" stroke="currentColor" strokeWidth="1.5" />
                <text x={x} y="100" textAnchor="middle" fontSize="9" fill="currentColor">
                  {n}
                </text>
                {i > 0 && (
                  <text x={x - 31} y="55" textAnchor="middle" fontSize="8" fill="currentColor">
                    ↑
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        <p className="mt-1 text-[10px] text-gray-400">Visual reasoning graph: data sources → evidence weighting → predictions.</p>
      </div>
    </Card>
  )
}
