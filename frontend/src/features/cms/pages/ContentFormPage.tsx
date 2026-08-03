import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  ContentLayout,
  FormSection,
  FormField,
  StatusBadge,
  Modal,
} from '../components/ContentLayout'
import VersionComparison from '../components/VersionComparison'
import { EntitySearchSelector } from '../components/EntitySearchSelector'
import { cmsApi } from '../api/cmsApi'
import {
  useApprovals,
  useBodySystems,
  useContentItem,
  usePublishingJobs,
  useSnapshots,
  useEntitySearch,
  useRuleSets,
  useEvaluateRule,
} from '../hooks/useCmsQueries'
import type {
  EntityType,
  VersionSnapshot,
  Approval,
  LifestyleAdvice,
} from '../types'
import Button from '@/shared/ui/Button'
import {
  Save,
  Plus,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Trash2,
  X,
} from 'lucide-react'

const ENTITY_SLUG_TO_TYPE: Partial<Record<string, EntityType>> = {
  questions: 'question',
  'question-groups': 'question_group',
  diseases: 'disease',
  'body-systems': 'body_system',
  symptoms: 'symptom',
  indicators: 'indicator',
  'lab-tests': 'lab_test',
  imaging: 'imaging',
  recommendations: 'recommendation',
  lifestyle: 'lifestyle',
  exercise: 'exercise',
  nutrition: 'nutrition',
  evidence: 'evidence',
  templates: 'template',
  medications: 'medication',
  guidelines: 'guideline',
  rules: 'rule',
  thresholds: 'severity_threshold',
}

const ENTITY_TITLE_MAP: Partial<Record<EntityType, string>> = {
  question: 'Question',
  question_group: 'Question Group',
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
  medication: 'Medication Recommendation',
  guideline: 'Clinical Guideline',
  rule: 'Decision Rule',
  severity_threshold: 'Severity Threshold',
}

type SearchItem = {
  id: string
  name?: string
  title?: string
  code?: string
}

interface ReferenceForm {
  id?: string
  title: string
  journal: string
  year: string
  doi: string
  url: string
  evidence_level: string
}

interface EditorFormValues {
  name: string
  code: string
  description: string
  body_system_id: string
  severity: string
  status: string
  icd10_code: string
  evidence_level: string
  risk_category: string
  clinical_summary: string
  symptoms: SearchItem[]
  indicators: SearchItem[]
  lab_tests: SearchItem[]
  imaging: SearchItem[]
  recommendations: SearchItem[]
  lifestyle: SearchItem[]
  references: ReferenceForm[]
  [key: string]: unknown
}

function makeDefaultValues(): EditorFormValues {
  return {
    name: '',
    code: '',
    description: '',
    body_system_id: '',
    severity: '',
    status: 'draft',
    icd10_code: '',
    evidence_level: '',
    risk_category: '',
    clinical_summary: '',
    symptoms: [],
    indicators: [],
    lab_tests: [],
    imaging: [],
    recommendations: [],
    lifestyle: [],
    references: [],
  }
}

function normalizeSearchItem(item: any): SearchItem {
  return {
    id: String(item?.id ?? item?.value ?? ''),
    name: item?.name ?? item?.title ?? item?.code ?? item?.label ?? String(item?.id ?? ''),
    title: item?.title,
    code: item?.code,
  }
}

function normalizeReference(item: any): ReferenceForm {
  return {
    id: item?.id,
    title: item?.title ?? item?.name ?? '',
    journal: item?.citation ?? item?.journal ?? '',
    year: item?.published_at ?? item?.year ?? '',
    doi: item?.doi ?? '',
    url: item?.url ?? '',
    evidence_level: item?.evidence_level ?? '',
  }
}

