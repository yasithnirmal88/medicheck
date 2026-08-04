import { motion } from 'framer-motion'
import { Paperclip, FileText, Image } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'

interface Attachment {
  id: string
  name: string
  type: string
  icon: string
  preview: string
}

const TYPE_ICON: Record<string, JSX.Element> = {
  pdf: <FileText className="h-4 w-4 text-rose-500" />,
  image: <Image className="h-4 w-4 text-cyan-500" />,
}

export const AttachmentsCard = ({ attachments }: { attachments: Attachment[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.6 }}
  >
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Paperclip className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Attachments</h2>
      </div>

      <div className="mt-4 space-y-2">
        {attachments.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="flex items-center gap-3 rounded-lg border border-slate-200/80 dark:border-slate-700/60 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              {TYPE_ICON[a.type] ?? <FileText className="h-4 w-4 text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{a.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{a.preview}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  </motion.div>
)
