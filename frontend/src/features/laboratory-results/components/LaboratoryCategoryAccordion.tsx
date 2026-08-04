import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LabStatusBadge } from './LabStatusBadge'
import { TrendIndicator } from './TrendIndicator'
import { ExpandableTestPanel } from './ExpandableTestPanel'
import { LAB_CATEGORY_LABELS } from '../types'
import type { LabTestResult, LabCategory } from '../types'

interface LaboratoryCategoryAccordionProps {
  tests: LabTestResult[]
}

export const LaboratoryCategoryAccordion: React.FC<LaboratoryCategoryAccordionProps> = ({ tests }) => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())
  const [expandedTest, setExpandedTest] = useState<string | null>(null)

  // Group tests by category
  const grouped = tests.reduce<Record<string, LabTestResult[]>>((acc, test) => {
    if (!acc[test.category]) acc[test.category] = []
    acc[test.category].push(test)
    return acc
  }, {})

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  return (
    <div className="space-y-2">
      {Object.entries(grouped).map(([category, catTests]) => {
        const isOpen = openCategories.has(category)
        const normalCount = catTests.filter((t) => t.status === 'normal').length
        const abnormalCount = catTests.filter((t) => t.status !== 'normal').length
        const label = LAB_CATEGORY_LABELS[category as LabCategory] ?? category

        return (
          <div
            key={category}
            className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
          >
            <button
              onClick={() => toggleCategory(category)}
              className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                )}
                <span className="font-medium text-slate-900 dark:text-white">{label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({catTests.length} test{catTests.length > 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {normalCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    {normalCount} normal
                  </span>
                )}
                {abnormalCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    {abnormalCount} abnormal
                  </span>
                )}
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-100 dark:border-slate-700">
                    {catTests.map((test) => (
                      <div key={test.id}>
                        <button
                          onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                          className="flex w-full items-center justify-between border-b border-slate-100 px-6 py-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-slate-800 dark:text-slate-200">{test.name}</span>
                            <LabStatusBadge status={test.status} />
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={cn(
                              'font-semibold',
                              test.status === 'normal' ? 'text-emerald-600 dark:text-emerald-400' :
                              test.status === 'high' ? 'text-red-600 dark:text-red-400' :
                              test.status === 'low' ? 'text-blue-600 dark:text-blue-400' :
                              'text-amber-600 dark:text-amber-400',
                            )}>
                              {test.value} {test.unit}
                            </span>
                            <TrendIndicator direction={test.trend} showLabel={false} />
                          </div>
                        </button>
                        <AnimatePresence>
                          {expandedTest === test.id && <ExpandableTestPanel test={test} />}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default LaboratoryCategoryAccordion
