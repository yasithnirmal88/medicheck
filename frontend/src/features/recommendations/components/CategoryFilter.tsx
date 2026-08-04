import React from 'react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABEL, CATEGORY_ORDER } from '../data/mockData'
import type { RecommendationCategory } from '../types'

const CATEGORY_CHIP: Record<RecommendationCategory, string> = {
  immediate: 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  month: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  six: 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  longterm: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
}

interface CategoryFilterProps {
  selected: RecommendationCategory | 'all'
  onChange: (category: RecommendationCategory | 'all') => void
  counts?: Partial<Record<RecommendationCategory, number>>
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onChange, counts }) => {
  const options: { value: RecommendationCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORY_ORDER.map((c) => ({ value: c, label: CATEGORY_LABEL[c] })),
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
                  : CATEGORY_CHIP[opt.value]
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
