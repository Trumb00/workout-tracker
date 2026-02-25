'use server'

import { createClient } from '@/lib/supabase/server'

export async function getPersonalRecords() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('personal_records')
    .select('*')
    .order('exercise_name')
  if (error) throw new Error(error.message)
  return data
}

export async function getWeightHistory(exerciseName: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sets')
    .select(`
      weight_kg, reps,
      session_exercises!inner(
        exercise_name,
        workout_sessions!inner(started_at)
      )
    `)
    .eq('session_exercises.exercise_name', exerciseName)
    .eq('completed', true)
    .not('weight_kg', 'is', null)
    .order('session_exercises(workout_sessions(started_at))', { ascending: true })

  if (error) throw new Error(error.message)

  // Group by date: take max weight per session
  const byDate: Record<string, { date: string; weight: number; reps: number }> = {}
  for (const row of data ?? []) {
    const ex = (row.session_exercises as unknown as { exercise_name: string; workout_sessions: { started_at: string } })
    const date = ex.workout_sessions.started_at.split('T')[0]
    const weight = row.weight_kg ?? 0
    if (!byDate[date] || weight > byDate[date].weight) {
      byDate[date] = { date, weight, reps: row.reps ?? 0 }
    }
  }
  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getCardioHistory(exerciseName: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cardio_logs')
    .select(`
      distance_km, duration_sec, pace_sec_per_km,
      session_exercises!inner(
        exercise_name,
        workout_sessions!inner(started_at)
      )
    `)
    .eq('session_exercises.exercise_name', exerciseName)
    .not('distance_km', 'is', null)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => {
    const ex = (row.session_exercises as unknown as { exercise_name: string; workout_sessions: { started_at: string } })
    return {
      date: ex.workout_sessions.started_at.split('T')[0],
      distance: row.distance_km ?? 0,
      pace: row.pace_sec_per_km ?? null,
      duration: row.duration_sec ?? 0,
    }
  }).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getExerciseNames(type: 'gym' | 'cardio') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('session_exercises')
    .select(`
      exercise_name,
      workout_sessions!inner(type)
    `)
    .eq('workout_sessions.type', type)

  if (error) return []
  const names = [...new Set((data ?? []).map((r) => r.exercise_name))]
  return names.sort()
}
