import api from '@/lib/api'

export const fetchReports = async (limit = 50, offset = 0) => {
  const res = await api.get('/report', { params: { limit, offset } })
  return res.data
}

export const compareReports = async (id1: string, id2: string) => {
  const res = await api.get(`/report/compare/${id1}/${id2}`)
  return res.data
}

// Consolidated timeline events: combine reports, lab reports, assessment sessions, and profile updates
export const fetchTimelineEvents = async (limit = 50, offset = 0) => {
  // Fetch multiple resources in parallel
  const [reportsRes, labsRes, sessionsRes, profileRes] = await Promise.all([
    api.get('/report', { params: { limit, offset } }),
    api.get('/profiles/me/lab-reports'),
    api.get('/questionnaires/sessions'),
    api.get('/profiles/me'),
  ])

  const reports = reportsRes?.data ?? []
  const labs = labsRes?.data ?? []
  const sessions = sessionsRes?.data ?? []
  const profile = profileRes?.data ?? null

  type TimelineEvent = {
    id: string
    type: 'report' | 'lab' | 'assessment' | 'profile'
    time?: string
    title: string
    summary?: string
    payload?: any
  }

  const events: TimelineEvent[] = []

  for (const r of reports) {
    events.push({
      id: `report-${r.id}`,
      type: 'report',
      time: r.created_at ?? r.started_at ?? undefined,
      title: 'Health Report',
      summary: r.summary ?? '',
      payload: r,
    })
  }

  for (const l of labs) {
    events.push({
      id: `lab-${l.id}`,
      type: 'lab',
      time: l.date ?? l.created_at ?? undefined,
      title: l.test_name ?? 'Laboratory Report',
      summary: l.notes ?? '',
      payload: l,
    })
  }

  for (const s of sessions) {
    events.push({
      id: `session-${s.id}`,
      type: 'assessment',
      time: s.completed_at ?? s.started_at ?? s.created_at ?? undefined,
      title: 'Assessment Session',
      summary: s.status ?? '',
      payload: s,
    })
  }

  if (profile) {
    events.push({
      id: `profile-${profile.id}`,
      type: 'profile',
      time: profile.updated_at ?? profile.created_at ?? undefined,
      title: 'Profile Update',
      summary: 'Patient profile updated',
      payload: profile,
    })
  }

  // Sort by time desc (newest first). Items without time go to the end.
  events.sort((a, b) => {
    const ta = a.time ? new Date(a.time).getTime() : 0
    const tb = b.time ? new Date(b.time).getTime() : 0
    return tb - ta
  })

  return events.slice(offset, offset + limit)
}
