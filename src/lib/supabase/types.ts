// Database types — matches the schema.sql structure
// After creating your Supabase project, regenerate with:
// npx supabase gen types typescript --project-id <your-project-id> > src/lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type WorkoutType = 'gym' | 'cardio' | 'custom'
export type PRType = 'gym' | 'cardio'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      workout_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          type: WorkoutType
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: WorkoutType
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: WorkoutType
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'workout_templates_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      template_items: {
        Row: {
          id: string
          template_id: string
          position: number
          exercise_name: string
          target_sets: number | null
          target_reps: number | null
          target_weight_kg: number | null
          target_distance_km: number | null
          target_duration_sec: number | null
          custom_metric_name: string | null
          custom_metric_unit: string | null
        }
        Insert: {
          id?: string
          template_id: string
          position?: number
          exercise_name: string
          target_sets?: number | null
          target_reps?: number | null
          target_weight_kg?: number | null
          target_distance_km?: number | null
          target_duration_sec?: number | null
          custom_metric_name?: string | null
          custom_metric_unit?: string | null
        }
        Update: {
          id?: string
          template_id?: string
          position?: number
          exercise_name?: string
          target_sets?: number | null
          target_reps?: number | null
          target_weight_kg?: number | null
          target_distance_km?: number | null
          target_duration_sec?: number | null
          custom_metric_name?: string | null
          custom_metric_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'template_items_template_id_fkey'
            columns: ['template_id']
            isOneToOne: false
            referencedRelation: 'workout_templates'
            referencedColumns: ['id']
          }
        ]
      }
      workout_sessions: {
        Row: {
          id: string
          user_id: string
          template_id: string | null
          name: string
          type: WorkoutType
          started_at: string
          ended_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id?: string | null
          name: string
          type: WorkoutType
          started_at?: string
          ended_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string | null
          name?: string
          type?: WorkoutType
          started_at?: string
          ended_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'workout_sessions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      session_exercises: {
        Row: {
          id: string
          session_id: string
          exercise_name: string
          position: number
          notes: string | null
        }
        Insert: {
          id?: string
          session_id: string
          exercise_name: string
          position?: number
          notes?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          exercise_name?: string
          position?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'session_exercises_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'workout_sessions'
            referencedColumns: ['id']
          }
        ]
      }
      sets: {
        Row: {
          id: string
          session_exercise_id: string
          set_number: number
          reps: number | null
          weight_kg: number | null
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          session_exercise_id: string
          set_number: number
          reps?: number | null
          weight_kg?: number | null
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          session_exercise_id?: string
          set_number?: number
          reps?: number | null
          weight_kg?: number | null
          completed?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'sets_session_exercise_id_fkey'
            columns: ['session_exercise_id']
            isOneToOne: false
            referencedRelation: 'session_exercises'
            referencedColumns: ['id']
          }
        ]
      }
      cardio_logs: {
        Row: {
          id: string
          session_exercise_id: string
          distance_km: number | null
          duration_sec: number | null
          pace_sec_per_km: number | null
        }
        Insert: {
          id?: string
          session_exercise_id: string
          distance_km?: number | null
          duration_sec?: number | null
        }
        Update: {
          id?: string
          session_exercise_id?: string
          distance_km?: number | null
          duration_sec?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'cardio_logs_session_exercise_id_fkey'
            columns: ['session_exercise_id']
            isOneToOne: false
            referencedRelation: 'session_exercises'
            referencedColumns: ['id']
          }
        ]
      }
      custom_metric_logs: {
        Row: {
          id: string
          session_exercise_id: string
          metric_name: string
          metric_value: number | null
          metric_unit: string | null
        }
        Insert: {
          id?: string
          session_exercise_id: string
          metric_name: string
          metric_value?: number | null
          metric_unit?: string | null
        }
        Update: {
          id?: string
          session_exercise_id?: string
          metric_name?: string
          metric_value?: number | null
          metric_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'custom_metric_logs_session_exercise_id_fkey'
            columns: ['session_exercise_id']
            isOneToOne: false
            referencedRelation: 'session_exercises'
            referencedColumns: ['id']
          }
        ]
      }
      personal_records: {
        Row: {
          id: string
          user_id: string
          exercise_name: string
          type: PRType
          best_weight_kg: number | null
          best_reps: number | null
          best_1rm_kg: number | null
          best_distance_km: number | null
          best_pace_sec_per_km: number | null
          best_duration_sec: number | null
          achieved_at: string | null
          session_id: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_name: string
          type: PRType
          best_weight_kg?: number | null
          best_reps?: number | null
          best_1rm_kg?: number | null
          best_distance_km?: number | null
          best_pace_sec_per_km?: number | null
          best_duration_sec?: number | null
          achieved_at?: string | null
          session_id?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_name?: string
          type?: PRType
          best_weight_kg?: number | null
          best_reps?: number | null
          best_1rm_kg?: number | null
          best_distance_km?: number | null
          best_pace_sec_per_km?: number | null
          best_duration_sec?: number | null
          achieved_at?: string | null
          session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'personal_records_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      refresh_gym_prs: {
        Args: { p_session_id: string }
        Returns: undefined
      }
      refresh_cardio_prs: {
        Args: { p_session_id: string }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
