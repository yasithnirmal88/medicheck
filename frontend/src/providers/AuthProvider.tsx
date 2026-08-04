import React, { createContext, useContext, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import type { PortalRole } from '@/features/auth/types/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const ROLE_STORAGE_KEY = 'medicheck:portal:role'

export type AuthContextType = {
  user: User | null
  loading: boolean
  role: PortalRole | null
  setRole: (role: PortalRole) => void
  clearRole: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  setRole: () => {},
  clearRole: () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRoleState] = useState<PortalRole | null>(() => {
    const stored = window.localStorage.getItem(ROLE_STORAGE_KEY)
    return stored === 'patient' || stored === 'doctor' ? stored : null
  })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const setRole = (next: PortalRole) => {
    window.localStorage.setItem(ROLE_STORAGE_KEY, next)
    setRoleState(next)
  }

  const clearRole = () => {
    window.localStorage.removeItem(ROLE_STORAGE_KEY)
    setRoleState(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, role, setRole, clearRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)