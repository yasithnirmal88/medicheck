import React from 'react'
import { SectionForm } from './SectionForm'
import type { MenHealthData } from '../../types/wizard'

interface MenHealthSectionProps {
  data: MenHealthData
  onChange: (value: MenHealthData) => void
}

export function MenHealthSection({ data, onChange }: MenHealthSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Men&apos;s Health</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Capture men-specific urological and hormonal health details.</p>
      <SectionForm sectionKey="men_health" data={data} onChange={onChange} />
    </div>
  )
}
