import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Droplets, TestTubes, FlaskConical, Activity } from 'lucide-react'
import type { LabTimelineEvent } from '../types'

interface LaboratoryTimelineProps {
  events: LabTimelineEvent[]
}

const typeIcons: Record<string, React.ElementType> = {
  blood: Droplets,
  urine: FlaskConical,
  hormone: Activity,
  default: TestTubes,
}

export const LaboratoryTimeline: React.FC<LaboratoryTimelineProps> = ({ events }) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Laboratory Timeline</h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-4">
          {events.map((event, index) => {
            const Icon = typeIcons[event.type] ?? typeIcons.default
            const isExpanded = expandedEvent === event.id

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="relative flex gap-4"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="min-w-0 flex-1 pb-4">
                  <button
                    onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">{event.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{event.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      {event.expandable && (
                        isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> :
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && event.details && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-2 space-y-1 pl-1">
                          {event.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <span className="h-1 w-1 rounded-full bg-blue-400" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default LaboratoryTimeline
