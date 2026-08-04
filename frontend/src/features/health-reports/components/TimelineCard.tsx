import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import type { TimelineEvent } from '../types'

const TYPE_BG: Record<string, string> = {
  questionnaire: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300',
  lab: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
  measurement: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-300',
  event: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  report: 'bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300',
  doctor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
  recommendation: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950/40 dark:text-fuchsia-300',
}

export const TimelineCard = ({ events }: { events: TimelineEvent[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.45 }}
  >
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Report Timeline</h2>
      </div>

      <div className="relative mt-4 ml-4 space-y-0">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
        {events.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            className="relative flex gap-4 py-3"
          >
            <div
              className={cn(
                'absolute left-0 top-4 h-3 w-3 -translate-x-[calc(50%+0.5px)] rounded-full border-2 border-white dark:border-slate-800',
                e.iconBg,
              )}
            />
            <div className="flex-1 pl-4">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{e.title}</p>
              {e.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{e.subtitle}</p>
              )}
            </div>
            <div className="flex items-start gap-2 shrink-0">
              <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', TYPE_BG[e.type] ?? 'bg-gray-100 text-gray-600')}>
                {e.type}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  </motion.div>
)
