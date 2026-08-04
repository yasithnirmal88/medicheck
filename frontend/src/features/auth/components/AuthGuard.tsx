import React from 'react'
import { useAuth } from '../../../hooks/useAuth'
import LoadingPage from '../../../shared/loading/LoadingPage'
import { Navigate } from 'react-router-dom'
import type { PortalRole } from '../types/auth'
import { roleHomePath } from '../types/auth'

interface AuthGuardProps {
  children: React.ReactNode
  role?: PortalRole
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, role }) => {
  const { user, loading, role: selectedRole } = useAuth()
  if (loading) return <LoadingPage />
  if (!user) return <Navigate to="/login" replace />

  if (role) {
    // A role-restricted route must match the selected portal role.
    if (!selectedRole) return <Navigate to="/portal" replace />
    if (selectedRole !== role) return <Navigate to={roleHomePath(selectedRole)} replace />
  }

  return <>{children}</>
}

export default AuthGuard

export const PatientGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard role="patient">{children}</AuthGuard>
)

export const DoctorGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard role="doctor">{children}</AuthGuard>
)

export const PortalRedirect: React.FC = () => {
  const { user, role, loading } = useAuth()
  if (loading) return <LoadingPage />
  if (!user) return <Navigate to="/portal" replace />
  return <Navigate to={role ? roleHomePath(role) : '/portal'} replace />
}