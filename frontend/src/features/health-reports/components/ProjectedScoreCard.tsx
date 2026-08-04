import { motion } from 'framer-motion'
import { Target, TrendingUp } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceDot } from 'recharts'

interface ProjectedScore {
  date: string
  score: number
}

export const ProjectedScoreCard = ({ scores }: { scores: ProjectedScore[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.65 }}
  >
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projected Health Score</h2>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        AI-projected score trajectory based on current recommendations
      </p>

      <div className="mt-4 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scores} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334159', borderRadius: 6 }}
              itemStyle={{ color: '#cbd5e1', padding: '2px 6px' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            {scores.length > 0 && (
              <ReferenceDot
                x={scores[scores.length - 1].date}
                y={scores[scores.length - 1].score}
                r={6}
                fill="#10b981"
                stroke="#fff"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
        <span>
          Projected improvement: +{scores[scores.length - 1].score - scores[0].score} points over{' '}
          {scores.length - 1} intervals
        </span>
      </div>
    </Card>
  </motion.div>
)
