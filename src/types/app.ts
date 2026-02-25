import type { Database } from '@/lib/supabase/types'

export type WorkoutType = 'gym' | 'cardio' | 'custom'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type WorkoutTemplate = Database['public']['Tables']['workout_templates']['Row']
export type TemplateItem = Database['public']['Tables']['template_items']['Row']
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']
export type SessionExercise = Database['public']['Tables']['session_exercises']['Row']
export type SetRow = Database['public']['Tables']['sets']['Row']
export type CardioLog = Database['public']['Tables']['cardio_logs']['Row']
export type CustomMetricLog = Database['public']['Tables']['custom_metric_logs']['Row']
export type PersonalRecord = Database['public']['Tables']['personal_records']['Row']

export interface TemplateWithItems extends WorkoutTemplate {
  template_items: TemplateItem[]
}

export interface SessionWithExercises extends WorkoutSession {
  session_exercises: SessionExerciseWithData[]
}

export interface SessionExerciseWithData extends SessionExercise {
  sets?: SetRow[]
  cardio_logs?: CardioLog[]
  custom_metric_logs?: CustomMetricLog[]
}

export interface TemplateItemFormData {
  exercise_name: string
  target_sets?: number | null
  target_reps?: number | null
  target_weight_kg?: number | null
  target_distance_km?: number | null
  target_duration_sec?: number | null
  custom_metric_name?: string | null
  custom_metric_unit?: string | null
}

export interface TemplateFormData {
  name: string
  type: WorkoutType
  notes?: string
  items: TemplateItemFormData[]
}
