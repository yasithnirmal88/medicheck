import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ContentEditor } from './ContentFormPage'
import { useContentItem, useCreateContent, useUpdateContent, useDeleteContent } from '../hooks/useCmsQueries'
import { entityTypeToSection } from './ContentListPages'
import type { EntityType, FieldDefinition } from '../types'
import { cmsApi } from '../api/cmsApi'
import toast from 'react-hot-toast'

const entityTitles: Record<string, string> = {
  question: 'Question',
  disease: 'Disease',
  body_system: 'Body System',
  symptom: 'Symptom',
  indicator: 'Clinical Indicator',
  lab_test: 'Lab Test',
  imaging: 'Imaging Test',
  recommendation: 'Recommendation',
  lifestyle: 'Lifestyle Advice',
  exercise: 'Exercise Program',
  nutrition: 'Nutrition Advice',
  evidence: 'Evidence Reference',
  template: 'Template',
  medication: 'Medication',
  guideline: 'Clinical Guideline',
  rule: 'Decision Rule',
  severity_threshold: 'Severity Threshold',
}

const entityFields: Record<string, FieldDefinition[]> = {
  question: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'text', label: 'Question Text', type: 'text', required: true, section: 'general' },
    { name: 'question_type', label: 'Type', type: 'select', options: [
      { value: 'single_choice', label: 'Single Choice' },
      { value: 'multiple_choice', label: 'Multiple Choice' },
      { value: 'boolean', label: 'Yes/No' },
      { value: 'numeric', label: 'Numeric' },
      { value: 'text', label: 'Free Text' },
    ], required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'tooltip', label: 'Tooltip', type: 'text', section: 'clinical' },
    { name: 'is_required', label: 'Required', type: 'boolean', section: 'clinical' },
    { name: 'priority', label: 'Priority', type: 'number', section: 'clinical' },
    { name: 'difficulty', label: 'Difficulty', type: 'select', options: [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' },
    ], section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  disease: [
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'icd10_code', label: 'ICD-10 Code', type: 'text', section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'severity', label: 'Severity', type: 'select', options: [
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' },
      { value: 'critical', label: 'Critical' },
    ], section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  body_system: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  symptom: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'severity', label: 'Severity', type: 'select', options: [
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' },
      { value: 'critical', label: 'Critical' },
    ], section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  indicator: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'indicator_type', label: 'Type', type: 'select', options: [
      { value: 'vital_sign', label: 'Vital Sign' },
      { value: 'lab_value', label: 'Lab Value' },
      { value: 'questionnaire', label: 'Questionnaire' },
      { value: 'observation', label: 'Observation' },
    ], section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  lab_test: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'loinc_code', label: 'LOINC Code', type: 'text', section: 'clinical' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  imaging: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'modality', label: 'Modality', type: 'select', options: [
      { value: 'xray', label: 'X-Ray' },
      { value: 'ct', label: 'CT Scan' },
      { value: 'mri', label: 'MRI' },
      { value: 'ultrasound', label: 'Ultrasound' },
      { value: 'nuclear', label: 'Nuclear Medicine' },
    ], section: 'clinical' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  recommendation: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'title', label: 'Title', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'recommendation_type', label: 'Type', type: 'select', options: [
      { value: 'treatment', label: 'Treatment' },
      { value: 'prevention', label: 'Prevention' },
      { value: 'screening', label: 'Screening' },
      { value: 'monitoring', label: 'Monitoring' },
    ], section: 'clinical' },
    { name: 'urgency', label: 'Urgency', type: 'select', options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ], section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  lifestyle: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'category', label: 'Category', type: 'select', options: [
      { value: 'sleep', label: 'Sleep' },
      { value: 'stress', label: 'Stress Management' },
      { value: 'social', label: 'Social' },
      { value: 'general', label: 'General' },
    ], section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  exercise: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'difficulty_level', label: 'Difficulty', type: 'select', options: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ], section: 'clinical' },
    { name: 'duration_minutes', label: 'Duration (min)', type: 'number', section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  nutrition: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'meal_type', label: 'Meal Type', type: 'select', options: [
      { value: 'breakfast', label: 'Breakfast' },
      { value: 'lunch', label: 'Lunch' },
      { value: 'dinner', label: 'Dinner' },
      { value: 'snack', label: 'Snack' },
    ], section: 'clinical' },
    { name: 'calories', label: 'Calories', type: 'number', section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  evidence: [
    { name: 'title', label: 'Title', type: 'text', required: true, section: 'general' },
    { name: 'pmid', label: 'PMID', type: 'text', section: 'evidence' },
    { name: 'doi', label: 'DOI', type: 'text', section: 'evidence' },
    { name: 'evidence_level', label: 'Evidence Level', type: 'select', options: [
      { value: 'Ia', label: 'Ia - Meta-analysis' },
      { value: 'Ib', label: 'Ib - RCT' },
      { value: 'IIa', label: 'IIa - Controlled study' },
      { value: 'IIb', label: 'IIb - Quasi-experimental' },
      { value: 'III', label: 'III - Descriptive' },
      { value: 'IV', label: 'IV - Expert opinion' },
      { value: 'V', label: 'V - Expert consensus' },
    ], section: 'evidence' },
    { name: 'confidence_score', label: 'Confidence (%)', type: 'number', section: 'evidence' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  template: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'general' },
    { name: 'version', label: 'Version', type: 'number', section: 'metadata' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  medication: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'generic_name', label: 'Generic Name', type: 'text', section: 'clinical' },
    { name: 'dosage', label: 'Dosage', type: 'text', section: 'clinical' },
    { name: 'route', label: 'Route', type: 'select', options: [
      { value: 'oral', label: 'Oral' },
      { value: 'iv', label: 'IV' },
      { value: 'im', label: 'IM' },
      { value: 'sc', label: 'SC' },
      { value: 'topical', label: 'Topical' },
    ], section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  guideline: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'title', label: 'Title', type: 'text', required: true, section: 'general' },
    { name: 'organization', label: 'Organization', type: 'text', section: 'evidence' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'evidence_level', label: 'Evidence Level', type: 'select', options: [
      { value: 'Ia', label: 'Ia - Meta-analysis' },
      { value: 'Ib', label: 'Ib - RCT' },
      { value: 'IIa', label: 'IIa - Controlled study' },
      { value: 'IIb', label: 'IIb - Quasi-experimental' },
      { value: 'III', label: 'III - Descriptive' },
      { value: 'IV', label: 'IV - Expert opinion' },
      { value: 'V', label: 'V - Expert consensus' },
    ], section: 'evidence' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  rule: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'rule_type', label: 'Type', type: 'select', options: [
      { value: 'threshold', label: 'Threshold' },
      { value: 'composite', label: 'Composite' },
      { value: 'algorithm', label: 'Algorithm' },
      { value: 'lookup', label: 'Lookup' },
    ], section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
  severity_threshold: [
    { name: 'code', label: 'Code', type: 'text', required: true, section: 'general' },
    { name: 'name', label: 'Name', type: 'text', required: true, section: 'general' },
    { name: 'description', label: 'Description', type: 'textarea', section: 'clinical' },
    { name: 'severity_level', label: 'Level', type: 'select', options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ], section: 'clinical' },
    { name: 'min_value', label: 'Min Value', type: 'number', section: 'clinical' },
    { name: 'max_value', label: 'Max Value', type: 'number', section: 'clinical' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ], required: true, section: 'metadata' },
  ],
}

