import React, { useMemo } from 'react'
import { useWizard } from '../state/WizardProvider'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Stepper } from '../components/wizard/Stepper'
import { SectionForm } from '../components/wizard/SectionForm'
import { RepeatableSection } from '../components/wizard/RepeatableSection'
import { Switch } from '../components/wizard/Switch'
import { PhotoUpload } from '../components/wizard/PhotoUpload'
import { MedicationCard } from '../components/wizard/MedicationCard'
import { AllergyCard } from '../components/wizard/AllergyCard'
import { VaccinationSection } from '../components/wizard/VaccinationSection'
import { DiseaseCardGrid } from '../components/wizard/DiseaseCardGrid'
import { ExpandableFamilyCard } from '../components/wizard/ExpandableFamilyCard'
import { HealthTips } from '../components/wizard/HealthTips'
import type { WizardState, SectionKey } from '../types/wizard'
import { createDefaultState } from '../state/defaults'
import { fieldSpecs } from '../wizard/fieldSpecs'
import { sectionSchemas } from '../wizard/schemas'

const STEP_LABELS: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'personal', label: 'Personal', icon: 'User' },
  { key: 'body', label: 'Body', icon: 'Activity' },
  { key: 'lifestyle', label: 'Lifestyle', icon: 'Heart' },
  { key: 'nutrition', label: 'Nutrition', icon: 'Apple' },
  { key: 'physical_activity', label: 'Activity', icon: 'Dumbbell' },
  { key: 'sleep', label: 'Sleep', icon: 'Moon' },
  { key: 'mental_health', label: 'Mental', icon: 'Brain' },
  { key: 'conditions', label: 'Conditions', icon: 'AlertCircle' },
  { key: 'surgeries', label: 'Surgeries', icon: 'Scissors' },
  { key: 'family_history', label: 'Family', icon: 'Users' },
  { key: 'medications', label: 'Meds', icon: 'Pill' },
  { key: 'allergies', label: 'Allergies', icon: 'Shield' },
  { key: 'vaccinations', label: 'Vaccines', icon: 'Syringe' },
  { key: 'women_health', label: "Women's", icon: 'Venus' },
  { key: 'men_health', label: "Men's", icon: 'Mars' },
  { key: 'lifestyle_risks', label: 'Risks', icon: 'AlertTriangle' },
  { key: 'environment', label: 'Environment', icon: 'Globe' },
  { key: 'occupation', label: 'Work', icon: 'Briefcase' },
  { key: 'travel', label: 'Travel', icon: 'Plane' },
  { key: 'emergency', label: 'Emergency', icon: 'Phone' },
  { key: 'consents', label: 'Review', icon: 'CheckCircle' },
]

const VISIBLE_STEPS = (state: WizardState) => {
  const gender = state.personal.gender
  return STEP_LABELS.filter((s) => {
    if (s.key === 'women_health' && gender !== 'female') return false
    if (s.key === 'men_health' && gender !== 'male') return false
    return true
  })
}

