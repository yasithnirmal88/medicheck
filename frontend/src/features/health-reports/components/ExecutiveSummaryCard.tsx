import { motion } from 'framer-motion'
import { Bot, FileText, LayoutGrid } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import { ConfidenceBadge } from './StatusBadges'

export const ExecutiveSummaryCard = ({
  summary,
  aiConfidence,
  evidenceCount,
  bodySystemsEvaluated,
  lastUpdated,
}: {
  summary: string
  aiConfidence: number
  evidenceCount: number
  bodySystemsEvaluated: number
  lastUpdated: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
  >
    <Card className="relative isolate p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Executive Summary</h2>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AI-Generated</span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{summary}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-4">
        <div className="flex flex-col">
          <span>AI Confidence</span>
          <ConfidenceBadge confidence={aiConfidence} />
        </div>
        <div className="flex flex-col">
          <span>Evidence Count</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{evidenceCount} sources</span>
        </div>
        <div className="flex flex-col">
          <span>Body Systems</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{bodySystemsEvaluated} evaluated</span>
        </div>
        <div className="flex flex-col">
          <span>Last Updated</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{lastUpdated}</span>
        </div>
      </div>
    </Card>
  </motion.div>
)
