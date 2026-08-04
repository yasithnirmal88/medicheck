import React from 'react'
import { cn } from '@/lib/utils'
import type { RecommendationPriority } from '../types'

interface PriorityBadgeProps {
  priority: RecommendationPriority
  className?: string
  size?: 'sm' | 'md'
}

const priorityStyles: Record<RecommendationPriority, string> = {
  urgent: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  preventive: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className, size = 'sm' }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold uppercase tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        priorityStyles[priority],
        className,
      )}
    >
      {priority === 'urgent' && '● '}
      {priority}
    </span>
  )
}

export default PriorityBadge
