import React from 'react'
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TrendDirection } from '../types'

type TrendIndicatorProps = {
  direction: TrendDirection
  className?: string
  showLabel?: boolean
}

const trendConfig: Record<TrendDirection, { icon: React.ElementType; color: string; label: string }> = {
  improving: { icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', label: 'Improving' },
  stable: { icon: Minus, color: 'text-slate-500 dark:text-slate-400', label: 'Stable' },
  worsening: { icon: TrendingDown, color: 'text-red-600 dark:text-red-400', label: 'Worsening' },
  new: { icon: Sparkles, color: 'text-blue-600 dark:text-blue-400', label: 'New' },
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ direction, className, showLabel = true }) => {
  const config = trendConfig[direction]
  const Icon = config.icon
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', config.color, className)}>
      <Icon className="h-3.5 w-3.5" />
      {showLabel && config.label}
    </span>
  )
}

export default TrendIndicator
