import React from 'react'
import { SectionForm } from './SectionForm'
import type { WomenHealthData } from '../../types/wizard'

interface WomenHealthSectionProps {
  data: WomenHealthData
  onChange: (value: WomenHealthData) => void
}

export function WomenHealthSection({ data, onChange }: WomenHealthSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Women&apos;s Health</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Capture women-specific reproductive and hormonal health information.</p>
      <SectionForm sectionKey="women_health" data={data} onChange={onChange} />
    </div>
  )
}
