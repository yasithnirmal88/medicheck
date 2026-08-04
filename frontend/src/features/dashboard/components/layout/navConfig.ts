import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  FlaskConical,
  HeartPulse,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  User,
} from 'lucide-react'

export interface NavItem {
  label: string
  to?: string
  icon: LucideIcon
  badge?: number
  disabled?: boolean
  section?: string
}

export const primaryNav: NavItem[] = [
  { label: 'Dashboard', to: '/patient/dashboard', icon: LayoutDashboard },
  { label: 'Health Profile', to: '/patient/profile', icon: User },
  { label: 'Questionnaires', to: '/patient/questionnaires', icon: ClipboardList },
  { label: 'Assessments', to: '/patient/assessments', icon: Stethoscope },
  { label: 'Health Reports', to: '/patient/health-reports', icon: FileText },
  { label: 'Medical Timeline', to: '/patient/timeline', icon: Activity },
]

export const secondaryNav: NavItem[] = [
  { label: 'Recommendations', to: '/patient/recommendations', icon: HeartPulse },
  { label: 'Laboratory Results', to: '/patient/laboratory-results', icon: FlaskConical },
  { label: 'Body Systems', to: '/patient/body-systems', icon: Layers },
]

export const tertiaryNav: NavItem[] = [
  { label: 'Appointments', icon: Calendar, disabled: true },
  { label: 'Settings', to: '/patient/profile', icon: Settings },
]

export const utilityItems: NavItem[] = [
  { label: 'Settings', to: '/patient/profile', icon: Settings },
  { label: 'Help & Support', icon: BookOpen },
  { label: 'Logout', icon: LogOut },
]

export function defaultActiveHref(): string {
  return '/patient/dashboard'
}