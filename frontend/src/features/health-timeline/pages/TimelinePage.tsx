import React, { useState } from 'react'
import AppLayout from '@/layouts/AppLayout'
import Card from '@/shared/ui/Card'
import { useTimelineEvents } from '../hooks/useTimeline'
import { Link } from 'react-router-dom'

export default function TimelinePage() {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc')
  const { data: events, isLoading } = useTimelineEvents(200, 0)

  const sorted = events ? [...events].sort((a: any, b: any) => {
    const da = new Date(a.time || a.created_at || a.started_at || 0).getTime()
    const db = new Date(b.time || b.created_at || b.started_at || 0).getTime()
    return order === 'desc' ? db - da : da - db
  }) : []

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Health Timeline</h1>
          <div>
            <button onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')} className="text-sm text-indigo-600">Order: {order === 'desc' ? 'Newest' : 'Oldest'}</button>
          </div>
        </div>

        <Card>
          {isLoading ? (
            <div>Loading...</div>
          ) : sorted.length === 0 ? (
            <div className="text-sm text-gray-500">No timeline events found.</div>
          ) : (
            <ul className="space-y-3">
              {sorted.map((e: any) => (
                <li key={e.id} className="p-3 border rounded">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{new Date(e.time || e.payload?.created_at || e.payload?.started_at || Date.now()).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{e.type.toUpperCase()}</div>
                      <div className="text-sm mt-2">{e.title}: {e.summary ?? '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Type: {e.type}</div>
                      <div className="mt-2">
                        {e.type === 'report' && <Link to={`/report/${e.payload?.session_id || e.payload?.id}`} className="text-indigo-600">View report</Link>}
                        {e.type === 'assessment' && <Link to={`/assessments/${e.payload?.id}`} className="text-indigo-600">Open assessment</Link>}
                        {e.type === 'lab' && <span className="text-indigo-600">Lab: {e.payload?.test_name}</span>}
                        {e.type === 'profile' && <Link to={`/profile`} className="text-indigo-600">View profile</Link>}
                      </div>
                    </div>
                  </div>

                  {e.type === 'report' && e.payload?.body_systems && (
                    <div className="mt-3 text-sm text-gray-700">
                      <strong>Body Systems:</strong>
                      <div className="mt-1">
                        {e.payload.body_systems.map((b: any) => (
                          <div key={b.id} className="text-xs">{b.body_system_id ?? 'Unknown'} — {b.category}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
