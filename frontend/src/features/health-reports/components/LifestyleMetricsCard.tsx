import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import type { LifestyleMetric } from '../types'
import { RiskBadge } from './StatusBadges'

const SCORE_COLOR = (s: number) => {
  if (s >= 85) return '#10b981'
  if (s >= 70) return '#3b82f6'
  if (s >= 50) return '#f59e0b'
  return '#ef4444'
}

export const LifestyleMetricsCard = ({ metrics }: { metrics: LifestyleMetric[] }) => {
  const chartData = metrics.map((m) => ({ name: m.name, score: m.score }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.35 }}
    >
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Lifestyle Metrics</h2>
        </div>

        <div className="mt-4 h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334159', borderRadius: 6 }}
                itemStyle={{ color: '#cbd5e1', padding: '2px 6px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                {chartData.map((d, idx) => (
                  <Cell key={idx} fill={SCORE_COLOR(d.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{m.name}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{m.status}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <RiskBadge level={m.riskContribution} />
                <span
                  className={cn('text-sm font-bold', SCORE_COLOR(m.score) === '#10b981' ? 'text-emerald-600' : SCORE_COLOR(m.score) === '#3b82f6' ? 'text-indigo-600' : SCORE_COLOR(m.score) === '#f59e0b' ? 'text-amber-600' : 'text-rose-600')}
                >
                  {m.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
