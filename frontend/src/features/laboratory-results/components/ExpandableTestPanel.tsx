import React from 'react'
import { motion } from 'framer-motion'
import { Info, AlertTriangle, BookOpen, Activity, Pill, Stethoscope, Lightbulb } from 'lucide-react'
import type { LabTestResult } from '../types'

interface ExpandableTestPanelProps {
  test: LabTestResult
}

export const ExpandableTestPanel: React.FC<ExpandableTestPanelProps> = ({ test }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-4">
            <Section title="Description" icon={Info}>
              <p className="text-sm text-slate-600 dark:text-slate-300">{test.description}</p>
            </Section>

            <Section title="Purpose" icon={BookOpen}>
              <p className="text-sm text-slate-600 dark:text-slate-300">{test.purpose}</p>
            </Section>

            <Section title="Why It Matters" icon={AlertTriangle}>
              <p className="text-sm text-slate-600 dark:text-slate-300">{test.whyItMatters}</p>
            </Section>

            <Section title="Clinical Interpretation" icon={Stethoscope}>
              <p className="text-sm text-slate-600 dark:text-slate-300">{test.clinicalInterpretation}</p>
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {test.possibleCauses && test.possibleCauses.length > 0 && (
              <Section title="Possible Causes" icon={Lightbulb}>
                <ul className="space-y-1">
                  {test.possibleCauses.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                      {cause}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {test.lifestyleFactors && test.lifestyleFactors.length > 0 && (
              <Section title="Lifestyle Factors" icon={Activity}>
                <ul className="space-y-1">
                  {test.lifestyleFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {test.recommendations && test.recommendations.length > 0 && (
              <Section title="Recommendations" icon={Pill}>
                <ul className="space-y-1">
                  {test.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {test.relatedSymptoms && test.relatedSymptoms.length > 0 && (
              <Section title="Related Symptoms" icon={AlertTriangle}>
                <div className="flex flex-wrap gap-2">
                  {test.relatedSymptoms.map((symptom, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </h4>
      {children}
    </div>
  )
}

export default ExpandableTestPanel
