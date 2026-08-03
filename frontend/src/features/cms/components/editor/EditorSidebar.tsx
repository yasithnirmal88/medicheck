import React from 'react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '../ContentLayout'
import {
  Clock, User, GitBranch, Tag, Shield, Calendar,
  ChevronRight, AlertCircle, CheckCircle2,
} from 'lucide-react'

interface SidebarSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
      >
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <ChevronRight className={cn(
          'w-3.5 h-3.5 text-slate-400 transition-transform',
          isOpen && 'rotate-90',
        )} />
      </button>
      {isOpen && (
        <div className="px-4 pb-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

interface InfoRowProps {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      {icon}
      {label}
    </div>
    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 text-right">
      {value}
    </div>
  </div>
)

interface WorkflowStep {
  label: string
  status: 'completed' | 'current' | 'upcoming' | 'error'
}

interface EditorSidebarProps {
  entityType: string
  status?: string
  version?: number
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  workflow?: WorkflowStep[]
  tags?: string[]
  evidenceLevel?: string
  severity?: string
  medicalSpecialty?: string
  reviewFrequency?: string
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  entityType,
  status,
  version,
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
  workflow,
  tags = [],
  evidenceLevel,
  severity,
  medicalSpecialty,
  reviewFrequency,
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-20">
      {/* Version Info */}
      <SidebarSection title="Version">
        <InfoRow
          label="Current"
          value={version !== undefined ? `v${version}` : '—'}
          icon={<GitBranch className="w-3 h-3" />}
        />
        <InfoRow
          label="Status"
          value={status ? <StatusBadge status={status} /> : '—'}
        />
        <InfoRow
          label="Created"
          value={formatDate(createdAt)}
          icon={<Calendar className="w-3 h-3" />}
        />
        <InfoRow
          label="Updated"
          value={formatDate(updatedAt)}
          icon={<Clock className="w-3 h-3" />}
        />
        {createdBy && (
          <InfoRow
            label="Author"
            value={createdBy}
            icon={<User className="w-3 h-3" />}
          />
        )}
        {updatedBy && updatedBy !== createdBy && (
          <InfoRow
            label="Last edited by"
            value={updatedBy}
            icon={<User className="w-3 h-3" />}
          />
        )}
      </SidebarSection>

      {/* Workflow */}
      {workflow && workflow.length > 0 && (
        <SidebarSection title="Workflow">
          <div className="space-y-1.5">
            {workflow.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : step.status === 'current' ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 shrink-0" />
                ) : step.status === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                )}
                <span className={cn(
                  'text-xs',
                  step.status === 'current'
                    ? 'font-medium text-blue-600 dark:text-blue-400'
                    : step.status === 'completed'
                    ? 'text-slate-600 dark:text-slate-400'
                    : 'text-slate-400 dark:text-slate-500',
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </SidebarSection>
      )}

      {/* Clinical Metadata */}
      {(evidenceLevel || severity || medicalSpecialty || reviewFrequency) && (
        <SidebarSection title="Clinical Metadata">
          {evidenceLevel && (
            <InfoRow label="Evidence Level" value={evidenceLevel} />
          )}
          {severity && (
            <InfoRow label="Severity" value={severity} />
          )}
          {medicalSpecialty && (
            <InfoRow label="Specialty" value={medicalSpecialty} />
          )}
          {reviewFrequency && (
            <InfoRow label="Review Freq." value={reviewFrequency} />
          )}
        </SidebarSection>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <SidebarSection title="Tags">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </SidebarSection>
      )}
    </div>
  )
}
