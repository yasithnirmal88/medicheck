import React, { useState } from 'react'
import { Modal, FormField } from './ContentLayout'

export type ReviewPayload = {
  reason: string
  clinicalNotes?: string
  suggestedImprovements?: string
  evidenceReferences?: string[]
  severity?: 'low' | 'medium' | 'high'
}

interface ReviewDialogProps {
  open: boolean
  onClose: () => void
  action: 'reject' | 'request_changes'
  onSubmit: (payload: ReviewPayload) => Promise<void>
  initial?: Partial<ReviewPayload>
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({ open, onClose, action, onSubmit, initial = {} }) => {
  const [reason, setReason] = useState(initial.reason || '')
  const [clinicalNotes, setClinicalNotes] = useState(initial.clinicalNotes || '')
  const [suggestedImprovements, setSuggestedImprovements] = useState(initial.suggestedImprovements || '')
  const [evidence, setEvidence] = useState((initial.evidenceReferences || []).join(', '))
  const [severity, setSeverity] = useState<ReviewPayload['severity']>(initial.severity || 'medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    if (!reason.trim()) {
      setError('Reason is required')
      return
    }
    setLoading(true)
    try {
      await onSubmit({
        reason: reason.trim(),
        clinicalNotes: clinicalNotes.trim() || undefined,
        suggestedImprovements: suggestedImprovements.trim() || undefined,
        evidenceReferences: evidence.split(',').map((s) => s.trim()).filter(Boolean),
        severity,
      })
      onClose()
    } catch (err) {
      setError('Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={action === 'reject' ? 'Reject Approval' : 'Request Changes'} size="md">
      <div className="space-y-4">
        <FormField label={action === 'reject' ? 'Reason for rejection' : 'Reason (required)'} required>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
            placeholder={action === 'reject' ? 'Provide the reason for rejection' : 'Describe what needs to change'}
          />
        </FormField>

        <FormField label="Clinical notes">
          <textarea
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
            placeholder="Optional clinical notes for the author"
          />
        </FormField>

        <FormField label="Suggested improvements">
          <textarea
            value={suggestedImprovements}
            onChange={(e) => setSuggestedImprovements(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
            placeholder="Optional suggested edits or steps to address the issues"
          />
        </FormField>

        <FormField label="Evidence references (comma separated)">
          <input
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
            placeholder="e.g. PMID:12345, DOI:10.1000/xyz"
          />
        </FormField>

        <FormField label="Severity">
          <select value={severity} onChange={(e) => setSeverity(e.target.value as any)} className="px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </FormField>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">Cancel</button>
          <button onClick={submit} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">
            {loading ? 'Submitting...' : action === 'reject' ? 'Reject' : 'Request Changes'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ReviewDialog
