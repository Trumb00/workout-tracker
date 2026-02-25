'use server'

import { createClient } from '@/lib/supabase/server'

export async function upsertSessionExercise(data: {
  id?: string
  session_id: string
  exercise_name: string
  position: number
}) {
  const supabase = await createClient()
  if (data.id) {
    const { error } = await supabase
      .from('session_exercises')
      .update({ exercise_name: data.exercise_name, position: data.position })
      .eq('id', data.id)
    if (error) throw new Error(error.message)
    return data.id
  }
  const { data: ex, error } = await supabase
    .from('session_exercises')
    .insert({ session_id: data.session_id, exercise_name: data.exercise_name, position: data.position })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return ex.id
}

export async function deleteSessionExercise(id: string) {
  const supabase = await createClient()
  await supabase.from('session_exercises').delete().eq('id', id)
}

export async function upsertSet(data: {
  id?: string
  session_exercise_id: string
  set_number: number
  reps?: number | null
  weight_kg?: number | null
  completed?: boolean
}) {
  const supabase = await createClient()
  if (data.id) {
    const { error } = await supabase
      .from('sets')
      .update({ reps: data.reps ?? null, weight_kg: data.weight_kg ?? null, completed: data.completed ?? true })
      .eq('id', data.id)
    if (error) throw new Error(error.message)
    return data.id
  }
  const { data: set, error } = await supabase
    .from('sets')
    .insert({
      session_exercise_id: data.session_exercise_id,
      set_number: data.set_number,
      reps: data.reps ?? null,
      weight_kg: data.weight_kg ?? null,
      completed: data.completed ?? true,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return set.id
}

export async function deleteSet(id: string) {
  const supabase = await createClient()
  await supabase.from('sets').delete().eq('id', id)
}

export async function upsertCardioLog(data: {
  id?: string
  session_exercise_id: string
  distance_km?: number | null
  duration_sec?: number | null
}) {
  const supabase = await createClient()
  if (data.id) {
    const { error } = await supabase
      .from('cardio_logs')
      .update({ distance_km: data.distance_km ?? null, duration_sec: data.duration_sec ?? null })
      .eq('id', data.id)
    if (error) throw new Error(error.message)
    return data.id
  }
  const { data: log, error } = await supabase
    .from('cardio_logs')
    .insert({
      session_exercise_id: data.session_exercise_id,
      distance_km: data.distance_km ?? null,
      duration_sec: data.duration_sec ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return log.id
}

export async function upsertCustomMetric(data: {
  id?: string
  session_exercise_id: string
  metric_name: string
  metric_value?: number | null
  metric_unit?: string | null
}) {
  const supabase = await createClient()
  if (data.id) {
    const { error } = await supabase
      .from('custom_metric_logs')
      .update({ metric_name: data.metric_name, metric_value: data.metric_value ?? null, metric_unit: data.metric_unit ?? null })
      .eq('id', data.id)
    if (error) throw new Error(error.message)
    return data.id
  }
  const { data: metric, error } = await supabase
    .from('custom_metric_logs')
    .insert({
      session_exercise_id: data.session_exercise_id,
      metric_name: data.metric_name,
      metric_value: data.metric_value ?? null,
      metric_unit: data.metric_unit ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return metric.id
}