function makePayload(values: EditorFormValues) {
  const payload: Record<string, unknown> = {
    name: values.name,
    code: values.code,
    description: values.description,
    body_system_id: values.body_system_id || null,
    severity: values.severity || null,
    status: values.status,
    icd10_code: values.icd10_code || null,
    evidence_level: values.evidence_level || null,
    risk_category: values.risk_category || null,
    clinical_summary: values.clinical_summary || null,
  }

  if (values.symptoms.length) payload.symptoms = values.symptoms.map((item) => item.id)
  if (values.indicators.length) payload.indicators = values.indicators.map((item) => item.id)
  if (values.lab_tests.length) payload.laboratory_tests = values.lab_tests.map((item) => item.id)
  if (values.imaging.length) payload.imaging = values.imaging.map((item) => item.id)
  if (values.recommendations.length) payload.recommendations = values.recommendations.map((item) => item.id)
  if (values.lifestyle.length) payload.lifestyle = values.lifestyle.map((item) => item.id)

  if (values.references.length) {
    payload.references = values.references.map((ref) => ({
      id: ref.id,
      title: ref.title,
      citation: ref.journal || null,
      published_at: ref.year || null,
      doi: ref.doi || null,
      url: ref.url || null,
      evidence_level: ref.evidence_level || null,
    }))
  }

  return payload
}

function compareJson(current: Record<string, unknown>, previous: Record<string, unknown>) {
  const keys = Array.from(new Set([...Object.keys(current), ...Object.keys(previous)]))
  return keys.map((key) => ({
    key,
    current: current[key],
    previous: previous[key],
    changed: JSON.stringify(current[key]) !== JSON.stringify(previous[key]),
  }))
}

