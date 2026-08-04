import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Droplets, Shield, Activity, Apple, Zap, ShieldCheck, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HealthImpactArea } from '../types'

interface HealthImpactGridProps {
  impacts: HealthImpactArea[]
}

const iconMap: Record<string, React.ElementType> = {
  Heart, Droplets, Shield, Activity, Apple, Zap, ShieldCheck, Brain,
}

const impactColors: Record<string, string> = {
  high: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
  medium: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
  low: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
}

const impactTextColors: Record<string, string> = {
  high: 'text-red-700 dark:text-red-300',
  medium: 'text-amber-700 dark:text-amber-300',
  low: 'text-emerald-700 dark:text-emerald-300',
}

export const HealthImpactGrid: React.FC<HealthImpactGridProps> = ({ impacts }) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {impacts.map((impact, index) => {
        const Icon = iconMap[impact.icon] ?? Activity
        return (
          <motion.div
            key={impact.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={cn(
              'rounded-xl border p-4 transition hover:shadow-sm',
              impactColors[impact.impactLevel],
            )}
          >
            <div className="flex items-start justify-between">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', impactColors[impact.impactLevel])}>
                <Icon className={cn('h-4 w-4', impactTextColors[impact.impactLevel])} />
              </div>
              <span className={cn('text-xs font-semibold capitalize', impactTextColors[impact.impactLevel])}>
                {impact.impactLevel} impact
              </span>
            </div>
            <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">{impact.area}</h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{impact.description}</p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Confidence</span>
                <span>{impact.confidence}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    impact.impactLevel === 'high' ? 'bg-red-500' :
                    impact.impactLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500',
                  )}
                  style={{ width: `${impact.confidence}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {impact.contributingTests.slice(0, 3).map((test, i) => (
                <span
                  key={i}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                >
                  {test}
                </span>
              ))}
              {impact.contributingTests.length > 3 && (
                <span className="text-[10px] text-slate-400">+{impact.contributingTests.length - 3}</span>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default HealthImpactGrid
