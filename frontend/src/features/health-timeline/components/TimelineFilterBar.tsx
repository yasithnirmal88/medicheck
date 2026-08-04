import React, { useMemo, useState } from 'react'
import { Filter, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Card from '@/features/dashboard/components/Card'
import { TimelineSearch } from './TimelineSearch'
import { BODY_SYSTEM_META, EVENT_TYPE_META, SOURCE_LABELS } from '../data/eventData'
import type { TimelineFilters } from '../types'

interface TimelineFilterBarProps {
  filters: TimelineFilters
  onChange: (next: TimelineFilters) => void
  onReset: () => void
  resultCount: number
}

const selectClass =
  'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:w-auto'

const toggleBase =
  'inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-colors'
const toggleActive = 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
const toggleInactive =
  'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'

export const TimelineFilterBar: React.FC<TimelineFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  resultCount,
}) => {
  const [open, setOpen] = useState(false)

  const activeCount = useMemo(() => {
    let count = 0
    if (filters.query) count += 1
    if (filters.dateRange !== 'all') count += 1
    if (filters.eventType !== 'all') count += 1
    if (filters.bodySystem !== 'all') count += 1
    if (filters.severity !== 'all') count += 1
    if (filters.source !== 'all') count += 1
    if (filters.doctorReviewed) count += 1
    if (filters.aiGenerated) count += 1
    if (filters.manualEntry) count += 1
    return count
  }, [filters])

  const set = <K extends keyof TimelineFilters>(key: K, value: TimelineFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const toggle = (key: 'doctorReviewed' | 'aiGenerated' | 'manualEntry') =>
    onChange({ ...filters, [key]: !filters[key] })

  const body = (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
        <div className="lg:w-64">
          <TimelineSearch value={filters.query} onChange={(q) => set('query', q)} />
        </div>

        <select
          className={selectClass}
          aria-label="Date range"
          value={filters.dateRange}
          onChange={(e) => set('dateRange', e.target.value as TimelineFilters['dateRange'])}
        >
          <option value="all">All time</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>

        <select
          className={selectClass}
          aria-label="Event type"
          value={filters.eventType}
          onChange={(e) => set('eventType', e.target.value as TimelineFilters['eventType'])}
        >
          <option value="all">All event types</option>
          {(Object.keys(EVENT_TYPE_META) as (keyof typeof EVENT_TYPE_META)[]).map((key) => (
            <option key={key} value={key}>
              {EVENT_TYPE_META[key].label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          aria-label="Body system"
          value={filters.bodySystem}
          onChange={(e) => set('bodySystem', e.target.value as TimelineFilters['bodySystem'])}
        >
          <option value="all">All body systems</option>
          {(Object.keys(BODY_SYSTEM_META) as (keyof typeof BODY_SYSTEM_META)[]).map((key) => (
            <option key={key} value={key}>
              {BODY_SYSTEM_META[key].label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          aria-label="Severity"
          value={filters.severity}
          onChange={(e) => set('severity', e.target.value as TimelineFilters['severity'])}
        >
          <option value="all">Any severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          className={selectClass}
          aria-label="Source module"
          value={filters.source}
          onChange={(e) => set('source', e.target.value as TimelineFilters['source'])}
        >
          <option value="all">All sources</option>
          {(Object.keys(SOURCE_LABELS) as (keyof typeof SOURCE_LABELS)[]).map((key) => (
            <option key={key} value={key}>
              {SOURCE_LABELS[key]}
            </option>
          ))}
        </select>

        <button
          onClick={onReset}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ToggleChip label="Doctor reviewed" active={filters.doctorReviewed} onClick={() => toggle('doctorReviewed')} />
        <ToggleChip label="AI generated" active={filters.aiGenerated} onClick={() => toggle('aiGenerated')} />
        <ToggleChip label="Manual entry" active={filters.manualEntry} onClick={() => toggle('manualEntry')} />
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
          {resultCount} event{resultCount === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )

  return (
    <Card className="sticky top-[4.5rem] z-20 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Filters</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {activeCount > 0 ? `${activeCount} active filter${activeCount > 1 ? 's' : ''}` : 'Show everything'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 ? (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              {activeCount}
            </span>
          ) : null}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            {open ? 'Hide' : 'Show'} filters
          </button>
        </div>
      </div>

      <div className={cn('mt-3', open ? 'block' : 'hidden lg:block')}>{body}</div>
    </Card>
  )
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn(toggleBase, active ? toggleActive : toggleInactive)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600')} />
      {label}
    </button>
  )
}

export default React.memo(TimelineFilterBar)