function renderSection(
  step: { key: SectionKey; label: string },
  state: WizardState,
  setSection: (key: SectionKey, value: unknown) => void,
) {
  const key = step.key

  if (key === 'consents') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Review &amp; Consent</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Profile Summary</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <div><span className="font-medium">Name:</span> {state.personal.first_name} {state.personal.last_name}</div>
            <div><span className="font-medium">DOB:</span> {state.personal.date_of_birth || '—'}</div>
            <div><span className="font-medium">Gender:</span> {state.personal.gender || '—'}</div>
            <div><span className="font-medium">Blood Group:</span> {state.personal.blood_group || '—'}</div>
            <div><span className="font-medium">Country:</span> {state.personal.country || '—'}</div>
            <div><span className="font-medium">City:</span> {state.personal.city || '—'}</div>
          </div>
          {state.body.height_cm || state.body.weight_kg ? (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Body Metrics</h4>
              <div className="mt-2 grid grid-cols-1 gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                {state.body.height_cm ? <div><span className="font-medium">Height:</span> {state.body.height_cm} cm</div> : null}
                {state.body.weight_kg ? <div><span className="font-medium">Weight:</span> {state.body.weight_kg} kg</div> : null}
                {state.body.waist_cm ? <div><span className="font-medium">Waist:</span> {state.body.waist_cm} cm</div> : null}
                {state.body.hip_cm ? <div><span className="font-medium">Hip:</span> {state.body.hip_cm} cm</div> : null}
              </div>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Accept Terms &amp; Conditions</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">You must accept to submit your profile</p>
            </div>
            <Switch
              checked={state.consents.terms_accepted}
              onChange={(v) => setSection('consents', { ...state.consents, terms_accepted: v })}
              label="Accept Terms"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">AI-Assisted Health Analysis</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Allow AI to analyze your profile data</p>
            </div>
            <Switch
              checked={state.consents.ai_consent}
              onChange={(v) => setSection('consents', { ...state.consents, ai_consent: v })}
              label="AI Analysis"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Anonymized Research Consent</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Allow your data to be used for research</p>
            </div>
            <Switch
              checked={state.consents.research_consent}
              onChange={(v) => setSection('consents', { ...state.consents, research_consent: v })}
              label="Research Consent"
            />
          </div>
        </div>
      </div>
    )
  }

  const specs = fieldSpecs[key]

  if (key === 'personal') {
    return (
      <div className="space-y-6">
        <SectionForm sectionKey={key} data={state.personal} onChange={(v) => setSection('personal', v)} />
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile Photo</h3>
          <PhotoUpload value={state.personal.photo ?? ''} onChange={(v) => setSection('personal', { ...state.personal, photo: v })} />
        </div>
      </div>
    )
  }

  const repeatableKeys: SectionKey[] = ['conditions', 'surgeries', 'family_history', 'medications', 'allergies', 'vaccinations']
  if (repeatableKeys.includes(key)) {
    const itemMap = {
      conditions: {
        newItem: { id: crypto.randomUUID(), conditions: [], diagnosis_date: '', severity: '', status: '', notes: '', surgeries_count: '', hospital_admissions: '', previous_fractures: '', organ_transplants: '' },
        renderItem: (item: unknown, index: number, onUpdate: (item: unknown) => void, onRemove: () => void) => {
          const entry = item as WizardState['conditions'][number]
          return (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Conditions</label>
                <DiseaseCardGrid
                  selected={entry.conditions}
                  onChange={(diseases: string[]) => onUpdate({ ...entry, conditions: diseases })}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input placeholder="Diagnosis date" value={entry.diagnosis_date ?? ''} onChange={(e) => onUpdate({ ...entry, diagnosis_date: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Severity" value={entry.severity ?? ''} onChange={(e) => onUpdate({ ...entry, severity: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input placeholder="Status" value={entry.status ?? ''} onChange={(e) => onUpdate({ ...entry, status: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Notes" value={entry.notes ?? ''} onChange={(e) => onUpdate({ ...entry, notes: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Surgeries count" value={entry.surgeries_count ?? ''} onChange={(e) => onUpdate({ ...entry, surgeries_count: e.target.value })} type="number" min={0} max={50} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Hospital admissions" value={entry.hospital_admissions ?? ''} onChange={(e) => onUpdate({ ...entry, hospital_admissions: e.target.value })} type="number" min={0} max={50} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Previous fractures" value={entry.previous_fractures ?? ''} onChange={(e) => onUpdate({ ...entry, previous_fractures: e.target.value })} type="number" min={0} max={20} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Organ transplants" value={entry.organ_transplants ?? ''} onChange={(e) => onUpdate({ ...entry, organ_transplants: e.target.value })} type="number" min={0} max={10} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
              </div>
            </div>
          )
        },
      },
      surgeries: {
        newItem: { id: crypto.randomUUID(), procedure: '', date: '', hospital: '', reason: '', outcome: '' },
        renderItem: (item: unknown, index: number, onUpdate: (item: unknown) => void, onRemove: () => void) => {
          const entry = item as WizardState['surgeries'][number]
          return (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input placeholder="Procedure" value={entry.procedure} onChange={(e) => onUpdate({ ...entry, procedure: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Date" value={entry.date ?? ''} onChange={(e) => onUpdate({ ...entry, date: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Hospital" value={entry.hospital ?? ''} onChange={(e) => onUpdate({ ...entry, hospital: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Reason" value={entry.reason ?? ''} onChange={(e) => onUpdate({ ...entry, reason: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
              </div>
              <input placeholder="Outcome" value={entry.outcome ?? ''} onChange={(e) => onUpdate({ ...entry, outcome: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
            </div>
          )
        },
      },
      family_history: {
        newItem: { id: crypto.randomUUID(), relative: '', diseases: [], age_at_diagnosis: '', current_status: '', notes: '' },
        renderItem: (item: unknown, index: number, onUpdate: (item: unknown) => void, onRemove: () => void) => {
          const entry = item as WizardState['family_history'][number]
          return (
            <ExpandableFamilyCard
              relative={entry.relative}
              diseases={entry.diseases}
              onDiseasesChange={(diseases: string[]) => onUpdate({ ...entry, diseases })}
              ageAtDiagnosis={entry.age_at_diagnosis ?? ''}
              onAgeAtDiagnosisChange={(v: string) => onUpdate({ ...entry, age_at_diagnosis: v })}
              currentStatus={entry.current_status ?? ''}
              onCurrentStatusChange={(v: string) => onUpdate({ ...entry, current_status: v })}
              notes={entry.notes ?? ''}
              onNotesChange={(v: string) => onUpdate({ ...entry, notes: v })}
            />
          )
        },
      },
      medications: {
        newItem: { id: crypto.randomUUID(), medication: '', dosage: '', frequency: '', reason: '', start_date: '', prescribing_doctor: '', current_status: '' },
        renderItem: (item: unknown, index: number, onUpdate: (item: unknown) => void, onRemove: () => void) => {
          const entry = item as WizardState['medications'][number]
          return (
            <MedicationCard
              medication={entry.medication}
              dosage={entry.dosage ?? ''}
              frequency={entry.frequency ?? ''}
              reason={entry.reason ?? ''}
              startDate={entry.start_date ?? ''}
              prescribingDoctor={entry.prescribing_doctor ?? ''}
              currentStatus={entry.current_status ?? ''}
              onUpdate={(field: string, value: string) => onUpdate({ ...entry, [field]: value })}
              onRemove={onRemove}
            />
          )
        },
      },
      allergies: {
        newItem: { id: crypto.randomUUID(), type: '', substance: '', severity: '', reaction: '', emergency_medication: '' },
        renderItem: (item: unknown, index: number, onUpdate: (item: unknown) => void, onRemove: () => void) => {
          const entry = item as WizardState['allergies'][number]
          return (
            <AllergyCard
              type={entry.type}
              substance={entry.substance}
              severity={entry.severity ?? ''}
              reaction={entry.reaction ?? ''}
              emergencyMedication={entry.emergency_medication ?? ''}
              onUpdate={(field: string, value: string) => onUpdate({ ...entry, [field]: value })}
              onRemove={onRemove}
            />
          )
        },
      },
      vaccinations: {
        newItem: { id: crypto.randomUUID(), vaccine: '', dose: '', date: '', provider: '' },
        renderItem: (item: unknown, index: number, onUpdate: (item: unknown) => void, onRemove: () => void) => {
          const entry = item as WizardState['vaccinations'][number]
          return (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input placeholder="Vaccine" value={entry.vaccine} onChange={(e) => onUpdate({ ...entry, vaccine: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Dose" value={entry.dose ?? ''} onChange={(e) => onUpdate({ ...entry, dose: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Date" value={entry.date ?? ''} onChange={(e) => onUpdate({ ...entry, date: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
                <input placeholder="Provider" value={entry.provider ?? ''} onChange={(e) => onUpdate({ ...entry, provider: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
              </div>
            </div>
          )
        },
      },
    }

    const config = itemMap[key as keyof typeof itemMap]

    const sectionContent = (
      <RepeatableSection
        title={step.label}
        items={state[key] as unknown[]}
        onChange={(v) => setSection(key, v)}
        newItem={config.newItem}
        renderItem={config.renderItem}
        emptyLabel="No entries yet"
        addLabel={`Add ${step.label.slice(0, -1)}`}
      />
    )

    if (key === 'conditions') {
      return (
        <div className="space-y-6">
          {sectionContent}
          <HealthTips medicalHistory={state.conditions} />
        </div>
      )
    }

    if (key === 'family_history') {
      return (
        <div className="space-y-6">
          {sectionContent}
          <HealthTips familyHistory={state.family_history} />
        </div>
      )
    }

    if (key === 'medications') {
      return (
        <div className="space-y-6">
          <RepeatableSection
            title={step.label}
            items={state.medications}
            onChange={(v) => setSection('medications', v)}
            newItem={config.newItem}
            renderItem={(item: unknown, index: number, onUpdate: (item: unknown) => void, onRemove: () => void) => {
              const entry = item as WizardState['medications'][number]
              return (
                <MedicationCard
                  medication={entry.medication}
                  dosage={entry.dosage ?? ''}
                  frequency={entry.frequency ?? ''}
                  reason={entry.reason ?? ''}
                  startDate={entry.start_date ?? ''}
                  prescribingDoctor={entry.prescribing_doctor ?? ''}
                  currentStatus={entry.current_status ?? ''}
                  onUpdate={(field: string, value: string) => onUpdate({ ...entry, [field]: value })}
                  onRemove={onRemove}
                />
              )
            }}
            emptyLabel="No medications yet"
            addLabel="Add Medication"
          />
          <HealthTips medicalHistory={state.medications} />
        </div>
      )
    }

    if (key === 'allergies') {
      return (
        <div className="space-y-6">
          <RepeatableSection
            title={step.label}
            items={state.allergies}
            onChange={(v) => setSection('allergies', v)}
            newItem={config.newItem}
            renderItem={(item: unknown, index: number, onUpdate: (item: unknown) => void, onRemove: () => void) => {
              const entry = item as WizardState['allergies'][number]
              return (
                <AllergyCard
                  type={entry.type}
                  substance={entry.substance}
                  severity={entry.severity ?? ''}
                  reaction={entry.reaction ?? ''}
                  emergencyMedication={entry.emergency_medication ?? ''}
                  onUpdate={(field: string, value: string) => onUpdate({ ...entry, [field]: value })}
                  onRemove={onRemove}
                />
              )
            }}
            emptyLabel="No allergies listed"
            addLabel="Add Allergy"
          />
        </div>
      )
    }

    if (key === 'vaccinations') {
      return (
        <div className="space-y-6">
          <VaccinationSection
            items={state.vaccinations}
            onChange={(v) => setSection('vaccinations', v)}
          />
        </div>
      )
    }

    return sectionContent
  }

  if (key === 'lifestyle') {
    return (
      <div className="space-y-6">
        <SectionForm sectionKey={key} data={state.lifestyle} onChange={(v) => setSection('lifestyle', v)} />
        <HealthTips lifestyle={state.lifestyle} nutrition={state.nutrition} />
      </div>
    )
  }

  if (key === 'nutrition') {
    return (
      <div className="space-y-6">
        <SectionForm sectionKey={key} data={state.nutrition} onChange={(v) => setSection('nutrition', v)} />
        <HealthTips lifestyle={state.lifestyle} nutrition={state.nutrition} />
      </div>
    )
  }

  if (key === 'physical_activity') {
    return (
      <div className="space-y-6">
        <SectionForm sectionKey={key} data={state.physical_activity} onChange={(v) => setSection('physical_activity', v)} />
        <HealthTips lifestyle={state.lifestyle} />
      </div>
    )
  }

  if (key === 'sleep') {
    return (
      <div className="space-y-6">
        <SectionForm sectionKey={key} data={state.sleep} onChange={(v) => setSection('sleep', v)} />
        <HealthTips lifestyle={state.lifestyle} />
      </div>
    )
  }

  if (key === 'mental_health') {
    return (
      <div className="space-y-6">
        <SectionForm sectionKey={key} data={state.mental_health} onChange={(v) => setSection('mental_health', v)} />
        <HealthTips lifestyle={state.lifestyle} />
      </div>
    )
  }

  return <SectionForm sectionKey={key} data={state[key]} onChange={(v) => setSection(key, v)} />
}

export default function HealthProfilePage() {
  const { state, setSection, isHydrated, saveDraft } = useWizard()
  const [currentStep, setCurrentStep] = React.useState(0)

  const steps = useMemo(() => VISIBLE_STEPS(state), [state])

  const currentKey = steps[currentStep]?.key ?? 'personal'

  const handleSave = () => {
    saveDraft()
  }

  const handleSubmit = () => {
    // In a real app, this would call the API to save the profile
    console.log('Submitting profile:', state)
    alert('Profile submitted successfully!')
  }

  if (!isHydrated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Health Profile</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Complete your health profile — your data is saved automatically</p>
        </div>

        <Stepper steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {renderSection(steps[currentStep], state, setSection)}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Previous
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Save Draft
            </button>
            {currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Submit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}