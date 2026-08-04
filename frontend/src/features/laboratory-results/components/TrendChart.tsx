import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts'
import { cn } from '@/lib/utils'
import type { LabTestResult } from '../types'

interface TrendChartProps {
  test: LabTestResult
}

const timeFilters = [
  { label: '1M', months: 1 },
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '1Y', months: 12 },
  { label: 'All', months: 999 },
]

export const TrendChart: React.FC<TrendChartProps> = ({ test }) => {
  const [timeFilter, setTimeFilter] = useState(999)

  const data = (test.trendData ?? []).filter((d) => {
    if (timeFilter === 999) return true
    const date = new Date(d.date)
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - timeFilter)
    return date >= cutoff
  })

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
        No trend data available
      </div>
    )
  }

  const allValues = data.map((d) => d.value)
  const minVal = Math.min(...allValues, test.referenceLow)
  const maxVal = Math.max(...allValues, test.referenceHigh)
  const padding = (maxVal - minVal) * 0.15

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Trend Analysis</h4>
        <div className="flex gap-1">
          {timeFilters.map((f) => (
            <button
              key={f.label}
              onClick={() => setTimeFilter(f.months)}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium transition',
                timeFilter === f.months
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${test.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[minVal - padding, maxVal + padding]}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            {/* Reference range band */}
            <ReferenceLine y={test.referenceHigh} stroke="#fbbf24" strokeDasharray="5 5" strokeWidth={1} />
            <ReferenceLine y={test.referenceLow} stroke="#fbbf24" strokeDasharray="5 5" strokeWidth={1} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill={`url(#gradient-${test.id})`}
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="h-0.5 w-4 rounded bg-blue-500" />
          Your values
        </span>
        <span className="flex items-center gap-1">
          <span className="h-0.5 w-4 rounded border-t border-dashed border-amber-400" />
          Reference range
        </span>
      </div>
    </motion.div>
  )
}

export default TrendChart
