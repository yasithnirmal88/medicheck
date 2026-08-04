import React from 'react'
import { cn } from '@/lib/utils'
import Card from '@/features/dashboard/components/Card'
import { BODY_SYSTEM_META, EVENT_TONE_CLASSES, EVENT_TYPE_META } from '../data/eventData'
import type { BodySystemName, TimelineEventType } from '../types'

const LEGEND_EVENT_TYPES: TimelineEventType[] = [
  'health_report_generated',
  'assessment_completed',
  'laboratory_uploaded',
  'medication_added',
  'doctor_review',
  'ai_recommendation',
  'lifestyle_goal_completed',
  'future_appointment',
]

const LEGEND_BODY_SYSTEMS: BodySystemName[] = [
  'heart',
  'kidneys',
  'mental_health',
  'exercise',
  'nutrition',
  'sleep',
  'general',
]

export const TimelineLegend: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={cn('space-y-5', className)}>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Event Legend</h3>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Colour-coded event types</p>
      </div>

      <div className="space-y-2.5">
        {LEGEND_EVENT_TYPES.map((type) => {
          const meta = EVENT_TYPE_META[type]
          const tone = EVENT_TONE_CLASSES[meta.tone]
          return (
            <div key={type} className="flex items-center gap-2.5">
              <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', tone.icon)}>
                <meta.icon className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300">{meta.label}</span>
            </div>
          )
        })}
      </div>

      <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Body systems
        </h4>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {LEGEND_BODY_SYSTEMS.map((bs) => {
            const meta = BODY_SYSTEM_META[bs]
            const tone = EVENT_TONE_CLASSES[meta.tone]
            return (
              <div key={bs} className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 rounded-full', tone.dot)} />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{meta.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default React.memo(TimelineLegend)
