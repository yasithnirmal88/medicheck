import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  action?: React.ReactNode
  tone?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

const TONE_CLASSES: Record<NonNullable<SectionHeadingProps['tone']>, string> = {
  primary: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
  accent: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
  success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  danger: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300',
  info: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  icon: Icon,
  title,
  subtitle,
  action,
  tone = 'primary',
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2.5">
        <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', TONE_CLASSES[tone])}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
          {subtitle ? <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

export default React.memo(SectionHeading)
