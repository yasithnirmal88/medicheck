import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import { RiskBadge, TrendIndicator } from './StatusBadges'
import type { RiskMatrixCell } from '../types'

const ICON_MAP: Record<string, string> = {
  heart: '🫀',
  kidney: '🫘',
  liver: '🟤',
  activity: '⚡',
  scan: '🔬',
  brain: '🧠',
  wind: '💨',
  'brain-circuit': '🧠',
  apple: '🍎',
}

const RISK_ROW: Record<string, string> = {
  low: 'bg-emerald-50/60 dark:bg-emerald-950/20',
  moderate: 'bg-amber-50/60 dark:bg-amber-950/20',
  elevated: 'bg-orange-50/60 dark:bg-orange-950/20',
  high: 'bg-rose-50/60 dark:bg-rose-950/20',
  critical: 'bg-red-50/60 dark:bg-red-950/20',
}

export const RiskMatrixCard = ({ cells }: { cells: RiskMatrixCell[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
  >
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Risk Matrix</h2>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Disease-category risk overview across all evaluated body systems
      </p>

      <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-700/60">
        {cells.map((c, i) => (
          <motion.div
            key={c.category}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
            className={cn('flex items-center gap-3 px-4 py-3', RISK_ROW[c.risk])}
          >
            <span className="text-lg">{ICON_MAP[c.icon] ?? '📋'}</span>
            <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">{c.category}</span>
            <RiskBadge level={c.risk} />
            <TrendIndicator trend={c.trend} />
            <span className="w-16 text-right text-xs text-gray-500 dark:text-gray-400">{c.confidence}% conf.</span>
          </motion.div>
        ))}
      </div>
    </Card>
  </motion.div>
)
