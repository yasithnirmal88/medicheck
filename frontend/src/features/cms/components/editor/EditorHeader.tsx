import React from 'react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '../ContentLayout'
import {
  ArrowLeft, Save, Upload, Archive, Trash2, Eye, Loader2,
} from 'lucide-react'

export type EditorAction = 'save' | 'publish' | 'archive' | 'delete' | 'preview'

interface EditorHeaderProps {
  entityType: string
  entityLabel: string
  title: string
  status?: string
  version?: number
  isNew: boolean
  isDirty: boolean
  isSaving: boolean
  isPublishing: boolean
  isDeleting: boolean
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved?: Date | null
  onBack: () => void
  onAction: (action: EditorAction) => void
  disabledActions?: EditorAction[]
}

function formatRelativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return date.toLocaleDateString()
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  entityType,
  entityLabel,
  title,
  status,
  version,
  isNew,
  isDirty,
  isSaving,
  isPublishing,
  isDeleting,
  saveStatus = 'idle',
  lastSaved,
  onBack,
  onAction,
  disabledActions = [],
}) => {
  const isLoading = isSaving || isPublishing || isDeleting

  return (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Back + Entity info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {entityLabel}
              </span>
              {status && <StatusBadge status={status} />}
              {version !== undefined && (
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  v{version}
                </span>
              )}
            </div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate max-w-md">
              {title || `New ${entityLabel}`}
            </h1>
          </div>
        </div>

        {/* Center: Save status */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && lastSaved && (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Saved {formatRelativeTime(lastSaved)}
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Save failed
            </span>
          )}
          {saveStatus === 'idle' && isDirty && (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Preview */}
          {!isNew && (
            <button
              onClick={() => onAction('preview')}
              disabled={disabledActions.includes('preview') || isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50"
              title="Preview (Ctrl+Shift+P)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          )}

          {/* Save Draft */}
          <button
            onClick={() => onAction('save')}
            disabled={disabledActions.includes('save') || isLoading || !isDirty}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50"
            title="Save Draft (Ctrl+S)"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Publish */}
          <button
            onClick={() => onAction('publish')}
            disabled={disabledActions.includes('publish') || isLoading || isDirty}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
            title="Publish"
          >
            {isPublishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Publish</span>
          </button>

          {/* Archive */}
          {!isNew && (
            <button
              onClick={() => onAction('archive')}
              disabled={disabledActions.includes('archive') || isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50"
              title="Archive"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete */}
          {!isNew && (
            <button
              onClick={() => onAction('delete')}
              disabled={disabledActions.includes('delete') || isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 transition disabled:opacity-50"
              title="Delete"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
