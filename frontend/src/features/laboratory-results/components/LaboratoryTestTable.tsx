import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LabStatusBadge } from './LabStatusBadge'
import { TrendIndicator } from './TrendIndicator'
import { ExpandableTestPanel } from './ExpandableTestPanel'
import type { LabTestResult, LabValueStatus } from '../types'

interface LaboratoryTestTableProps {
  tests: LabTestResult[]
}

type SortKey = 'name' | 'value' | 'status' | 'category'

const statusOrder: Record<LabValueStatus, number> = {
  critical: 0,
  high: 1,
  low: 2,
  borderline: 3,
  normal: 4,
}

export const LaboratoryTestTable: React.FC<LaboratoryTestTableProps> = ({ tests }) => {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [expandedTest, setExpandedTest] = useState<string | null>(null)

  const filtered = tests
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'value') cmp = Number(a.value) - Number(b.value)
      else if (sortKey === 'status') cmp = statusOrder[a.status] - statusOrder[b.status]
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category)
      return sortAsc ? cmp : -cmp
    })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const SortIcon = ({ field }: { field: SortKey }) => (
    <ArrowUpDown className={cn('ml-1 h-3 w-3', sortKey === field ? 'text-blue-500' : 'text-slate-400')} />
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {[
                { key: 'name' as SortKey, label: 'Test Name' },
                { key: 'category' as SortKey, label: 'Category' },
                { key: 'value' as SortKey, label: 'Your Value' },
                { key: 'status' as SortKey, label: 'Status' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    <SortIcon field={col.key} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Reference
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Unit
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Trend
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Previous
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.map((test) => (
              <React.Fragment key={test.id}>
                <tr
                  className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900 dark:text-white">{test.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-slate-600 dark:text-slate-300">{test.category.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'font-semibold',
                      test.status === 'normal' && 'text-emerald-600 dark:text-emerald-400',
                      test.status === 'borderline' && 'text-amber-600 dark:text-amber-400',
                      test.status === 'high' && 'text-red-600 dark:text-red-400',
                      test.status === 'low' && 'text-blue-600 dark:text-blue-400',
                      test.status === 'critical' && 'text-red-700 dark:text-red-300',
                    )}>
                      {test.value}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <LabStatusBadge status={test.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{test.referenceRange}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{test.unit}</td>
                  <td className="px-4 py-3">
                    <TrendIndicator direction={test.trend} showLabel={false} />
                  </td>
                  <td className="px-4 py-3">
                    {test.previousValue != null ? (
                      <span className="text-slate-500 dark:text-slate-400">{test.previousValue}</span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedTest === test.id && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <ExpandableTestPanel test={test} />
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LaboratoryTestTable
