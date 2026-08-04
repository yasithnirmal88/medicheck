import { cn } from '@/lib/utils'
import type { ReportStatus, RiskLevel, ConfidenceTier } from '../types'

export const ReportStatusBadge = ({ status }: { status: ReportStatus }) => {
  const cfg: Record<ReportStatus, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800' },
    final: { label: 'Final', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
    reviewed: { label: 'Doctor Reviewed', className: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' },
    preliminary: { label: 'Preliminary', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
  }
  const c = cfg[status]
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium', c.className)}>
      {c.label}
    </span>
  )
}

export const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const cfg: Record<RiskLevel, { label: string; className: string }> = {
    low: { label: 'Low', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
    moderate: { label: 'Moderate', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
    elevated: { label: 'Elevated', className: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300' },
    high: { label: 'High', className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' },
    critical: { label: 'Critical', className: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300' },
  }
  const c = cfg[level]
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium', c.className)}>
      {c.label}
    </span>
  )
}

export const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
  let tier: ConfidenceTier = 'low'
  if (confidence >= 85) tier = 'high'
  else if (confidence >= 70) tier = 'moderate'
  const cfg: Record<ConfidenceTier, { label: string; className: string }> = {
    low: { label: 'Low confidence', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800' },
    moderate: { label: 'Moderate confidence', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
    high: { label: 'High confidence', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  }
  const c = cfg[tier]
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium', c.className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {c.label} ({confidence}%)
    </span>
  )
}

export const TrendIndicator = ({ trend }: { trend: 'improving' | 'declining' | 'stable' }) => {
  const cfg = {
    improving: { icon: '↗', color: 'text-emerald-600', label: 'Improving' },
    declining: { icon: '↘', color: 'text-rose-600', label: 'Declining' },
    stable: { icon: '→', color: 'text-amber-600', label: 'Stable' },
  }[trend]
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', cfg.color)}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}
