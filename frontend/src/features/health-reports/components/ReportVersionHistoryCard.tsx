import { motion } from 'framer-motion'
import { History } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'

interface ReportVersion {
  version: string
  date: string
  generatedBy: string
  assessment: string
  status: string
}

const STATUS_STYLE: Record<string, string> = {
  Final: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

export const ReportVersionHistoryCard = ({ versions }: { versions: ReportVersion[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.55 }}
  >
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Report Versions</h2>
      </div>

      <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-700/60">
        {versions.map((v, i) => (
          <motion.div
            key={v.version}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">{v.version}</span>
            <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium', STATUS_STYLE[v.status] ?? 'bg-gray-100 text-gray-600')}>
              {v.status}
            </span>
            <span className="flex-1 text-xs text-gray-500 dark:text-gray-400">
              {v.generatedBy} · Assessment {v.assessment}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(v.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  </motion.div>
)
