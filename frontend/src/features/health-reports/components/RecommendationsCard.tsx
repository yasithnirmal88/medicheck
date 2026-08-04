import { motion } from 'framer-motion'
import { Lightbulb, ChevronRight, ArrowRight } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import type { Recommendation } from '../types'
import { RiskBadge } from './StatusBadges'

const CATEGORY_LABEL: Record<string, string> = {
  immediate: 'Do Now',
  month: 'Within 1 Month',
  six: 'Within 6 Months',
  longterm: 'Long-Term',
}

const CATEGORY_STYLE: Record<string, string> = {
  immediate: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  month: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  six: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  longterm: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
}

const PRIORITY_BADGE: Record<string, 'low' | 'moderate' | 'high' | 'elevated' | 'critical'> = {
  low: 'low',
  medium: 'moderate',
  high: 'high',
  urgent: 'critical',
}

export const RecommendationsCard = ({ items }: { items: Recommendation[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
  >
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommendations</h2>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium', CATEGORY_STYLE[r.category])}>
                    {CATEGORY_LABEL[r.category]}
                  </span>
                  <RiskBadge level={PRIORITY_BADGE[r.priority]} />
                  <span className="text-[10px] text-gray-400">Risk reduction: {r.riskReduction}</span>
                </div>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{r.reason}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Expected benefit: {r.expectedBenefit}
                </p>
                {r.evidence.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.evidence.map((e) => (
                      <span
                        key={e.label}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-slate-800 dark:text-gray-400"
                      >
                        {e.label}: {e.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/60"
              >
                {r.actionLabel}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  </motion.div>
)
