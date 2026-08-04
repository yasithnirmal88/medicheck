import React from 'react'
import { cn } from '@/lib/utils'

type StatusBadgeProps = {
  status: string
  className?: string
}

const statusStyles: Record<string, string> = {
  normal: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  borderline: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  low: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  pending_review: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  processing: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  failed: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export const LabStatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        statusStyles[status] ?? 'bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
        className,
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default LabStatusBadge
