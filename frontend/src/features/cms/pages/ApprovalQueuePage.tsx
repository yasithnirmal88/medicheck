import React, { useState } from 'react'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { ContentLayout, Tabs, StatusBadge, EmptyState, TableSkeleton, FormField } from '../components/ContentLayout'
import ReviewDialog from '../components/ReviewDialog'
import ApprovalDialog from '../components/ApprovalDialog'
import { useApprovals, useReviews, usePublishingJobs, useChangeRequests, useApproveJob } from '../hooks/useCmsQueries'
import { cmsApi } from '../api/cmsApi'
import type { Approval, Review, PublishingJob, ChangeRequest } from '../types'

const approvalTabs = [
  { id: 'pending', label: 'Pending Approvals' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'jobs', label: 'Publishing Jobs' },
  { id: 'changes', label: 'Change Requests' },
]

export const ApprovalQueuePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending')
  const [reviewDialogTarget, setReviewDialogTarget] = useState<{
    id: string
    action: 'reject' | 'request_changes'
    entity_type?: string
    entity_id?: string
  } | null>(null)
  const [approvalDialogTarget, setApprovalDialogTarget] = useState<string | null>(null)
  const [completeReviewTarget, setCompleteReviewTarget] = useState<string | null>(null)

  const { data: approvals, isLoading: approvalsLoading } = useApprovals()
  const { data: reviews, isLoading: reviewsLoading } = useReviews()
  const { data: jobs, isLoading: jobsLoading } = usePublishingJobs()
  const { data: changeRequests, isLoading: changesLoading } = useChangeRequests()
  const approveJob = useApproveJob()

  const handleApprove = async (id: string, comment?: string) => {
    try {
      await cmsApi.publishing.approveEntity(id, comment)
      toast.success('Approved')
      setApprovalDialogTarget(null)
    } catch {
      toast.error('Failed to approve')
    }
  }

  const handleReviewSubmit = async (payload: {
    reason: string
    clinicalNotes?: string
    suggestedImprovements?: string
    evidenceReferences?: string[]
    severity?: 'low' | 'medium' | 'high'
  }) => {
    if (!reviewDialogTarget) return
    try {
      if (reviewDialogTarget.action === 'reject') {
        // Reject the approval with the required reason
        await cmsApi.publishing.rejectApproval(reviewDialogTarget.id, payload.reason)
        // Attach detailed reviewer notes as an approval comment for traceability
        const commentParts: string[] = []
        if (payload.clinicalNotes) commentParts.push(`Clinical notes: ${payload.clinicalNotes}`)
        if (payload.suggestedImprovements) commentParts.push(`Suggested improvements: ${payload.suggestedImprovements}`)
        if (payload.evidenceReferences && payload.evidenceReferences.length) commentParts.push(`Evidence references: ${payload.evidenceReferences.join('; ')}`)
        if (payload.severity) commentParts.push(`Severity: ${payload.severity}`)
        if (commentParts.length) {
          await cmsApi.publishing.addApprovalComment(reviewDialogTarget.id, commentParts.join('\n'))
        }
      } else {
        // For request_changes, create a change request and include structured reviewer info in the description
        const descriptionParts: string[] = []
        if (payload.clinicalNotes) descriptionParts.push(`Clinical notes:\n${payload.clinicalNotes}`)
        if (payload.suggestedImprovements) descriptionParts.push(`Suggested improvements:\n${payload.suggestedImprovements}`)
        if (payload.evidenceReferences && payload.evidenceReferences.length) descriptionParts.push(`Evidence references: ${payload.evidenceReferences.join('; ')}`)
        if (payload.severity) descriptionParts.push(`Severity: ${payload.severity}`)

        await cmsApi.publishing.createChangeRequest({
          entity_type: reviewDialogTarget.entity_type,
          entity_id: reviewDialogTarget.entity_id,
          title: payload.suggestedImprovements || 'Requested changes',
          description: descriptionParts.join('\n\n') || payload.reason || 'Requested changes',
          changes: {},
          reason: payload.reason,
        })
      }
      toast.success('Submitted')
      setReviewDialogTarget(null)
    } catch (err) {
      toast.error('Failed to submit')
    }
  }

  const handleCompleteReview = async (id: string) => {
    try {
      await cmsApi.publishing.completeReview(id, 'completed')
      toast.success('Review completed')
      setCompleteReviewTarget(null)
    } catch { toast.error('Failed to complete review') }
  }

  const handleExecutePublish = async (id: string) => {
    try {
      await cmsApi.publishing.executePublish(id)
      toast.success('Published')
    } catch { toast.error('Failed to publish') }
  }

  return (
    <ContentLayout title="Approval Queue" description="Manage approvals, reviews, publishing, and change requests">
      <Tabs tabs={approvalTabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'pending' && (
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600" /> Pending Approvals</h3>
          {approvalsLoading ? <TableSkeleton /> : !approvals?.length ? <EmptyState title="No pending approvals" /> : (
            <div className="space-y-3">
              {approvals.map((a) => (
                <div key={a.id} className="flex items-start justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={a.status} />
                      <span className="font-mono text-xs text-slate-500">{a.entity_type}</span>
                    </div>
                    <p className="text-sm text-slate-900 dark:text-white">Entity: <span className="font-mono text-xs">{a.entity_id}</span></p>
                    <p className="text-xs text-slate-500">Requested by: {a.requested_by}{a.comments?.length ? ` — ${a.comments[0].comment}` : ''}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setApprovalDialogTarget(a.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                                        <button onClick={() => setReviewDialogTarget({ id: a.id, action: 'reject', entity_type: a.entity_type, entity_id: a.entity_id })} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Reviews</h3>
          {reviewsLoading ? <TableSkeleton /> : !reviews?.length ? <EmptyState title="No reviews" /> : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="flex items-start justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={r.status} />
                      <span className="text-xs text-slate-500">{r.review_type}</span>
                    </div>
                    <p className="text-sm text-slate-900 dark:text-white">{r.entity_type} — <span className="font-mono text-xs">{r.entity_id}</span></p>
                    <p className="text-xs text-slate-500">Reviewer: {r.reviewer_id}</p>
                  </div>
                  {r.status === 'pending' && (
                    <button onClick={() => setCompleteReviewTarget(r.id)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition">
                      Complete Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-purple-600" /> Publishing Jobs</h3>
          {jobsLoading ? <TableSkeleton /> : !jobs?.length ? <EmptyState title="No publishing jobs" /> : (
            <div className="space-y-3">
              {jobs.map((j) => (
                <div key={j.id} className="flex items-start justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={j.status} />
                      <span className="text-xs text-slate-500">v{j.version}</span>
                    </div>
                    <p className="text-sm text-slate-900 dark:text-white">{j.entity_type} — <span className="font-mono text-xs">{j.entity_id}</span></p>
                    <p className="text-xs text-slate-500">Requested by: {j.requested_by}</p>
                  </div>
                  {j.status === 'approved' && (
                    <button onClick={() => handleExecutePublish(j.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition">
                      Publish
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'changes' && (
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600" /> Change Requests</h3>
          {changesLoading ? <TableSkeleton /> : !changeRequests?.length ? <EmptyState title="No change requests" /> : (
            <div className="space-y-3">
              {changeRequests.map((cr) => (
                <div key={cr.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={cr.status} />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{cr.title}</span>
                  </div>
                  <p className="text-xs text-slate-500">{cr.entity_type} — <span className="font-mono">{cr.entity_id}</span> | Requested by: {cr.requested_by}</p>
                  {cr.description && <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{cr.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ReviewDialog
        open={!!reviewDialogTarget}
        onClose={() => setReviewDialogTarget(null)}
        action={reviewDialogTarget?.action || 'reject'}
        onSubmit={handleReviewSubmit}
      />

      <ApprovalDialog
        open={!!approvalDialogTarget}
        onClose={() => setApprovalDialogTarget(null)}
        approvalId={approvalDialogTarget}
        onApprove={(comment) => {
          if (!approvalDialogTarget) {
            return Promise.resolve()
          }
          return handleApprove(approvalDialogTarget, comment)
        }}
      />
    </ContentLayout>
  )
}
