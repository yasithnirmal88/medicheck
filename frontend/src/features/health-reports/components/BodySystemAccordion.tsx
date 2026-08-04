import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Card from '@/features/dashboard/components/Card'
import type { BodySystemScore } from '../types'
import { ConfidenceBadge, RiskBadge, TrendIndicator } from './StatusBadges'
import { Award, ChevronDown, Activity, Brain, Bone, Droplet, Eye, HeartPulse, Droplets, Wind, Apple, Smile } from 'lucide-react'

const ICON_MAP: Record<string, JSX.Element> = {
  'heart-pulse': <HeartPulse className="h-4 w-4 text-rose-500" />,
  wind: <Wind className="h-4 w-4 text-cyan-500" />,
  brain: <Brain className="h-4 w-4 text-purple-500" />,
  kidney: <Award className="h-4 w-4 text-teal-500" />,
  liver: <Droplets className="h-4 w-4 text-amber-500" />,
  'heart-hand': <Award className="h-4 w-4 text-lime-500" />,
  activity: <Activity className="h-4 w-4 text-fuchsia-500" />,
  'brain-circuit': <Brain className="h-4 w-4 text-violet-500" />,
  bone: <Bone className="h-4 w-4 text-orange-400" />,
  eye: <Eye className="h-4 w-4 text-cyan-600" />,
  skin: <Award className="h-4 w-4 text-yellow-500" />,
  apple: <Apple className="h-4 w-4 text-green-600" />,
  smiley: <Smile className="h-4 w-4 text-indigo-600" />,
  droplet: <Droplet className="h-4 w-4 text-blue-400" />,
}

const SCORE_BG: Record<string, string> = {
  cardiovascular: 'from-rose-500/10 to-transparent',
  respiratory: 'from-cyan-500/10 to-transparent',
  neurological: 'from-purple-500/10 to-transparent',
  renal: 'from-teal-500/10 to-transparent',
  hepatic: 'from-amber-500/10 to-transparent',
  gastrointestinal: 'from-lime-500/10 to-transparent',
  endocrine: 'from-fuchsia-500/10 to-transparent',
  mental: 'from-violet-500/10 to-transparent',
}

const riskScoreColor = (s: number) =>
  s >= 85 ? 'text-emerald-600' : s >= 70 ? 'text-indigo-600' : s >= 50 ? 'text-amber-600' : 'text-rose-600'

export const BodySystemScoreCard = ({ system }: { system: BodySystemScore }) => {
  const Icon = ICON_MAP[system.icon] ?? <Award className="h-4 w-4 text-gray-400" />
  const bg = SCORE_BG[system.id] ?? 'from-slate-200/20 to-transparent'

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/80 bg-gradient-to-br p-4 dark:border-slate-700/60',
        bg,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{system.name}</h3>
        </div>
        <span className={cn('text-lg font-bold', riskScoreColor(system.score))}>{system.score} / 100</span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600 dark:text-gray-300">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Risk Level</span>
          <RiskBadge level={system.riskLevel} />
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Trend</span>
          <TrendIndicator trend={system.trend} />
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">AI Confidence</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{system.aiConfidence}%</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Coverage</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{system.coveragePct}%</span>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
        {system.symptomsFound.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {system.symptomsFound.length} symptom{system.symptomsFound.length > 1 ? 's' : ''}
          </span>
        )}
        {system.positiveIndicators.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {system.positiveIndicators.length} positive
          </span>
        )}
        {system.negativeIndicators.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            {system.negativeIndicators.length} caution
          </span>
        )}
      </div>
    </div>
  )
}

export const BodySystemAccordion = ({ systems }: { systems: BodySystemScore[] }) => {
  const [openId, setOpenId] = useState('cardiovascular')
  return (
    <div className="space-y-2">
      {systems.map((s) => {
        const Icon = ICON_MAP[s.icon] ?? <Award className="h-4 w-4 text-gray-400" />
        const isOpen = openId === s.id
        return (
          <motion.div
            key={s.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Card
              interactive
              padded={false}
              className={cn('overflow-hidden transition-colors', isOpen && 'shadow-md shadow-slate-100 dark:shadow-slate-900')}
            >
              <button
                type="button"
                onClick={() => setOpenId(s.id)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-teal-500/10">
                  {Icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{s.name}</h3>
                    <span className={cn('text-sm font-bold', riskScoreColor(s.score))}>{s.score}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <RiskBadge level={s.riskLevel} />
                    <TrendIndicator trend={s.trend} />
                    <span>{s.aiConfidence}% AI confidence</span>
                  </div>
                </div>
                <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key={s.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="px-5 pb-5"
                  >
                    <BodySystemDetail system={s} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function BodySystemDetail({ system }: { system: BodySystemScore }) {
  const list = (items: string[]) =>
    items.length > 0 ? (
      <ul className="mt-1 list-disc pl-5 text-xs text-gray-600 dark:text-gray-300">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    ) : (
      <p className="mt-1 text-xs text-gray-400">None identified</p>
    )

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-200">Clinical Summary</span>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            System score of {system.score} with {system.riskLevel} risk. Trend: {system.trend}.
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-200">Coverage</span>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            {system.coveragePct}% of relevant questionnaire domains addressed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-200">Symptoms Found</span>
          {list(system.symptomsFound)}
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-200">Positive Indicators</span>
          {list(system.positiveIndicators)}
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-200">Negative Indicators</span>
          {list(system.negativeIndicators)}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <span className="text-gray-500">Laboratory Findings: 3 relevant tests</span>
        <span className="text-gray-500">Questionnaire Responses: {Math.round(system.coveragePct / 10)} domains</span>
        <span className="text-gray-500">Medical References: 2 guidelines</span>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-indigo-50/60 px-3 py-2 dark:bg-indigo-950/40">
        <span className="text-xs text-gray-700 dark:text-gray-300">Confidence breakdown</span>
        <ConfidenceBadge confidence={system.aiConfidence} />
      </div>
    </div>
  )
}
