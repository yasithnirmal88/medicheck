import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, FileText, TestTube, Utensils, Activity, Dumbbell, Bed, Brain, UserRound, ExternalLink } from 'lucide-react'
import Card from '@/features/dashboard/components/Card'
import { cn } from '@/lib/utils'
import { RiskBadge, ConfidenceBadge } from './StatusBadges'
import type { PossibleCondition } from '../types'

const SOURCE_ICON: Record<string, JSX.Element> = {
  questionnaire: <FileText className="h-3.5 w-3.5 text-indigo-500" />,
  lab: <TestTube className="h-3.5 w-3.5 text-amber-500" />,
  lifestyle: <Utensils className="h-3.5 w-3.5 text-emerald-500" />,
  measurement: <Activity className="h-3.5 w-3.5 text-cyan-500" />,
  profile: <UserRound className="h-3.5 w-3.5 text-purple-500" />,
}

export const PossibleConditionsTable = ({ conditions }: { conditions: PossibleCondition[] }) => {
  const [expanded, setExpanded] = useState<string | null>(conditions[0]?.id ?? null)
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead>
          <tr>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Evidence</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Doctor Review</th>
            <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Expand</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {conditions.map((c) => (
            <>
              <tr key={c.id} className="align-top">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{c.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{c.probability}%</td>
                <td className="px-4 py-3"><ConfidenceBadge confidence={c.confidence} /></td>
                <td className="px-4 py-3">{severityPill(c.severity)}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{c.evidenceCount} sources</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                      c.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : c.status === 'active'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700',
                    )}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {c.doctorReviewed ? (
                    <span className="text-xs text-emerald-600">Reviewed</span>
                  ) : (
                    <span className="text-xs text-gray-400">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronDown className={cn('h-4 w-4 transition-transform', expanded === c.id && 'rotate-180')} />
                  </button>
                </td>
              </tr>
              <tr>
                <td colSpan={8} className="p-0">
                  <AnimatePresence initial={false}>
                    {expanded === c.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <ConditionEvidencePanel condition={c} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const severityPill = (s: PossibleCondition['severity']) => {
  const cfg: Record<PossibleCondition['severity'], string> = {
    low: 'bg-emerald-50 text-emerald-700',
    moderate: 'bg-amber-50 text-amber-700',
    high: 'bg-rose-50 text-rose-700',
  }
  return <RiskBadge level={s === 'low' ? 'low' : s === 'moderate' ? 'moderate' : 'high'} />
}

export const ConditionEvidencePanel = ({ condition }: { condition: PossibleCondition }) => {
  const grouped = {
    symptoms: condition.supportingSymptoms,
    riskFactors: condition.clinicalExplanation,
    questionnaire: condition.questionnaireEvidence,
    lab: condition.labEvidence,
    lifestyle: condition.lifestyleEvidence,
    protective: condition.protectiveFactors,
  }
  return (
    <Card className="m-3 rounded-lg border border-slate-200/80 dark:border-slate-700/60 p-4">
      <h4 className="text-xs font-medium text-gray-500 uppercase">Condition Evidence — {condition.name}</h4>

      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Clinical Explanation</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{grouped.riskFactors}</p>

          <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">Symptoms Supporting Prediction</p>
          <ul className="mt-1 list-disc pl-4 text-xs text-gray-600 dark:text-gray-300">
            {grouped.symptoms.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">Protective Factors</p>
          <ul className="mt-1 list-disc pl-4 text-xs text-gray-600 dark:text-gray-300">
            {grouped.protective.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <EvidenceList title="Questionnaire Evidence" items={grouped.questionnaire} color="text-indigo-500" />
          <EvidenceList title="Lab Evidence" items={grouped.lab} color="text-amber-500" />
          <EvidenceList title="Lifestyle Evidence" items={grouped.lifestyle} color="text-emerald-500" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-200">Confidence Breakdown</span>
          {condition.confidenceBreakdown.map((fb) => (
            <div key={fb.name} className="mt-1 flex items-center gap-2">
              <span className="w-24 text-gray-600 dark:text-gray-300">{fb.name}</span>
              <div className="h-2 flex-1 rounded-sm bg-slate-200 dark:bg-slate-700">
                <div className="h-2 w-2/3 rounded-sm bg-indigo-500" />
              </div>
              <span className="w-8 text-right text-gray-600 dark:text-gray-300">{Math.round(fb.weight * 100)}%</span>
            </div>
          ))}
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-200">Recommended Tests</span>
          <ul className="mt-1 list-disc pl-4 text-xs text-gray-600 dark:text-gray-300">
            {condition.recommendedTests.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="mt-2 flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="underline decoration-gray-400">Read educational resource</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function EvidenceList({ title, items, color }: { title: string; items: PossibleCondition['questionnaireEvidence']; color: string }) {
  if (items.length === 0) {
    return (
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-1 text-xs text-gray-400">No direct evidence</p>
      </div>
    )
  }
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <ul className="mt-1 space-y-0.5">
        {items.map((e) => (
          <li key={e.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
              {SOURCE_ICON[e.source] ?? null}
              <span>{e.label}</span>
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{e.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
