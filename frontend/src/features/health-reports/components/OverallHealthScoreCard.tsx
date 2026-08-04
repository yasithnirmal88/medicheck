import { motion } from 'framer-motion'
import { Award, CalendarDays, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import type { HealthReport } from '../types'
import { healthScoreTrend } from '../data/mockData'

const SCORE_TIERS = [
  { min: 90, label: 'Excellent', color: 'text-emerald-500' },
  { min: 80, label: 'Good', color: 'text-indigo-500' },
  { min: 70, label: 'Moderate', color: 'text-amber-500' },
  { min: 0, label: 'Needs Attention', color: 'text-rose-500' },
] as const

const tierFor = (score: number) => SCORE_TIERS.find((t) => score >= t.min)!

const gaugeColor = (score: number) => {
  if (score >= 90) return '#10b981'
  if (score >= 80) return '#3b82f6'
  if (score >= 70) return '#f59e0b'
  return '#ef4444'
}

const data = [{ value: 1 }, { value: 0 }]

export const OverallHealthScoreCard = ({ report }: { report: HealthReport }) => {
  const tier = tierFor(report.overallScore)
  const trendIcon = report.riskTrend === 'improving' ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : report.riskTrend === 'declining' ? <TrendingDown className="h-4 w-4 text-rose-500" /> : <Activity className="h-4 w-4 text-amber-500" />

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
    >
      <Card className="relative isolate overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Health Score</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Compared to previous: +{report.overallScore - (report.previousScore ?? report.overallScore)} pts</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6 lg:gap-8">
          <div className="relative mx-auto h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={52} outerRadius={68} startAngle={90} endAngle={-270} strokeWidth={0}>
                  <Cell fill={gaugeColor(report.overallScore)} />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={cn('text-3xl font-bold', tier.color)}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              >
                {report.overallScore}
              </motion.span>
              <span className="text-[10px] text-gray-500">of 100</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Award className={cn('h-5 w-5', tier.color)} />
              <span className={cn('text-lg font-semibold', tier.color)}>{tier.label}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>Health Age</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{report.healthAge}</span>
              <span className="text-gray-400">·</span>
              <span>Biological Age</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{report.biologicalAge}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-300">Risk trend</span>
              {trendIcon}
              <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{report.riskTrend}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 h-32 w-full">
          <p className="mb-1 text-xs font-medium text-gray-500">Health Score Trend</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthScoreTrend}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis domain={[60, 100]} hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334159', borderRadius: 6 }}
                itemStyle={{ color: '#cbd5e1', padding: '2px 6px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <ReferenceLine y={86} stroke="#3b82f6" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="score" stroke={gaugeColor(report.overallScore)} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
