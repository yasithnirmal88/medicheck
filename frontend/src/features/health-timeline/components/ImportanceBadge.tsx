import React from 'react'
import { AlertTriangle, Flag, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Importance } from '../types'

const IMPORTANCE_META: Record<Importance, { label: string; icon: typeof Flag; className: string }> = {
  routine: { label: 'Routine', icon: Info, className: 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400' },
  important: { label: 'Important', icon: Flag, className: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' },
  critical: { label: 'Critical', icon: AlertTriangle, className: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300' },
}

export const ImportanceBadge: React.FC<{ importance: Importance; className?: string }> = ({ importance, className }) => {
  const meta = IMPORTANCE_META[importance]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
        meta.className,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  )
}

export default React.memo(ImportanceBadge)
