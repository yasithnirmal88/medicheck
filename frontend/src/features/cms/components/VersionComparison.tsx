import React from 'react'

type Meta = {
  version?: number
  author?: string | null
  created_at?: string | null
  status?: string | null
  reason?: string | null
}

type DiffItem = {
  key: string
  current: unknown
  previous: unknown
  changed: boolean
}

function isObject(v: unknown) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function findIdKey(obj: any): string | null {
  if (!isObject(obj)) return null
  const keys = Object.keys(obj)
  const idKeys = ['id', 'uuid', 'code', 'slug']
  for (const k of idKeys) {
    if (keys.includes(k)) return k
  }
  return null
}

function arrayDiffById(cur: any[], prev: any[]) {
  const curMap = new Map<string, any>()
  const prevMap = new Map<string, any>()

  const idKey = (cur && cur.length && findIdKey(cur[0])) || (prev && prev.length && findIdKey(prev[0])) || null

  if (idKey) {
    cur.forEach((it) => curMap.set(String((it as any)[idKey]), it))
    prev.forEach((it) => prevMap.set(String((it as any)[idKey]), it))

    const added = cur.filter((it) => !prevMap.has(String((it as any)[idKey])))
    const removed = prev.filter((it) => !curMap.has(String((it as any)[idKey])))
    const common = cur.filter((it) => prevMap.has(String((it as any)[idKey])))
    return { added, removed, common, idKey }
  }

  // fallback to stringify diff
  const curSet = new Set(cur.map((v) => JSON.stringify(v)))
  const prevSet = new Set(prev.map((v) => JSON.stringify(v)))
  const added = cur.filter((v) => !prevSet.has(JSON.stringify(v)))
  const removed = prev.filter((v) => !curSet.has(JSON.stringify(v)))
  return { added, removed, common: [], idKey: null }
}

export function VersionComparison({
  current,
  previous,
  metaCurrent,
  metaPrevious,
  groups,
}: {
  current: Record<string, unknown>
  previous: Record<string, unknown>
  metaCurrent?: Meta
  metaPrevious?: Meta
  groups?: { title: string; keys: string[] }[]
}) {
  const allKeys = Array.from(new Set([...Object.keys(current || {}), ...Object.keys(previous || {})]))

  const grouped: Record<string, string[]> = {}
  const groupedKeys = new Set<string>()
  if (groups && groups.length) {
    for (const g of groups) {
      grouped[g.title] = []
      for (const k of g.keys) {
        if (allKeys.includes(k)) {
          grouped[g.title].push(k)
          groupedKeys.add(k)
        }
      }
    }
  }

  const otherKeys = allKeys.filter((k) => !groupedKeys.has(k)).sort()

  function computeDiffForKey(key: string): DiffItem {
    const cur = (current || {})[key]
    const prev = (previous || {})[key]
    const changed = JSON.stringify(cur) !== JSON.stringify(prev)
    return { key, current: cur, previous: prev, changed }
  }

  const sections: { title: string; items: DiffItem[] }[] = []
  if (groups && groups.length) {
    for (const g of groups) {
      const items = g.keys.filter((k) => allKeys.includes(k)).map(computeDiffForKey)
      if (items.length) sections.push({ title: g.title, items })
    }
  }
  if (otherKeys.length) {
    sections.push({ title: 'Other', items: otherKeys.map(computeDiffForKey) })
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-3 bg-white dark:bg-slate-900">
          <h5 className="text-sm font-semibold">Current Version</h5>
          <p className="text-xs text-slate-500">v{metaCurrent?.version} • {metaCurrent?.author ?? 'unknown'}</p>
          <p className="text-xs text-slate-400">{metaCurrent?.created_at ? new Date(metaCurrent.created_at).toLocaleString() : ''}</p>
          {metaCurrent?.reason && <p className="text-xs mt-2 text-slate-600">{metaCurrent.reason}</p>}
        </div>
        <div className="rounded-lg border p-3 bg-white dark:bg-slate-900">
          <h5 className="text-sm font-semibold">Selected Version</h5>
          <p className="text-xs text-slate-500">v{metaPrevious?.version} • {metaPrevious?.author ?? 'unknown'}</p>
          <p className="text-xs text-slate-400">{metaPrevious?.created_at ? new Date(metaPrevious.created_at).toLocaleString() : ''}</p>
          {metaPrevious?.reason && <p className="text-xs mt-2 text-slate-600">{metaPrevious.reason}</p>}
        </div>
      </div>

      {sections.map((sec) => (
        <div key={sec.title} className="mb-4">
          <h4 className="text-sm font-semibold mb-2">{sec.title}</h4>
          <div className="grid gap-3">
            {sec.items.map((it) => (
              <div key={it.key} className={`p-3 rounded-xl border ${it.changed ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-100 dark:border-slate-800 bg-transparent'}`}>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">{it.key}</p>
                {Array.isArray(it.current) || Array.isArray(it.previous) ? (
                  (() => {
                    const curArr = Array.isArray(it.current) ? it.current : []
                    const prevArr = Array.isArray(it.previous) ? it.previous : []
                    const { added, removed, common, idKey } = arrayDiffById(curArr as any[], prevArr as any[])
                    return (
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-500">Current</p>
                          <div className="mt-1 space-y-1">
                            {added.length ? <div className="text-sm text-emerald-700">Added:</div> : null}
                            {added.map((a, i) => (
                              <div key={i} className="text-sm text-emerald-700">• {idKey ? String((a as any)[idKey]) + ' — ' + ((a as any).name ?? (a as any).title ?? '') : String(a)}</div>
                            ))}
                            {!added.length && !removed.length && (curArr.map((c, i) => (
                              <div key={i} className="text-sm">• {idKey ? String((c as any)[idKey]) + ' — ' + ((c as any).name ?? (c as any).title ?? '') : String(c)}</div>
                            )))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Selected Version</p>
                          <div className="mt-1 space-y-1">
                            {removed.length ? <div className="text-sm text-rose-600">Removed:</div> : null}
                            {removed.map((r, i) => (
                              <div key={i} className="text-sm text-rose-600">• {idKey ? String((r as any)[idKey]) + ' — ' + ((r as any).name ?? (r as any).title ?? '') : String(r)}</div>
                            ))}
                            {!added.length && !removed.length && (prevArr.map((p, i) => (
                              <div key={i} className="text-sm">• {idKey ? String((p as any)[idKey]) + ' — ' + ((p as any).name ?? (p as any).title ?? '') : String(p)}</div>
                            )))}
                          </div>
                        </div>
                      </div>
                    )
                  })()
                ) : isObject(it.current) || isObject(it.previous) ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <pre className="text-sm whitespace-pre-wrap text-slate-900 dark:text-slate-100">{JSON.stringify(it.current ?? {}, null, 2)}</pre>
                    <pre className="text-sm whitespace-pre-wrap text-slate-900 dark:text-slate-100">{JSON.stringify(it.previous ?? {}, null, 2)}</pre>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="text-sm text-slate-900 dark:text-white">{String(it.current ?? '—')}</div>
                    <div className="text-sm text-slate-900 dark:text-white">{String(it.previous ?? '—')}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default VersionComparison
