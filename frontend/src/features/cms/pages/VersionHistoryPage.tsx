import React, { useState } from 'react'
import { History, GitCompare, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { ContentLayout, StatusBadge, EmptyState, TableSkeleton, FormField } from '../components/ContentLayout'
import { useSnapshots, usePublishingJobs, useRollbackJob } from '../hooks/useCmsQueries'
import VersionComparison from '../components/VersionComparison'
import { useQueryClient } from '@tanstack/react-query'
import type { VersionSnapshot } from '../types'

export const VersionHistoryPage: React.FC = () => {
  const [entityType, setEntityType] = useState('')
  const [entityId, setEntityId] = useState('')
  const [compareFrom, setCompareFrom] = useState<string | null>(null)
  const [compareTo, setCompareTo] = useState<string | null>(null)
  const [showRollbackModal, setShowRollbackModal] = useState(false)
  const [rollbackTarget, setRollbackTarget] = useState<VersionSnapshot | null>(null)
  const [rollbackReason, setRollbackReason] = useState('')

  const snapshotsQuery = useSnapshots(entityType, entityId)
  const snapshots = snapshotsQuery.data
  const isLoading = snapshotsQuery.isLoading

  const fromSnapshot = snapshots?.find((s) => s.id === compareFrom)
  const toSnapshot = snapshots?.find((s) => s.id === compareTo)

  const diffs: { field: string; old_value: unknown; new_value: unknown }[] = []
  if (fromSnapshot && toSnapshot && compareFrom !== compareTo) {
    const fromData = fromSnapshot.snapshot ?? {}
    const toData = toSnapshot.snapshot ?? {}
    const allKeys = new Set([...Object.keys(fromData), ...Object.keys(toData)])
    for (const key of allKeys) {
      const oldVal = JSON.stringify(fromData[key as keyof typeof fromData])
      const newVal = JSON.stringify(toData[key as keyof typeof toData])
      if (oldVal !== newVal) {
        diffs.push({ field: key, old_value: fromData[key as keyof typeof fromData], new_value: toData[key as keyof typeof toData] })
      }
    }
  }

  const qc = useQueryClient()
  const publishingJobsQuery = usePublishingJobs(undefined, entityType)
  const rollbackMutation = useRollbackJob()

  const performRollback = async () => {
    if (!rollbackTarget) return
    if (!entityType || !entityId) return
    try {
      // Find a suitable publishing job for this entity
      const jobs = publishingJobsQuery.data || []
      const job = jobs.find((j) => j.entity_id === entityId) || jobs[0]
      if (!job) {
        toast.error('No publishing job found for this entity')
        return
      }
      await rollbackMutation.mutateAsync({ id: job.id, version: rollbackTarget.version })
      // Optionally record reason as a snapshot note (if API supports createSnapshot); skip if not available
      // Refresh snapshots
      await snapshotsQuery.refetch()
      setShowRollbackModal(false)
      setRollbackReason('')
      toast.success('Rollback executed. A new version was created.')
    } catch (err) {
      toast.error('Rollback failed')
    }
  }

  return (
    <ContentLayout title="Version History" description="Browse snapshots, compare versions, and roll back content">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600" /> Search Snapshots
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Entity Type">
            <input
              type="text"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              placeholder="e.g. question"
              className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
            />
          </FormField>
          <FormField label="Entity ID">
            <input
              type="text"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              placeholder="Entity UUID"
              className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
            />
          </FormField>
        </div>
      </div>

      {entityType && entityId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Snapshots</h3>
            {isLoading ? (
              <TableSkeleton />
            ) : !snapshots?.length ? (
              <EmptyState title="No snapshots" description="No version snapshots found for this entity" />
            ) : (
              <div className="space-y-3">
                {snapshots.map((s) => (
                  <div key={s.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-semibold">
                          v{s.version}
                        </span>
                        <StatusBadge status={s.snapshot_type} />
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setCompareFrom(compareFrom === s.id ? null : s.id)}
                          className={`px-2 py-1 text-xs rounded transition ${compareFrom === s.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'}`}
                        >
                          From
                        </button>
                        <button
                          onClick={() => setCompareTo(compareTo === s.id ? null : s.id)}
                          className={`px-2 py-1 text-xs rounded transition ${compareTo === s.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'}`}
                        >
                          To
                        </button>
                        <button
                          onClick={() => { setRollbackTarget(s); setShowRollbackModal(true); }}
                          className="px-2 py-1 text-xs rounded bg-amber-100 dark:bg-amber-900/20 text-amber-700 hover:bg-amber-200 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5 inline-block mr-1" /> Rollback
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      {s.reason ? `Reason: ${s.reason}` : ''} | By: {s.created_by ?? 'system'} | {s.created_at ? new Date(s.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-blue-600" /> Compare
            </h3>
            {!compareFrom || !compareTo ? (
              <EmptyState title="Select two versions" description="Choose a From and To version on each snapshot card" />
            ) : compareFrom === compareTo ? (
              <EmptyState title="Same version" description="Select two different versions to compare" />
            ) : !diffs.length ? (
              <EmptyState title="No differences" description="The selected versions are identical" />
            ) : (
              <div className="space-y-3">
                {/* Use the reusable VersionComparison component for a readable comparison */}
                <VersionComparison
                  current={(snapshots.find((s) => s.id === compareTo)?.snapshot as Record<string, unknown>) || {}}
                  previous={(snapshots.find((s) => s.id === compareFrom)?.snapshot as Record<string, unknown>) || {}}
                  metaCurrent={snapshots.find((s) => s.id === compareTo) ? { version: snapshots.find((s) => s.id === compareTo)!.version, author: snapshots.find((s) => s.id === compareTo)!.created_by, created_at: snapshots.find((s) => s.id === compareTo)!.created_at, reason: snapshots.find((s) => s.id === compareTo)!.reason } : undefined}
                  metaPrevious={snapshots.find((s) => s.id === compareFrom) ? { version: snapshots.find((s) => s.id === compareFrom)!.version, author: snapshots.find((s) => s.id === compareFrom)!.created_by, created_at: snapshots.find((s) => s.id === compareFrom)!.created_at, reason: snapshots.find((s) => s.id === compareFrom)!.reason } : undefined}
                  groups={[
                    { title: 'General Information', keys: ['name', 'code', 'description', 'body_system_id'] },
                    { title: 'Clinical Information', keys: ['clinical_summary', 'severity', 'evidence_level', 'risk_category'] },
                    { title: 'Symptoms', keys: ['symptoms'] },
                    { title: 'Indicators', keys: ['indicators'] },
                    { title: 'Laboratory Tests', keys: ['laboratory_tests'] },
                    { title: 'Imaging', keys: ['imaging'] },
                    { title: 'Recommendations', keys: ['recommendations'] },
                    { title: 'Evidence', keys: ['references'] },
                    { title: 'Publishing', keys: ['status'] },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {(!entityType || !entityId) && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <EmptyState title="Enter search criteria" description="Provide entity type and entity ID to load version history" icon={<History className="w-8 h-8" />} />
        </div>
      )}

      {/* Rollback modal */}
      {showRollbackModal && rollbackTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Rollback to v{rollbackTarget.version}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Rolling back will create a new version based on the selected snapshot. Please provide a reason for the rollback.</p>
            <div className="mb-4">
              <FormField label="Reason (required)">
                <textarea value={rollbackReason} onChange={(e) => setRollbackReason(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none" />
              </FormField>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowRollbackModal(false); setRollbackReason('') }} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={() => {
                if (!rollbackReason.trim()) { toast.error('Reason is required'); return }
                performRollback()
              }} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">Rollback</button>
            </div>
          </div>
        </div>
      )}

    </ContentLayout>
    )
}
