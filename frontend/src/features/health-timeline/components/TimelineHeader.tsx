import React from 'react'
import { motion } from 'framer-motion'
import { Activity, CalendarRange, Download, History, RefreshCw, Sparkles, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  HEALTH_JOURNEY_DURATION,
  HEALTH_JOURNEY_START,
  LATEST_UPDATE,
  PATIENT_AGE,
  PATIENT_GENDER,
  PATIENT_NAME,
  timelineEvents,
} from '../data/mockData'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

interface TimelineHeaderProps {
  onExport?: () => void
  healthTrend?: 'up' | 'down' | 'flat'
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({ onExport, healthTrend = 'up' }) => {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-28 h-56 w-56 rounded-full bg-teal-300/20 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <p className="flex items-center gap-2 text-sm font-medium text-blue-50">
              <Sparkles className="h-4 w-4" />
              Medicheck · AI-Powered Health Journey
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Medical Timeline</h1>
            <p className="mt-1.5 max-w-xl text-sm text-blue-50">
              Track your complete health journey with AI-powered insights and longitudinal health records.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-blue-100">
              <span className="inline-flex items-center gap-1.5">
                <CalendarRange className="h-3.5 w-3.5" />
                Timeline range · {HEALTH_JOURNEY_START} → {LATEST_UPDATE}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                Journey duration · {HEALTH_JOURNEY_DURATION}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                {PATIENT_NAME} · {PATIENT_AGE} · {PATIENT_GENDER}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-center lg:gap-3">
            <HeroMetric icon={Activity} label="Total events" value={String(timelineEvents.length)} />
            <HeroMetric
              icon={TrendingUp}
              label="Health trend"
              value="Improving"
              valueClass={healthTrend === 'up' ? 'text-emerald-200' : undefined}
            />
            <HeroMetric icon={RefreshCw} label="Latest update" value={LATEST_UPDATE} />
            <button
              onClick={onExport}
              className="inline-flex h-full min-w-[130px] items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <Download className="h-4 w-4" />
              Export Timeline
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function HeroMetric({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="rounded-xl bg-white/15 p-3 ring-1 ring-white/20 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-blue-100">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={cn('mt-1 text-sm font-semibold text-white', valueClass)}>{value}</p>
    </div>
  )
}

export default React.memo(TimelineHeader)
