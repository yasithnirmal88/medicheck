import React from 'react'
import { motion } from 'framer-motion'
import { Paperclip, FileText, Image, File, Download, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LabAttachment } from '../types'

interface AttachmentsViewerProps {
  attachments: LabAttachment[]
}

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  image: Image,
  document: File,
}

const typeColors: Record<string, string> = {
  pdf: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  image: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  document: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
}

export const AttachmentsViewer: React.FC<AttachmentsViewerProps> = ({ attachments }) => {
  if (attachments.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
          <Paperclip className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Attachments</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {attachments.length} file{attachments.length > 1 ? 's' : ''} attached
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {attachments.map((attachment, index) => {
          const Icon = typeIcons[attachment.type] ?? File
          return (
            <motion.div
              key={attachment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between rounded-lg border border-slate-100 p-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', typeColors[attachment.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{attachment.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {attachment.size} · {new Date(attachment.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default AttachmentsViewer
