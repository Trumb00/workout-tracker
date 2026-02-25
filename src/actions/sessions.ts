'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { WorkoutType } from '@/types/app'

export async function startSession(options: {
  type: WorkoutType
  name: string
  templateId?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: session, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: user.id,
      template_id: options.templateId ?? null,
      name: options.name,
      type: options.type,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)

  // If starting from a template, pre-populate exercises
  if (options.templateId) {
    const { data: items } = await supabase
      .from('template_items')
      .select('*')
      .eq('template_id', options.templateId)
      .order('position')

    if (items && items.length > 0) {
      const exercises = items.map((item, i) => ({
        session_id: session.id,
        exercise_name: item.exercise_name,
        position: i,
      }))
      await supabase.from('session_exercises').insert(exercises)
    }
  }

  return session.id
}

export async function completeSession(sessionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('workout_sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', sessionId)
  if (error) throw new Error(error.message)

  // Refresh PRs
  await supabase.rpc('refresh_gym_prs', { p_session_id: sessionId })
  await supabase.rpc('refresh_cardio_prs', { p_session_id: sessionId })

  revalidatePath('/history')
  revalidatePath('/records')
  revalidatePath('/dashboard')
  return sessionId
}

export async function deleteSession(sessionId: string) {
  const supabase = await createClient()
  await supabase.from('workout_sessions').delete().eq('id', sessionId)
  revalidatePath('/history')
  revalidatePath('/dashboard')
}

export async function getSession(sessionId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      session_exercises (
        *,
        sets (*),
        cardio_logs (*),
        custom_metric_logs (*)
      )
    `)
    .eq('id', sessionId)
    .single()
  if (error) throw new Error(error.message)
  data.session_exercises.sort((a, b) => a.position - b.position)
  return data
}

export async function getSessions(limit = 20, offset = 0) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .not('ended_at', 'is', null)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw new Error(error.message)
  return data
}

export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [{ count: weekCount }, { data: lastSession }, { data: allSets }] = await Promise.all([
    supabase
      .from('workout_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('ended_at', 'is', null)
      .gte('started_at', weekAgo.toISOString()),
    supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .not('ended_at', 'is', null)
      .order('started_at', { ascending: false })
      .limit(1),
    supabase
      .from('sets')
      .select('weight_kg, reps, session_exercises!inner(session_id, workout_sessions!inner(user_id, started_at))')
      .eq('session_exercises.workout_sessions.user_id', user.id)
      .gte('session_exercises.workout_sessions.started_at', weekAgo.toISOString())
      .eq('completed', true),
  ])

  const totalVolume = (allSets || []).reduce((sum, s) => {
    return sum + ((s.weight_kg ?? 0) * (s.reps ?? 0))
  }, 0)

  return {
    sessionsThisWeek: weekCount ?? 0,
    lastWorkout: lastSession?.[0] ?? null,
    weeklyVolume: Math.round(totalVolume),
  }
}
