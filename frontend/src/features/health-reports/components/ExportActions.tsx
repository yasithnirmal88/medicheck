import { motion } from 'framer-motion'
import { Download, Mail, Printer, Share2 } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'

export const ExportActions = () => {
  const actions = [
    { label: 'Download PDF', icon: <Download className="h-4 w-4" />, variant: 'primary' },
    { label: 'Share Secure Link', icon: <Share2 className="h-4 w-4" />, variant: 'secondary' },
    { label: 'Print', icon: <Printer className="h-4 w-4" />, variant: 'secondary' },
    { label: 'Email Doctor', icon: <Mail className="h-4 w-4" />, variant: 'secondary' },
    { label: 'Generate Clinical Report', icon: <Download className="h-4 w-4" />, variant: 'secondary' },
  ]
  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2">
        {actions.map((a, i) => (
          <motion.button
            key={a.label}
            whileHover={{ scale: a.variant === 'primary' ? 1.03 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.28, ease: 'easeOut' }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium',
              a.variant === 'primary'
                ? 'bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:brightness-110'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
            )}
          >
            {a.icon}
            {a.label}
          </motion.button>
        ))}
      </div>
    </Card>
  )
}
