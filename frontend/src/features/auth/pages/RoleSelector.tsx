import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, UserRound, Stethoscope } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../../../hooks/useAuth'
import { ROLE_OPTIONS, roleHomePath } from '../types/auth'
import type { PortalRole } from '../types/auth'

export const RoleSelectorPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, role, setRole, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      const path = role ? roleHomePath(role) : '/portal'
      navigate(path, { replace: true })
    }
  }, [loading, user, role, navigate])

  if (!loading && user) {
    return null
  }

  const choose = (selected: PortalRole) => {
    setRole(selected)
    navigate('/login')
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5 text-center lg:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome to Medicheck</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose how you want to sign in — this determines which portal you enter.
          </p>
        </div>

        <div className="space-y-3">
          {ROLE_OPTIONS.map((option, i) => (
            <RoleCard key={option.role} option={option} index={i} onSelect={() => choose(option.role)} />
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          You can switch later from the account menu.
        </p>
      </div>
    </AuthLayout>
  )
}

const ROLE_ICONS: Record<PortalRole, LucideIcon> = {
  patient: UserRound,
  doctor: Stethoscope,
}

function RoleCard({
  option,
  index,
  onSelect,
}: {
  option: (typeof ROLE_OPTIONS)[number]
  index: number
  onSelect: () => void
}) {
  const Icon = ROLE_ICONS[option.role]
  const isDoctor = option.role === 'doctor'
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      className={`group flex w-full items-start gap-4 rounded-2xl border p-5 text-left shadow-sm transition-all ${
        isDoctor
          ? 'border-slate-200 bg-white hover:border-teal-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-teal-500/50'
          : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-blue-500/50'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${
          isDoctor ? 'bg-gradient-to-br from-teal-500 to-emerald-500' : 'bg-gradient-to-br from-blue-600 to-teal-500'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-slate-900 dark:text-white">{option.title}</span>
          <ArrowRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500 dark:text-slate-600" />
        </span>
        <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{option.description}</span>
        <span className="mt-3 flex flex-wrap gap-1.5">
          {option.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-700/60 dark:text-slate-400"
            >
              {feature}
            </span>
          ))}
        </span>
      </span>
    </motion.button>
  )
}

export default RoleSelectorPage