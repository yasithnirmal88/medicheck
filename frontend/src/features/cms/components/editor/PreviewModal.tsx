import React from 'react'
import { Modal } from '../ContentLayout'
import { StatusBadge } from '../ContentLayout'
import type { FieldDefinition } from '../../types'

interface PreviewModalProps {
  open: boolean
  onClose: () => void
  entityType: string
  entityLabel: string
  data: Record<string, unknown>
  fields: FieldDefinition[]
  status?: string
  version?: number
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  entityType,
  entityLabel,
  data,
  fields,
  status,
  version,
}) => {
  const formatValue = (field: FieldDefinition, value: unknown): string => {
    if (value === null || value === undefined || value === '') return '—'
    if (field.type === 'boolean') return value ? 'Yes' : 'No'
    if (field.type === 'select' && field.options) {
      const opt = field.options.find((o) => o.value === value)
      return opt?.label || String(value)
    }
    if (field.type === 'number') return String(value)
    return String(value)
  }

  const primaryField = fields.find((f) => f.required)
  const title = primaryField ? formatValue(primaryField, data[primaryField.name]) : `New ${entityLabel}`

  return (
    <Modal open={open} onClose={onClose} title="Preview" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {entityLabel}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {status && <StatusBadge status={status} />}
            {version !== undefined && (
              <span className="text-xs text-slate-400 dark:text-slate-500">v{version}</span>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {fields.map((field) => {
            const value = data[field.name]
            if (value === null || value === undefined || value === '') return null
            if (field.name === 'status') return null

            return (
              <div key={field.name} className="border-b border-slate-100 dark:border-slate-800 pb-3 last:border-b-0">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {field.label}
                </dt>
                <dd className={cn(
                  'text-sm',
                  field.type === 'textarea'
                    ? 'text-slate-700 dark:text-slate-300 whitespace-pre-wrap'
                    : 'text-slate-900 dark:text-white font-medium',
                )}>
                  {formatValue(field, value)}
                </dd>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </Modal>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
