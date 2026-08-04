import React from 'react'
import { cn } from '@/lib/utils'
import { STATUS_LABEL } from '../data/mockData'
import type { RecommendationStatus } from '../types'

const STATUS_CHIP: Record<RecommendationStatus, string> = {
  pending: 'border-gray-300 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400',
  in_progress: 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  completed: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  dismissed: 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500',
  deferred: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
}

interface StatusFilterProps {
  selected: RecommendationStatus | 'all'
  onChange: (status: RecommendationStatus | 'all') => void
  counts?: Partial<Record<RecommendationStatus, number>>
}

const ALL_STATUSES: RecommendationStatus[] = ['pending', 'in_progress', 'completed', 'dismissed', 'deferred']

export const StatusFilter: React.FC<StatusFilterProps> = ({ selected, onChange, counts }) => {
  const options: { value: RecommendationStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    ...ALL_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = selected === opt.value
        const count = opt.value === 'all' ? undefined : counts?.[opt.value]
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors min-h-[32px]',
              isActive
                ? opt.value === 'all'
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                  : STATUS_CHIP[opt.value]
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-400',
            )}
          >
            {opt.label}
            {count !== undefined && (
              <span className={cn('rounded-full px-1.5 text-[10px]', isActive ? 'bg-white/50 dark:bg-black/20' : 'bg-gray-100 dark:bg-gray-800')}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
