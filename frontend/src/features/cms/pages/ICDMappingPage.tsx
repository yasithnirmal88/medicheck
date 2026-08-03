import React from 'react'
import { ContentLayout, TableSkeleton } from '../components/ContentLayout'
import { useContentList } from '../hooks/useCmsQueries'
import Button from '@/shared/ui/Button'

export const ICDMappingPage: React.FC = () => {
  const { data, isLoading } = useContentList('disease', { limit: 1000 })
  const items = data?.items ?? []
  const mapped = items.filter((d: any) => d.icd10_code)

  function exportCsv() {
    const rows = [['id','name','icd10_code','body_system_id']]
    for (const d of mapped) rows.push([d.id, d.name, d.icd10_code || '', d.body_system_id || ''])
    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'icd_mappings.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <ContentLayout title="ICD Mappings" description="List of diseases with ICD-10 codes">
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={exportCsv}>Export CSV</Button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {mapped.map((d: any) => (
              <div key={d.id} className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">{d.name}</div>
                  <div className="text-xs text-slate-500">ICD-10: <span className="font-mono">{d.icd10_code}</span></div>
                </div>
                <div className="text-xs text-slate-400">{d.body_system_id ?? '—'}</div>
              </div>
            ))}
            {mapped.length === 0 && <p className="text-sm text-slate-500">No ICD mappings found.</p>}
          </div>
        </div>
      )}
    </ContentLayout>
  )
}

export default ICDMappingPage
