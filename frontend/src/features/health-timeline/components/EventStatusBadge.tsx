import React from 'react'
import { cn } from '@/lib/utils'
import type { EventStatus } from '../types'

const STATUS_META: Record<EventStatus, { label: string; className: string; dot: string }> = {
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300', dot: 'bg-emerald-500' },
  in_progress: { label: 'In progress', className: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300', dot: 'bg-blue-500' },
  scheduled: { label: 'Scheduled', className: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300', dot: 'bg-teal-500' },
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300', dot: 'bg-amber-500' },
  overdue: { label: 'Overdue', className: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300', dot: 'bg-red-500' },
  reviewed: { label: 'Reviewed', className: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300', dot: 'bg-violet-500' },
  cancelled: { label: 'Cancelled', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400', dot: 'bg-slate-400' },
}

export const EventStatusBadge: React.FC<{ status: EventStatus; className?: string }> = ({ status, className }) => {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
        meta.className,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}

export default React.memo(EventStatusBadge)
