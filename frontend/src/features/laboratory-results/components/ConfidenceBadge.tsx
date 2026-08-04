import React from 'react'
import { cn } from '@/lib/utils'

type ConfidenceBadgeProps = {
  score: number
  className?: string
  showLabel?: boolean
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, className, showLabel = true }) => {
  const color =
    score >= 90 ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' :
    score >= 75 ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' :
    score >= 60 ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30' :
    'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30'

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', color, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {showLabel && 'Confidence:'} {score}%
    </span>
  )
}

export default ConfidenceBadge
