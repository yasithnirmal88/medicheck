import React, { useMemo } from 'react'
import AppLayout from '@/layouts/AppLayout'
import Card from '@/shared/ui/Card'
import { useDashboardDerived, useDashboardReports } from '../hooks/useDashboard'
import { useDashboardLabReports } from '../hooks/useDashboard'
import { Link } from 'react-router-dom'

export default function PatientDashboard() {
  const derived = useDashboardDerived()
  const reportsQuery = useDashboardReports()
  const labReportsQuery = useDashboardLabReports()

  const healthScore = derived.healthScore
  const latestReport = derived.latestReport
  const latestLab = labReportsQuery.data && labReportsQuery.data.length > 0 ? labReportsQuery.data[0] : undefined

  const recommendationSummary = useMemo(() => {
    const raw: any[] = (latestReport as any)?.advices ?? (latestReport as any)?.generated_advices ?? []
    const counts: Record<string, number> = { Nutrition: 0, Exercise: 0, Lifestyle: 0, 'Preventive Care': 0, Medical: 0 }
    for (const r of raw) {
      const cat = (r.category || r.category_name || '').toLowerCase()
      if (cat.includes('nutrition')) counts.Nutrition++
      else if (cat.includes('exercise')) counts.Exercise++
      else if (cat.includes('lifestyle')) counts.Lifestyle++
      else if (cat.includes('prevent') || cat.includes('screen')) counts['Preventive Care']++
      else counts.Medical++
    }
    return counts
  }, [latestReport])

  const nextScreening = useMemo(() => {
    const raw: any[] = (latestReport as any)?.advices ?? (latestReport as any)?.generated_advices ?? []
    const screening = raw.find((r) => {
      const text = (r.text || r.advice || '').toLowerCase()
      return (r.category && String(r.category).toLowerCase().includes('prevent')) || text.includes('screen') || text.includes('mammogram') || text.includes('colonoscopy')
    })
    return screening ? (screening.text || screening.advice) : null
  }, [latestReport])

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Hello{derived.name ? `, ${derived.name}` : ''}</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back &mdash; here&apos;s a snapshot of your health.</p>
            </div>
            <div className="text-right">
              <div className="text-sm">Health score</div>
              <div className="text-2xl font-bold">{healthScore ?? '--'}</div>
              <div className="text-xs text-gray-500">{derived.lastActivity ? new Date(derived.lastActivity).toLocaleString() : ''}</div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <h2 className="text-lg font-medium">Latest report</h2>
            {latestReport ? (
              <div className="mt-2">
                <div className="text-sm">Date: {latestReport.created_at ?? '—'}</div>
                <div className="text-sm">Summary: {latestReport.summary ?? '—'}</div>
                <div className="mt-3">
                  <Link to={`/report/${latestReport.session_id ?? latestReport.id}`} className="text-indigo-600">View report</Link>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500">No recent report</div>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-medium">Next screening</h2>
            <div className="mt-2 text-sm text-gray-700">{nextScreening ?? 'No screening recommended'}</div>
            <div className="mt-3">
              <Link to="/assessments" className="text-indigo-600">View assessments</Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-medium">Latest lab report</h2>
            {latestLab ? (
              <div className="mt-2">
                <div className="text-sm">Test: {latestLab.test_name}</div>
                <div className="text-sm">Date: {latestLab.date ?? latestLab.created_at ?? '—'}</div>
                <div className="mt-3">
                  <Link to="/profile" className="text-indigo-600">View lab reports</Link>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500">No lab reports</div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-base font-medium">Recommendations summary</h3>
            <div className="mt-2 text-sm">
              <ul>
                <li>Nutrition: {recommendationSummary.Nutrition}</li>
                <li>Exercise: {recommendationSummary.Exercise}</li>
                <li>Lifestyle: {recommendationSummary.Lifestyle}</li>
                <li>Preventive Care: {recommendationSummary['Preventive Care']}</li>
                <li>Medical: {recommendationSummary.Medical}</li>
              </ul>
            </div>
            <div className="mt-3">
              <Link to="/recommendations" className="text-indigo-600">Open Recommendation Center</Link>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-medium">Assessment History</h3>
            <div className="mt-2">
              {reportsQuery.data && reportsQuery.data.length > 0 ? (
                <ul className="space-y-2">
                  {reportsQuery.data.slice(0, 5).map((r: any) => (
                    <li key={r.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Report {r.id}</div>
                        <div className="text-xs text-gray-500">{r.created_at ?? '—'}</div>
                      </div>
                      <div>
                        <Link to={`/report/${r.session_id || r.id}`} className="text-indigo-600 text-sm">View</Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">No reports yet</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
