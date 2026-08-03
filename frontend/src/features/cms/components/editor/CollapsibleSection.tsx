import React, { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, AlertTriangle } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  description?: string
  defaultOpen?: boolean
  hasErrors?: boolean
  errorCount?: number
  badge?: React.ReactNode
  children: React.ReactNode
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  description,
  defaultOpen = true,
  hasErrors = false,
  errorCount = 0,
  badge,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <div className={cn(
      'bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden transition-colors',
      hasErrors
        ? 'border-red-200 dark:border-red-900/50'
        : 'border-slate-200 dark:border-slate-800',
    )}>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          'w-full flex items-center justify-between px-5 py-4 text-left transition-colors',
          hasErrors
            ? 'bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/30'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              {hasErrors && errorCount > 0 && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                  <AlertTriangle className="w-3 h-3" />
                  {errorCount}
                </span>
              )}
              {badge}
            </div>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {description}
              </p>
            )}
          </div>
        </div>
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 dark:border-slate-800">
          {children}
        </div>
      </div>
    </div>
  )
}

// ---- Form Field (editor version) ----
interface EditorFormFieldProps {
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}

export const EditorFormField: React.FC<EditorFormFieldProps> = ({
  label,
  error,
  required,
  hint,
  children,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
    )}
    {error && (
      <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
    )}
  </div>
)
