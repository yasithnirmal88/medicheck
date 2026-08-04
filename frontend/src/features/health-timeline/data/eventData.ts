import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertTriangle,
  Apple,
  BellRing,
  Bone,
  Brain,
  Building2,
  Calendar,
  ClipboardCheck,
  ClipboardList,
  Droplets,
  Dumbbell,
  Eye,
  FileText,
  FlaskConical,
  Gauge,
  Heart,
  HeartPulse,
  Moon,
  Pill,
  RefreshCw,
  Scale,
  Shield,
  Siren,
  Sparkles,
  Stethoscope,
  Syringe,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  User,
  Utensils,
  Wind,
} from 'lucide-react'
import type { BodySystemName, SourceModule, TimelineEventType } from '../types'

export type EventTone = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

export interface EventTypeMeta {
  label: string
  icon: LucideIcon
  tone: EventTone
}

export const EVENT_TONE_CLASSES: Record<EventTone, { icon: string; dot: string; text: string; soft: string }> = {
  primary: {
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
    dot: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-300',
    soft: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  },
  accent: {
    icon: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
    dot: 'bg-teal-500',
    text: 'text-teal-600 dark:text-teal-300',
    soft: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
  },
  success: {
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-300',
    soft: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
  warning: {
    icon: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-300',
    soft: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  },
  danger: {
    icon: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300',
    dot: 'bg-red-500',
    text: 'text-red-600 dark:text-red-300',
    soft: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  },
  info: {
    icon: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
    dot: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-300',
    soft: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  },
}

export const EVENT_TYPE_META: Record<TimelineEventType, EventTypeMeta> = {
  profile_updated: { label: 'Health Profile Updated', icon: User, tone: 'primary' },
  questionnaire_started: { label: 'Questionnaire Started', icon: ClipboardList, tone: 'primary' },
  questionnaire_completed: { label: 'Questionnaire Completed', icon: ClipboardCheck, tone: 'primary' },
  assessment_started: { label: 'Assessment Started', icon: Stethoscope, tone: 'info' },
  assessment_completed: { label: 'Assessment Completed', icon: Activity, tone: 'info' },
  health_report_generated: { label: 'Health Report Generated', icon: FileText, tone: 'accent' },
  laboratory_uploaded: { label: 'Laboratory Report Uploaded', icon: FlaskConical, tone: 'warning' },
  laboratory_updated: { label: 'Laboratory Result Updated', icon: FlaskConical, tone: 'warning' },
  medication_added: { label: 'Medication Added', icon: Pill, tone: 'accent' },
  medication_changed: { label: 'Medication Changed', icon: RefreshCw, tone: 'accent' },
  vaccination_recorded: { label: 'Vaccination Recorded', icon: Syringe, tone: 'success' },
  doctor_review: { label: 'Doctor Review', icon: Stethoscope, tone: 'info' },
  lifestyle_goal_created: { label: 'Lifestyle Goal Created', icon: Target, tone: 'success' },
  lifestyle_goal_completed: { label: 'Lifestyle Goal Completed', icon: Trophy, tone: 'success' },
  exercise_milestone: { label: 'Exercise Milestone', icon: Dumbbell, tone: 'success' },
  weight_updated: { label: 'Weight Updated', icon: Scale, tone: 'primary' },
  blood_pressure_updated: { label: 'Blood Pressure Updated', icon: Gauge, tone: 'danger' },
  blood_sugar_updated: { label: 'Blood Sugar Updated', icon: Droplets, tone: 'warning' },
  hospital_visit: { label: 'Hospital Visit', icon: Building2, tone: 'danger' },
  medical_procedure: { label: 'Medical Procedure', icon: Activity, tone: 'danger' },
  emergency_event: { label: 'Emergency Event', icon: Siren, tone: 'danger' },
  followup_reminder: { label: 'Follow-up Reminder', icon: BellRing, tone: 'warning' },
  ai_recommendation: { label: 'AI Recommendation', icon: Sparkles, tone: 'info' },
  risk_level_changed: { label: 'Risk Level Changed', icon: AlertTriangle, tone: 'warning' },
  health_score_improved: { label: 'Health Score Improved', icon: TrendingUp, tone: 'success' },
  health_score_declined: { label: 'Health Score Declined', icon: TrendingDown, tone: 'danger' },
  future_appointment: { label: 'Future Appointment', icon: Calendar, tone: 'primary' },
}

export const BODY_SYSTEM_META: Record<BodySystemName, { label: string; icon: LucideIcon; tone: EventTone }> = {
  heart: { label: 'Heart', icon: Heart, tone: 'danger' },
  kidneys: { label: 'Kidneys', icon: Droplets, tone: 'warning' },
  liver: { label: 'Liver', icon: Activity, tone: 'warning' },
  lungs: { label: 'Lungs', icon: Wind, tone: 'accent' },
  brain: { label: 'Brain', icon: Brain, tone: 'info' },
  mental_health: { label: 'Mental Health', icon: Brain, tone: 'info' },
  nutrition: { label: 'Nutrition', icon: Apple, tone: 'success' },
  sleep: { label: 'Sleep', icon: Moon, tone: 'info' },
  exercise: { label: 'Exercise', icon: Dumbbell, tone: 'success' },
  digestive: { label: 'Digestive', icon: Utensils, tone: 'warning' },
  eyes: { label: 'Eyes', icon: Eye, tone: 'accent' },
  bones: { label: 'Bones', icon: Bone, tone: 'warning' },
  immune: { label: 'Immune', icon: Shield, tone: 'success' },
  general: { label: 'General', icon: HeartPulse, tone: 'primary' },
  lifestyle: { label: 'Lifestyle', icon: Apple, tone: 'success' },
}

export const BODY_SYSTEM_ORDER: BodySystemName[] = [
  'heart',
  'kidneys',
  'liver',
  'lungs',
  'brain',
  'mental_health',
  'nutrition',
  'sleep',
  'exercise',
  'digestive',
  'eyes',
  'bones',
  'immune',
  'general',
]

export const SOURCE_LABELS: Record<SourceModule, string> = {
  profile: 'Profile',
  assessment: 'Assessment',
  laboratory: 'Laboratory',
  medication: 'Medication',
  vaccination: 'Vaccination',
  doctor: 'Doctor',
  lifestyle: 'Lifestyle',
  hospital: 'Hospital',
  ai: 'AI Generated',
  wearable: 'Wearable',
  manual: 'Manual Entry',
}