export const ContentFormPage: React.FC = () => {
  const params = useParams<{ entitySlug: string; id?: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const entitySlug = params.entitySlug ?? ''
  const entityType = ENTITY_SLUG_TO_TYPE[entitySlug]
  const isNew = params.id === 'new'
  const itemId = isNew ? undefined : params.id
  const contentTitle = entityType ? ENTITY_TITLE_MAP[entityType] ?? entitySlug.replace(/-/g, ' ') : entitySlug.replace(/-/g, ' ')

  const { data: item, isLoading: isItemLoading } = useContentItem<Record<string, any>>(entityType as EntityType, itemId)
  const bodySystemsQuery = useBodySystems({ limit: 100 })
  const approvalsQuery = useApprovals('pending', entityType)
  const jobsQuery = usePublishingJobs('approved', entityType)
  const snapshotsQuery = useSnapshots(entityType ?? '', itemId || '')
  const ruleSetsQuery = useRuleSets()
  const evaluateRule = useEvaluateRule()

  const [searchTerms, setSearchTerms] = useState({
    symptoms: '',
    indicators: '',
    labTests: '',
    imaging: '',
    recommendations: '',
    lifestyle: '',
  })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState,
  } = useForm<EditorFormValues>({ defaultValues: makeDefaultValues(), mode: 'onChange' })

  const [saveStatus, setSaveStatus] = useState<'idle' | 'unsaved' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<SearchItem[]>([])
  const [selectedIndicators, setSelectedIndicators] = useState<SearchItem[]>([])
  const [selectedLabTests, setSelectedLabTests] = useState<SearchItem[]>([])
  const [selectedImaging, setSelectedImaging] = useState<SearchItem[]>([])
  const [selectedRecommendations, setSelectedRecommendations] = useState<SearchItem[]>([])
  const [selectedLifestyle, setSelectedLifestyle] = useState<SearchItem[]>([])
  const [references, setReferences] = useState<ReferenceForm[]>([])
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [compareSnapshot, setCompareSnapshot] = useState<VersionSnapshot | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  // Debounce search terms to avoid excessive backend calls
  const [debouncedSearchTerms, setDebouncedSearchTerms] = useState(searchTerms)
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearchTerms(searchTerms), 300)
    return () => window.clearTimeout(t)
  }, [searchTerms])

  // Use the new generic entity search hook for autocomplete (falls back to content list endpoints when query is empty)
  const symptomSearchQuery = useEntitySearch(debouncedSearchTerms.symptoms, 'symptom', 20)
  const indicatorSearchQuery = useEntitySearch(debouncedSearchTerms.indicators, 'indicator', 20)
  const labTestSearchQuery = useEntitySearch(debouncedSearchTerms.labTests, 'lab_test', 20)
  const imagingSearchQuery = useEntitySearch(debouncedSearchTerms.imaging, 'imaging', 20)
  const recommendationSearchQuery = useEntitySearch(debouncedSearchTerms.recommendations, 'recommendation', 20)
  const lifestyleSearchQuery = useEntitySearch(debouncedSearchTerms.lifestyle, 'lifestyle', 20)

  const bodySystemOptions = bodySystemsQuery.data?.items.map(normalizeSearchItem) ?? []
  const symptomSearchItems = (symptomSearchQuery.data ?? []).map(normalizeSearchItem)
  const indicatorSearchItems = (indicatorSearchQuery.data ?? []).map(normalizeSearchItem)
  const labTestSearchItems = (labTestSearchQuery.data ?? []).map(normalizeSearchItem)
  const imagingSearchItems = (imagingSearchQuery.data ?? []).map(normalizeSearchItem)
  const recommendationSearchItems = (recommendationSearchQuery.data ?? []).map(normalizeSearchItem)
  const lifestyleSearchItems = (lifestyleSearchQuery.data ?? []).map(normalizeSearchItem)

  const loadingSymptoms = symptomSearchQuery.isLoading
  const loadingIndicators = indicatorSearchQuery.isLoading
  const loadingLabTests = labTestSearchQuery.isLoading
  const loadingImaging = imagingSearchQuery.isLoading
  const loadingRecommendations = recommendationSearchQuery.isLoading
  const loadingLifestyle = lifestyleSearchQuery.isLoading

  const currentApproval = approvalsQuery.data?.find((approval) => approval.entity_id === itemId)
  const approvedJob = jobsQuery.data?.find((job) => job.entity_id === itemId)

  const isDirty = formState.isDirty
  const watchValues = watch()

  useEffect(() => {
    if (!entityType) return
    const resetValues: EditorFormValues = {
      ...makeDefaultValues(),
      ...(item ?? {}),
      status: item?.status ?? 'draft',
      symptoms: Array.isArray(item?.symptoms) ? item.symptoms.map(normalizeSearchItem) : [],
      indicators: Array.isArray(item?.indicators) ? item.indicators.map(normalizeSearchItem) : [],
      lab_tests: Array.isArray(item?.laboratory_tests) ? item.laboratory_tests.map(normalizeSearchItem) : [],
      imaging: Array.isArray(item?.imaging) ? item.imaging.map(normalizeSearchItem) : [],
      recommendations: Array.isArray(item?.recommendations) ? item.recommendations.map(normalizeSearchItem) : [],
      lifestyle: Array.isArray(item?.lifestyle) ? item.lifestyle.map(normalizeSearchItem) : [],
      references: Array.isArray(item?.references) ? item.references.map(normalizeReference) : [],
    }

    reset(resetValues)
    setSelectedSymptoms(resetValues.symptoms)
    setSelectedIndicators(resetValues.indicators)
    setSelectedLabTests(resetValues.lab_tests)
    setSelectedImaging(resetValues.imaging)
    setSelectedRecommendations(resetValues.recommendations)
    setSelectedLifestyle(resetValues.lifestyle)
    setReferences(resetValues.references)
  }, [entityType, item, reset])

  useEffect(() => {
    setValue('symptoms', selectedSymptoms)
  }, [selectedSymptoms, setValue])

  useEffect(() => {
    setValue('indicators', selectedIndicators)
  }, [selectedIndicators, setValue])

  useEffect(() => {
    setValue('lab_tests', selectedLabTests)
  }, [selectedLabTests, setValue])

  useEffect(() => {
    setValue('imaging', selectedImaging)
  }, [selectedImaging, setValue])

  useEffect(() => {
    setValue('recommendations', selectedRecommendations)
  }, [selectedRecommendations, setValue])

  useEffect(() => {
    setValue('lifestyle', selectedLifestyle)
  }, [selectedLifestyle, setValue])

  useEffect(() => {
    setValue('references', references)
  }, [references, setValue])

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: Record<string, unknown> }) => {
      const api = cmsApi[entityType as keyof typeof cmsApi] as any
      return id ? api.update(id, data) : api.create(data)
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'content', entityType] })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['cms', 'content', entityType, variables.id] })
      } else if (result?.id) {
        navigate(`/cms/${entitySlug}/${result.id}`, { replace: true })
      }
      setSaveStatus('saved')
      setSaveError(null)
      toast.success('Draft saved')
    },
    onError: () => {
      setSaveStatus('error')
      setSaveError('Unable to save draft.')
      toast.error('Unable to save draft')
    },
  })

  const submitReviewMutation = useMutation({
    mutationFn: (payload: Partial<Approval>) => cmsApi.publishing.createApproval(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'approvals', 'pending', entityType] })
      toast.success('Review submitted')
    },
    onError: () => toast.error('Unable to submit review'),
  })

  const approveMutation = useMutation({
    mutationFn: () => {
      if (!currentApproval) throw new Error('Approval missing')
      return cmsApi.publishing.approveEntity(currentApproval.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'approvals', 'pending', entityType] })
      toast.success('Approved')
    },
    onError: () => toast.error('Approval failed'),
  })

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => {
      if (!currentApproval) throw new Error('Approval missing')
      return cmsApi.publishing.rejectApproval(currentApproval.id, reason)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'approvals', 'pending', entityType] })
      toast.success('Rejected')
    },
    onError: () => toast.error('Unable to reject'),
  })

  const publishMutation = useMutation({
    mutationFn: (jobId: string) => cmsApi.publishing.executePublish(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'publishing', 'jobs', 'approved', entityType] })
      toast.success('Published')
    },
    onError: () => toast.error('Publish failed'),
  })

  const archiveMutation = useMutation({
    mutationFn: async () => {
      if (!itemId) throw new Error('Missing entity id')
      const api = cmsApi[entityType as keyof typeof cmsApi] as any
      return api.update(itemId, { status: 'archived' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'content', entityType, itemId] })
      toast.success('Archived')
    },
    onError: () => toast.error('Archive failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!itemId) throw new Error('Missing entity id')
      const api = cmsApi[entityType as keyof typeof cmsApi] as any
      return api.delete(itemId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'content', entityType] })
      toast.success('Deleted')
      navigate(`/cms/${entitySlug}`)
    },
    onError: () => toast.error('Delete failed'),
  })

  const handleSave = async () => {
    if (!entityType) return
    setSaveStatus('saving')
    const values = getValues()
    const payload = makePayload(values as EditorFormValues)
    await saveMutation.mutateAsync({ id: itemId, data: payload })
  }

  useEffect(() => {
    if (!isDirty || saveStatus === 'saving' || !entityType) return
    const timeout = window.setTimeout(() => {
      void handleSave()
    }, 2000)
    return () => window.clearTimeout(timeout)
  }, [isDirty, watchValues, entityType])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return
      event.preventDefault()
      event.returnValue = ''
    }

    const handlePopState = () => {
      if (!isDirty) return
      if (!window.confirm('You have unsaved changes. Leave without saving?')) {
        window.history.pushState(null, '', window.location.href)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isDirty])

  const validationChecks = useMemo(() => {
    const values = getValues()
    const name = String(values.name || '')
    const description = String(values.description || '')
    const hasReferences = references.length > 0
    const hasLabTests = selectedLabTests.length > 0
    const hasSymptoms = selectedSymptoms.length > 0
    const hasIndicators = selectedIndicators.length > 0

    return [
      { label: 'Name', valid: !!name },
      { label: 'Description', valid: !!description },
      { label: 'Laboratory Tests', valid: entityType === 'disease' ? hasLabTests : true },
      { label: 'Symptoms', valid: entityType === 'disease' ? hasSymptoms : true },
      { label: 'Indicators', valid: entityType === 'disease' ? hasIndicators : true },
      { label: 'References', valid: hasReferences },
    ]
  }, [entityType, getValues, references.length, selectedIndicators.length, selectedLabTests.length, selectedSymptoms.length])

  const readyForReview = validationChecks.every((check) => check.valid)

  // --- Server-side rules validation ---
  const [selectedRuleSetId, setSelectedRuleSetId] = useState<string | null>(null)
  const [serverValidationResults, setServerValidationResults] = useState<{
    rule_id: string
    name: string
    result: boolean | number | string
    confidence?: number | null
  }[] | null>(null)
  const [serverValidationError, setServerValidationError] = useState<string | null>(null)

  const runServerValidation = async () => {
    setServerValidationError(null)
    setServerValidationResults(null)
    if (!selectedRuleSetId) {
      setServerValidationError('Select a ruleset to validate against')
      return
    }
    try {
      const payload = makePayload(getValues() as EditorFormValues)
      // evaluateRule expects { ruleSetId, context }
      const res = await evaluateRule.mutateAsync({ ruleSetId: selectedRuleSetId, context: payload })
      // normalize result to array
      const arr = Array.isArray(res) ? res : [res]
      setServerValidationResults(arr as any)
      // If any rule returns falsy, consider validation failed
      const anyFail = arr.some((r: any) => r.result === false || r.result === 0 || r.result === 'false')
      if (anyFail) {
        toast.error('Server validation found issues')
      } else {
        toast.success('Server validation passed')
      }
    } catch (err) {
      setServerValidationError('Server validation failed')
      toast.error('Server validation failed')
    }
  }

  if (!entityType) {
    return (
      <ContentLayout title="Content Editor" description="This content type is not supported.">
        <div className="p-6 text-sm text-red-500">Invalid CMS entity type.</div>
      </ContentLayout>
    )
  }

  const approvalMessage = currentApproval ? currentApproval.status : 'Not requested'
  const serverValidationFailed = serverValidationResults ? serverValidationResults.some((r) => r.result === false || r.result === 0 || r.result === 'false') : false
  const publishButtonDisabled = !approvedJob || !readyForReview || serverValidationFailed
  const snapshotComparison = compareSnapshot
    ? compareJson(makePayload(getValues() as EditorFormValues) as Record<string, unknown>, compareSnapshot.snapshot as Record<string, unknown>)
    : []

  return (
    <ContentLayout
      title={isNew ? `Create ${contentTitle}` : `Edit ${contentTitle}`}
      description={`Use the medical authoring workspace to save drafts, manage relationships, and review workflow steps.`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={saveMutation.isPending || isItemLoading}>
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => {
              if (!itemId) return
              submitReviewMutation.mutate({ entity_type: entityType, entity_id: itemId, status: 'pending' })
            }}
            disabled={!readyForReview || !itemId || submitReviewMutation.isPending}
          >
            <ArrowRight className="w-4 h-4" />
            Submit Review
          </Button>
          <Button
            onClick={() => setShowApproveDialog(true)}
            disabled={!currentApproval || currentApproval.status !== 'pending'}
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </Button>
          <Button
            onClick={() => setShowRejectDialog(true)}
            disabled={!currentApproval || currentApproval.status !== 'pending'}
            variant="danger"
          >
            <AlertTriangle className="w-4 h-4" />
            Reject
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div className="space-y-6">
          <form onSubmit={handleSubmit(() => void handleSave())} className="space-y-6">
            <FormSection title="General Information" description="Core metadata and the condition overview.">
              <div className="grid gap-6 lg:grid-cols-2">
                <FormField label="Name" required>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                    placeholder="Disease or entity name"
                  />
                </FormField>
                <FormField label="Status">
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </FormField>
                <FormField label="ICD-10 code">
                  <input
                    {...register('icd10_code')}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                    placeholder="Optional medical code"
                  />
                </FormField>
                <FormField label="Body system">
                  <select
                    {...register('body_system_id')}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">Select body system</option>
                    {bodySystemOptions.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Clinical Description" description="Summarize the condition, severity, and clinical context.">
              <div className="grid gap-6">
                <FormField label="Description" required>
                  <textarea
                    {...register('description')}
                    rows={5}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                    placeholder="Detailed clinical description"
                  />
                </FormField>
                <div className="grid gap-6 lg:grid-cols-3">
                  <FormField label="Severity">
                    <input
                      {...register('severity')}
                      className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                      placeholder="Low / Medium / High"
                    />
                  </FormField>
                  <FormField label="Evidence level">
                    <input
                      {...register('evidence_level')}
                      className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                      placeholder="Clinical evidence level"
                    />
                  </FormField>
                  <FormField label="Risk category">
                    <input
                      {...register('risk_category')}
                      className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                      placeholder="Risk category"
                    />
                  </FormField>
                </div>
              </div>
            </FormSection>

            <FormSection title="Symptom & Indicator Relationships" description="Connect the condition to symptoms and clinical indicators.">
              <div className="grid gap-6">
                <EntitySearchSelector
                  label="Symptoms"
                  selected={selectedSymptoms}
                  onAdd={(item) => setSelectedSymptoms((prev) => [...prev, item])}
                  onRemove={(item) => setSelectedSymptoms((prev) => prev.filter((current) => current.id !== item.id))}
                  searchValue={searchTerms.symptoms}
                  onSearchChange={(value) => setSearchTerms((prev) => ({ ...prev, symptoms: value }))}
                  results={symptomSearchItems}
                  loading={loadingSymptoms}
                  placeholder="Type symptom..."
                />
                <EntitySearchSelector
                  label="Clinical Indicators"
                  selected={selectedIndicators}
                  onAdd={(item) => setSelectedIndicators((prev) => [...prev, item])}
                  onRemove={(item) => setSelectedIndicators((prev) => prev.filter((current) => current.id !== item.id))}
                  searchValue={searchTerms.indicators}
                  onSearchChange={(value) => setSearchTerms((prev) => ({ ...prev, indicators: value }))}
                  results={indicatorSearchItems}
                  loading={loadingIndicators}
                  placeholder="Type indicator..."
                />
              </div>
            </FormSection>

            <FormSection title="Laboratory, Imaging & Recommendations" description="Link laboratory tests, imaging procedures, and recommendations.">
              <div className="grid gap-6">
                <EntitySearchSelector
                  label="Laboratory Tests"
                  selected={selectedLabTests}
                  onAdd={(item) => setSelectedLabTests((prev) => [...prev, item])}
                  onRemove={(item) => setSelectedLabTests((prev) => prev.filter((current) => current.id !== item.id))}
                  searchValue={searchTerms.labTests}
                  onSearchChange={(value) => setSearchTerms((prev) => ({ ...prev, labTests: value }))}
                  results={labTestSearchItems}
                  loading={loadingLabTests}
                  placeholder="Type laboratory test..."
                />
                <EntitySearchSelector
                  label="Imaging Procedures"
                  selected={selectedImaging}
                  onAdd={(item) => setSelectedImaging((prev) => [...prev, item])}
                  onRemove={(item) => setSelectedImaging((prev) => prev.filter((current) => current.id !== item.id))}
                  searchValue={searchTerms.imaging}
                  onSearchChange={(value) => setSearchTerms((prev) => ({ ...prev, imaging: value }))}
                  results={imagingSearchItems}
                  loading={loadingImaging}
                  placeholder="Type imaging test..."
                />
                <EntitySearchSelector
                  label="Recommendations"
                  selected={selectedRecommendations}
                  onAdd={(item) => setSelectedRecommendations((prev) => [...prev, item])}
                  onRemove={(item) => setSelectedRecommendations((prev) => prev.filter((current) => current.id !== item.id))}
                  searchValue={searchTerms.recommendations}
                  onSearchChange={(value) => setSearchTerms((prev) => ({ ...prev, recommendations: value }))}
                  results={recommendationSearchItems}
                  loading={loadingRecommendations}
                  placeholder="Type recommendation..."
                />
                <EntitySearchSelector
                  label="Lifestyle Advice"
                  selected={selectedLifestyle}
                  onAdd={(item) => setSelectedLifestyle((prev) => [...prev, item])}
                  onRemove={(item) => setSelectedLifestyle((prev) => prev.filter((current) => current.id !== item.id))}
                  searchValue={searchTerms.lifestyle}
                  onSearchChange={(value) => setSearchTerms((prev) => ({ ...prev, lifestyle: value }))}
                  results={lifestyleSearchItems}
                  loading={loadingLifestyle}
                  placeholder="Type lifestyle advice..."
                />
              </div>
            </FormSection>

            <FormSection title="Medical References" description="Capture evidence references that support this item.">
              <div className="space-y-4">
                {references.map((reference, index) => (
                  <div key={`${reference.id ?? index}-${reference.title}`} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{reference.title || 'Untitled reference'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{reference.journal || 'No journal'} • {reference.year || 'Year not set'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReferences(references.filter((item) => item !== reference))}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-4 mt-3 sm:grid-cols-2">
                      <FormField label="Title">
                        <input
                          value={reference.title}
                          onChange={(event) => {
                            const next = [...references]
                            next[index] = { ...reference, title: event.target.value }
                            setReferences(next)
                          }}
                          className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                          placeholder="Reference title"
                        />
                      </FormField>
                      <FormField label="Journal">
                        <input
                          value={reference.journal}
                          onChange={(event) => {
                            const next = [...references]
                            next[index] = { ...reference, journal: event.target.value }
                            setReferences(next)
                          }}
                          className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                          placeholder="Journal or source"
                        />
                      </FormField>
                      <FormField label="Year">
                        <input
                          value={reference.year}
                          onChange={(event) => {
                            const next = [...references]
                            next[index] = { ...reference, year: event.target.value }
                            setReferences(next)
                          }}
                          className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                          placeholder="2025"
                        />
                      </FormField>
                      <FormField label="DOI / URL">
                        <input
                          value={reference.doi}
                          onChange={(event) => {
                            const next = [...references]
                            next[index] = { ...reference, doi: event.target.value }
                            setReferences(next)
                          }}
                          className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                          placeholder="DOI or URL"
                        />
                      </FormField>
                      <FormField label="Evidence Level">
                        <input
                          value={reference.evidence_level}
                          onChange={(event) => {
                            const next = [...references]
                            next[index] = { ...reference, evidence_level: event.target.value }
                            setReferences(next)
                          }}
                          className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                          placeholder="A / B / C"
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={() => setReferences([...references, { title: '', journal: '', year: '', doi: '', url: '', evidence_level: '' }])} className="inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Reference
                </Button>
              </div>
            </FormSection>
          </form>
        </div>

        <aside className="space-y-6 sticky top-6 self-start">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Save Status</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Autosaves after 2 seconds of idle typing.</p>
              </div>
              <StatusBadge status={saveStatus === 'saving' ? 'pending' : saveStatus === 'saved' ? 'completed' : saveStatus === 'unsaved' ? 'pending' : 'draft'} />
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && 'All changes saved'}
              {saveStatus === 'unsaved' && 'Unsaved changes'}
              {saveStatus === 'error' && 'Save error'}
              {saveStatus === 'idle' && 'Ready'}
            </div>
            {saveError && <p className="text-sm text-red-500">{saveError}</p>}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Workflow</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Current review and publish state.</p>
              </div>
              <StatusBadge status={item?.status ?? 'draft'} />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">Approval: {approvalMessage}</p>
            <div className="space-y-3">
              <Button type="button" onClick={() => setShowHistoryModal(true)} className="w-full justify-center">
                <Plus className="w-4 h-4" />
                View Version History
              </Button>
              <Button type="button" onClick={() => archiveMutation.mutate()} disabled={!itemId || archiveMutation.isPending || item?.status === 'archived'} variant="danger" className="w-full justify-center">
                <Trash2 className="w-4 h-4" />
                Archive
              </Button>
              <Button type="button" onClick={() => setShowDeleteModal(true)} variant="danger" className="w-full justify-center">
                <X className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Validation</h3>
            <div className="space-y-3">
              {validationChecks.map((check) => (
                <div key={check.label} className="flex items-center justify-between gap-2 text-sm">
                  <span>{check.label}</span>
                  <span className={check.valid ? 'text-emerald-600' : 'text-rose-600'}>{check.valid ? '✓' : '✕'}</span>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs text-slate-500">Ruleset</label>
                <select value={selectedRuleSetId ?? ''} onChange={(e) => setSelectedRuleSetId(e.target.value || null)} className="w-full mt-2 px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none">
                  <option value="">(Select a ruleset)</option>
                  {ruleSetsQuery.data?.map((rs) => (
                    <option key={rs.id} value={rs.id}>{rs.name}</option>
                  ))}
                </select>
                <div className="mt-3 flex gap-2">
                  <button onClick={runServerValidation} disabled={!selectedRuleSetId || evaluateRule.isLoading} className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">{evaluateRule.isLoading ? 'Validating...' : 'Run Rules Engine'}</button>
                  <button onClick={() => { setServerValidationResults(null); setServerValidationError(null); setSelectedRuleSetId(null); }} className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 dark:bg-slate-800 rounded-lg">Clear</button>
                </div>

                {serverValidationError && <p className="text-sm text-rose-600 mt-2">{serverValidationError}</p>}

                {serverValidationResults && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-slate-500">Rules Engine Results</p>
                    {serverValidationResults.map((r) => (
                      <div key={r.rule_id} className="flex items-center justify-between gap-2 text-sm">
                        <span>{r.name}</span>
                        <span className={(r.result === false || r.result === 0 || r.result === 'false') ? 'text-rose-600' : 'text-emerald-600'}>{(r.result === false || r.result === 0 || r.result === 'false') ? 'Fail' : 'Pass'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Publish Actions</h3>
            <Button type="button" onClick={() => { if (!itemId) return; submitReviewMutation.mutate({ entity_type: entityType, entity_id: itemId, status: 'pending' }); }} disabled={!readyForReview || !itemId} className="w-full justify-center">
              Submit Review
            </Button>
            <Button type="button" onClick={() => setShowApproveDialog(true)} disabled={!currentApproval || currentApproval.status !== 'pending'} className="w-full justify-center">
              Approve
            </Button>
            <Button type="button" onClick={() => setShowRejectDialog(true)} disabled={!currentApproval || currentApproval.status !== 'pending'} variant="danger" className="w-full justify-center">
              Reject
            </Button>
            <Button type="button" onClick={() => approvedJob && publishMutation.mutate(approvedJob.id)} disabled={publishButtonDisabled} className="w-full justify-center">
              Publish
            </Button>
          </div>
        </aside>
      </div>

      <Modal open={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Version History" size="xl">
        <div className="space-y-4">
          {(snapshotsQuery.data ?? []).length ? (
            <div className="space-y-3">
              {snapshotsQuery.data?.map((snapshot) => (
                <button key={snapshot.id} type="button" onClick={() => { setCompareSnapshot(snapshot); setShowHistoryModal(false); }} className="w-full text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Version {snapshot.version}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{snapshot.reason || 'No reason provided'}</p>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(snapshot.created_at).toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No versions available for this item.</p>
          )}
        </div>
      </Modal>

      <Modal open={!!compareSnapshot} onClose={() => setCompareSnapshot(null)} title={`Compare with Version ${compareSnapshot?.version ?? ''}`} size="xl">
        <div className="space-y-4">
          <VersionComparison
            current={makePayload(getValues() as EditorFormValues) as Record<string, unknown>}
            previous={(compareSnapshot?.snapshot as Record<string, unknown>) || {}}
            metaCurrent={{ version: item?.version, author: item?.updated_by ?? item?.created_by, created_at: item?.updated_at }}
            metaPrevious={{ version: compareSnapshot?.version, author: compareSnapshot?.created_by, created_at: compareSnapshot?.created_at, reason: compareSnapshot?.reason }}
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
      </Modal>

      <Modal open={showRejectDialog} onClose={() => setShowRejectDialog(false)} title="Reject Approval" size="md">
        <div className="space-y-4">
          <FormField label="Reason" required>
            <textarea
              className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Reason for rejection"
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={!rejectReason.trim() || rejectMutation.isPending}
              onClick={() => {
                if (!rejectReason.trim()) return
                rejectMutation.mutate(rejectReason.trim())
                setShowRejectDialog(false)
                setRejectReason('')
              }}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={showApproveDialog} onClose={() => setShowApproveDialog(false)} title="Approve Item" size="md">
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Approve the current item and move it forward in the medical publishing workflow.</p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                approveMutation.mutate()
                setShowApproveDialog(false)
              }}
              disabled={!currentApproval || approveMutation.isPending}
            >
              Approve
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete" size="md">
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Type DELETE to confirm removal of this item. This action cannot be undone.</p>
          <input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
            placeholder="Type DELETE to confirm"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" disabled={deleteConfirmText !== 'DELETE' || deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </ContentLayout>
  )
}
