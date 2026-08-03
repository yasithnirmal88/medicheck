import React, { useState } from 'react'
import { Modal, FormField } from './ContentLayout'

interface ApprovalDialogProps {
  open: boolean
  onClose: () => void
  approvalId: string | null
  onApprove: (comment?: string) => Promise<void>
}

export const ApprovalDialog: React.FC<ApprovalDialogProps> = ({ open, onClose, approvalId, onApprove }) => {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    setLoading(true)
    try {
      await onApprove(comment || undefined)
      onClose()
    } catch (err) {
      setError('Approval failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Approve Item" size="md">
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">You are about to approve this item. Optionally add a note to be recorded with the approval.</p>
        <FormField label="Reviewer notes">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
            placeholder="Optional note for the approval record"
          />
        </FormField>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">Cancel</button>
          <button onClick={submit} disabled={loading || !approvalId} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50">
            {loading ? 'Approving...' : 'Approve'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ApprovalDialog
