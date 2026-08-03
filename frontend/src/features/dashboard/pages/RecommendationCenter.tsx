import React, { useMemo } from 'react'
import AppLayout from '@/layouts/AppLayout'
import Card from '@/shared/ui/Card'
import { useDashboardDerived } from '../hooks/useDashboard'
import type { GeneratedAdvice } from '../types'

const CATEGORIES = ['Nutrition', 'Exercise', 'Lifestyle', 'Preventive Care', 'Medical'] as const

function renderAdviceText(a: GeneratedAdvice) {
  return a.text || ''
}

export default function RecommendationCenter() {
  const derived = useDashboardDerived()
  const report = derived.latestReport

  const advices: GeneratedAdvice[] = useMemo(() => {
    if (!report) return []
    // Support both shapes: report.advices and backend 'generated_advices'
    const raw: any[] = (report as any).advices ?? (report as any).generated_advices ?? []
    return raw.map((r) => ({
      id: String(r.id ?? r._id ?? Math.random()),
      assessment_id: r.assessment_id ?? r.session_id ?? undefined,
      recommendation_id: r.recommendation_id ?? undefined,
      category: r.category ?? r.category_name ?? '',
      text: r.text ?? r.advice ?? r.summary ?? '',
      created_at: r.created_at ?? r.createdAt ?? undefined,
    }))
  }, [report])

  const grouped = useMemo(() => {
    const map: Record<string, GeneratedAdvice[]> = {}
    for (const cat of CATEGORIES) map[cat] = []
    // Put any unknown categories into 'Medical'
    for (const a of advices) {
      const cat = (a.category || '').trim()
      if (!cat) {
        map['Medical'].push(a)
        continue
      }
      const normalized = CATEGORIES.find((c) => c.toLowerCase() === cat.toLowerCase())
      if (normalized) map[normalized].push(a)
      else map['Medical'].push(a)
    }
    return map
  }, [advices])

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Recommendation Center</h1>

        {!report ? (
          <Card>
            <div className="text-sm text-gray-500">No report available. Run an assessment to generate recommendations.</div>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <div className="mb-2 text-sm text-slate-500">Report summary</div>
              <div className="text-sm text-slate-800">{report.summary ?? 'No summary available'}</div>
            </Card>

            {CATEGORIES.map((cat) => (
              <Card key={cat}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-medium">{cat}</h2>
                  <div className="text-sm text-slate-500">{grouped[cat]?.length ?? 0} items</div>
                </div>

                {grouped[cat]?.length ? (
                  <ul className="space-y-3">
                    {grouped[cat].map((a) => (
                      <li key={a.id} className="text-sm text-slate-800">
                        {renderAdviceText(a)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-500">No recommendations in this category.</div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
