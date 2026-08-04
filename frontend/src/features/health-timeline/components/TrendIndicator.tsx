import React from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TrendDirection } from '../types'

interface TrendIndicatorProps {
  trend: TrendDirection
  value?: string
  className?: string
  invert?: boolean
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend, value, className, invert }) => {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus
  const tone =
    trend === 'flat'
      ? 'text-slate-500 dark:text-slate-400'
      : (invert ?? false)
        ? trend === 'up'
          ? 'text-red-500 dark:text-red-400'
          : 'text-emerald-600 dark:text-emerald-400'
        : trend === 'up'
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-red-500 dark:text-red-400'

  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold', tone, className)}>
      <Icon className="h-3.5 w-3.5" />
      {value ?? (trend === 'flat' ? 'stable' : `${trend === 'up' ? '+' : '−'}`)}
    </span>
  )
}

export default React.memo(TrendIndicator)