export const ContentFormPageWrapper: React.FC = () => {
  const { entityType, id } = useParams<{ entityType: string; id: string }>()
  const navigate = useNavigate()

  const validEntityType = (entityType || '') as EntityType
  const isEdit = !!id
  const section = entityTypeToSection[validEntityType] || validEntityType
  const backPath = `/doctor/${section}`

  const { data: initialData, isLoading: loadingItem } = useContentItem(validEntityType, id)
  const createMutation = useCreateContent(validEntityType)
  const updateMutation = useUpdateContent(validEntityType)
  const deleteMutation = useDeleteContent(validEntityType)

  const fields = entityFields[validEntityType] || []
  const entityLabel = entityTitles[validEntityType] || validEntityType
  const title = isEdit
    ? `Edit ${entityLabel}`
    : `New ${entityLabel}`

  const handleSave = async (data: Record<string, unknown>) => {
    if (isEdit && id) {
      await updateMutation.mutateAsync({ id, data })
    } else {
      const result = await createMutation.mutateAsync(data)
      if (result && (result as { id?: string }).id) {
        navigate(`/doctor/${section}/${(result as { id: string }).id}`, { replace: true })
      } else {
        navigate(backPath)
      }
    }
  }

  const handlePublish = async (data: Record<string, unknown>) => {
    if (isEdit && id) {
      await updateMutation.mutateAsync({ id, data: { ...data, status: 'published' } })
    } else {
      const result = await createMutation.mutateAsync({ ...data, status: 'published' })
      if (result && (result as { id?: string }).id) {
        navigate(`/doctor/${section}/${(result as { id: string }).id}`, { replace: true })
      } else {
        navigate(backPath)
      }
    }
    toast.success(`${entityLabel} published`)
  }

  const handleArchive = async (data: Record<string, unknown>) => {
    if (isEdit && id) {
      await updateMutation.mutateAsync({ id, data: { ...data, status: 'archived' } })
    }
    toast.success(`${entityLabel} archived`)
    navigate(backPath)
  }

  const handleDelete = async () => {
    if (isEdit && id) {
      await deleteMutation.mutateAsync(id)
      navigate(backPath)
    }
  }

  if (loadingItem) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading editor...</p>
        </div>
      </div>
    )
  }

  const entityData = initialData as Record<string, unknown> | null

  return (
    <ContentEditor
      entityType={validEntityType}
      entityLabel={entityLabel}
      title={title}
      initialData={entityData}
      fields={fields}
      onSave={handleSave}
      onPublish={handlePublish}
      onArchive={handleArchive}
      onDelete={isEdit ? handleDelete : undefined}
      onCancel={() => navigate(backPath)}
      loading={false}
      status={entityData?.status as string | undefined}
      version={entityData?.version as number | undefined}
      createdAt={entityData?.created_at as string | undefined}
      updatedAt={entityData?.updated_at as string | undefined}
      createdBy={entityData?.created_by as string | undefined}
      updatedBy={entityData?.updated_by as string | undefined}
      isNew={!isEdit}
    />
  )
}
