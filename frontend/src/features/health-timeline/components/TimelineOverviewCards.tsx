import React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  CalendarClock,
  ClipboardCheck,
  FileText,
  FlaskConical,
  HeartPulse,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Card from '@/features/dashboard/components/Card'
import { AnimatedCounter } from './AnimatedCounter'
import { TrendIndicator } from './TrendIndicator'
import { kpis } from '../data/mockData'
import type { KpiMetric } from '../types'

const KPI_ICONS: Record<KpiMetric['icon'], LucideIcon> = {
  events: Activity,
  assessments: ClipboardCheck,
  reports: FileText,
  lab: FlaskConical,
  doctor: Stethoscope,
  score: HeartPulse,
  ai: Sparkles,
  followup: CalendarClock,
}

const TONE_CLASSES: Record<KpiMetric['tone'], string> = {
  primary: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
  accent: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
  success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  danger: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300',
  info: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
}

const cardFade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
}

export const TimelineOverviewCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, i) => {
        const Icon = KPI_ICONS[kpi.icon]
        return (
          <motion.div key={kpi.key} custom={i} variants={cardFade} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
            <Card interactive className="group h-full">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.label}</span>
                <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110', TONE_CLASSES[kpi.tone])}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <AnimatedCounter
                  value={kpi.value}
                  prefix={kpi.prefix}
                  suffix={kpi.suffix}
                  className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
                />
              </div>
              <div className="mt-1.5">
                {kpi.trend ? <TrendIndicator trend={kpi.trend} value={kpi.trendLabel} /> : null}
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default React.memo(TimelineOverviewCards)
