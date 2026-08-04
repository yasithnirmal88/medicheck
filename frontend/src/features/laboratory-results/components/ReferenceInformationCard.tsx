import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import type { ReferenceInfo } from '../types'

interface ReferenceInformationCardProps {
  reference: ReferenceInfo
}

export const ReferenceInformationCard: React.FC<ReferenceInformationCardProps> = ({ reference }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
          <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{reference.testName}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Reference Information</p>
        </div>
      </div>

      <div className="space-y-4">
        <Section title="Purpose" icon={Info}>
          <p className="text-sm text-slate-600 dark:text-slate-300">{reference.purpose}</p>
        </Section>

        <Section title="Normal Function" icon={CheckCircle}>
          <p className="text-sm text-slate-600 dark:text-slate-300">{reference.normalFunction}</p>
        </Section>

        <Section title="Reference Range" icon={Info}>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{reference.referenceRange}</p>
        </Section>

        <Section title="Preparation Instructions" icon={AlertTriangle}>
          <ul className="space-y-1">
            {reference.preparationInstructions.map((instruction, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                {instruction}
              </li>
            ))}
          </ul>
        </Section>

        <div className="grid gap-4 sm:grid-cols-2">
          <Section title="Causes of High Values" icon={AlertTriangle}>
            <ul className="space-y-1">
              {reference.causesOfHigh.map((cause, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                  {cause}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Causes of Low Values" icon={AlertTriangle}>
            <ul className="space-y-1">
              {reference.causesOfLow.map((cause, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                  {cause}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title="Lifestyle Effects" icon={Info}>
          <ul className="space-y-1">
            {reference.lifestyleEffects.map((effect, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                {effect}
              </li>
            ))}
          </ul>
        </Section>
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

export default ReferenceInformationCard
