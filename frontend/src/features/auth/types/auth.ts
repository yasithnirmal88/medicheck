export type LoginFormValues = {
  email: string
  password: string
}

export type AuthErrorType = 'invalid-credentials' | 'user-not-found' | 'network' | 'too-many-attempts' | 'unknown'

export type FriendlyAuthError = {
  type: AuthErrorType
  message: string
}

export type PortalRole = 'patient' | 'doctor'

export type PortalRoleOption = {
  role: PortalRole
  title: string
  description: string
  features: string[]
}

export const ROLE_OPTIONS: PortalRoleOption[] = [
  {
    role: 'patient',
    title: 'Patient Portal',
    description: 'Track your health, assessments, reports and recommendations.',
    features: ['Health dashboard', 'Assessments & questionnaires', 'Laboratory results', 'Medical timeline'],
  },
  {
    role: 'doctor',
    title: 'Doctor CMS',
    description: 'Manage clinical content, rules and publishing workflows.',
    features: ['Knowledge center', 'Questionnaire builder', 'Clinical rules', 'Publishing workflow'],
  },
]

export const roleHomePath = (role: PortalRole): string =>
  role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'