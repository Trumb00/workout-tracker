'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TemplateFormData } from '@/types/app'

export async function getTemplates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_templates')
    .select('*, template_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function getTemplate(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_templates')
    .select('*, template_items(*)')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  // Sort items by position
  data.template_items.sort((a, b) => a.position - b.position)
  return data
}

export async function createTemplate(formData: TemplateFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: template, error: templateError } = await supabase
    .from('workout_templates')
    .insert({ user_id: user.id, name: formData.name, type: formData.type, notes: formData.notes || null })
    .select()
    .single()
  if (templateError) throw new Error(templateError.message)

  if (formData.items.length > 0) {
    const items = formData.items.map((item, index) => ({
      template_id: template.id,
      position: index,
      exercise_name: item.exercise_name,
      target_sets: item.target_sets ?? null,
      target_reps: item.target_reps ?? null,
      target_weight_kg: item.target_weight_kg ?? null,
      target_distance_km: item.target_distance_km ?? null,
      target_duration_sec: item.target_duration_sec ?? null,
      custom_metric_name: item.custom_metric_name ?? null,
      custom_metric_unit: item.custom_metric_unit ?? null,
    }))
    const { error: itemsError } = await supabase.from('template_items').insert(items)
    if (itemsError) throw new Error(itemsError.message)
  }

  revalidatePath('/templates')
  return template.id
}

export async function updateTemplate(id: string, formData: TemplateFormData) {
  const supabase = await createClient()

  const { error: updateError } = await supabase
    .from('workout_templates')
    .update({ name: formData.name, type: formData.type, notes: formData.notes || null, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (updateError) throw new Error(updateError.message)

  // Replace all items
  await supabase.from('template_items').delete().eq('template_id', id)

  if (formData.items.length > 0) {
    const items = formData.items.map((item, index) => ({
      template_id: id,
      position: index,
      exercise_name: item.exercise_name,
      target_sets: item.target_sets ?? null,
      target_reps: item.target_reps ?? null,
      target_weight_kg: item.target_weight_kg ?? null,
      target_distance_km: item.target_distance_km ?? null,
      target_duration_sec: item.target_duration_sec ?? null,
      custom_metric_name: item.custom_metric_name ?? null,
      custom_metric_unit: item.custom_metric_unit ?? null,
    }))
    const { error: itemsError } = await supabase.from('template_items').insert(items)
    if (itemsError) throw new Error(itemsError.message)
  }

  revalidatePath('/templates')
  revalidatePath(`/templates/${id}`)
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('workout_templates').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/templates')
}
