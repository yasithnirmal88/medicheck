import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import type { WizardState, SectionKey } from '../types/wizard'
import { createDefaultState, mergeDraft } from './defaults'

const STORAGE_KEY = 'medicheck-profile-draft-v1'

interface WizardContextValue {
  state: WizardState
  setSection: (key: SectionKey, value: unknown) => void
  saveDraft: () => void
  clearDraft: () => void
  isHydrated: boolean
  saveVersion: () => void
}

const WizardContext = createContext<WizardContextValue | null>(null)

function readDraft(): Partial<WizardState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<WizardState>) : null
  } catch {
    return null
  }
}

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false)
  const [state, setState] = useState<WizardState>(createDefaultState)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const draft = readDraft()
    if (draft) setState((prev) => mergeDraft(prev, draft))
    setIsHydrated(true)
  }, [])

  const persist = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current))
    } catch {
      // ignore storage quota errors
    }
  }, [])

  const autoPersist = useMemo(() => debounce(persist, 600), [persist])

  useEffect(() => {
    if (isHydrated) autoPersist()
  }, [state, isHydrated, autoPersist])

  const setSection = useCallback((key: SectionKey, value: unknown) => {
    setState((prev) => ({ ...prev, [key]: value as never }))
  }, [])

  const saveDraft = useCallback(() => {
    autoPersist.flush()
  }, [autoPersist])

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore storage errors
    }
  }, [])

  const saveVersion = useCallback(() => {
    try {
      const versions = readDraftVersions()
      versions.push({ savedAt: new Date().toISOString(), state: stateRef.current })
      localStorage.setItem('medicheck-profile-versions', JSON.stringify(versions.slice(-10)))
    } catch {
      // ignore storage errors
    }
  }, [])

  const value = useMemo<WizardContextValue>(
    () => ({ state, setSection, saveDraft, clearDraft, isHydrated, saveVersion }),
    [state, setSection, saveDraft, clearDraft, isHydrated, saveVersion],
  )

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
}

function readDraftVersions(): { savedAt: string; state: WizardState }[] {
  try {
    return JSON.parse(localStorage.getItem('medicheck-profile-versions') ?? '[]') as {
      savedAt: string
      state: WizardState
    }[]
  } catch {
    return []
  }
}

export const useWizard = (): WizardContextValue => {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used within WizardProvider')
  return ctx
}