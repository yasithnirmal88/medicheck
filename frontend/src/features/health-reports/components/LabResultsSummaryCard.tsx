import { motion } from 'framer-motion'
import { FlaskConical, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import type { LabResult } from '../types'

const STATUS_STYLE: Record<string, string> = {
  normal: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  abnormal: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  critical: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
}

const TREND_ICON: Record<string, JSX.Element> = {
  improving: <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />,
  declining: <TrendingDown className="h-3.5 w-3.5 text-rose-500" />,
  stable: <Minus className="h-3.5 w-3.5 text-gray-400" />,
}

export const LabResultsSummaryCard = ({ results }: { results: LabResult[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
  >
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Key Laboratory Results</h2>
      </div>

      <div className="mt-4 space-y-3">
        {results.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{r.value}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{r.unit}</span>
                <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>
                  {r.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {TREND_ICON[r.trend]}
                <span className="text-xs text-gray-500 dark:text-gray-400">Range: {r.range}</span>
              </div>
            </div>
            <p className="mt-1 text-xs font-medium text-gray-900 dark:text-gray-100">{r.name}</p>
            <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">{r.interpretation}</p>
            {r.possibleCauses.length > 0 && (
              <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                Possible causes: {r.possibleCauses.join(', ')}
              </p>
            )}
            <p className="mt-1 text-[10px] text-indigo-600 dark:text-indigo-400">{r.followUp}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  </motion.div>
)
