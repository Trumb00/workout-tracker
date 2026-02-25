'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createTemplate, updateTemplate, deleteTemplate } from '@/actions/templates'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NumberInput } from '@/components/ui/NumberInput'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { TemplateFormData, TemplateItemFormData, WorkoutType, TemplateWithItems } from '@/types/app'

interface TemplateFormProps {
  existing?: TemplateWithItems
}

const emptyGymItem = (): TemplateItemFormData => ({ exercise_name: '', target_sets: 3, target_reps: 10, target_weight_kg: null })
const emptyCardioItem = (): TemplateItemFormData => ({ exercise_name: '', target_distance_km: null, target_duration_sec: null })
const emptyCustomItem = (): TemplateItemFormData => ({ exercise_name: '', custom_metric_name: '', custom_metric_unit: '' })

export function TemplateForm({ existing }: TemplateFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleting] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(existing?.name ?? '')
  const [type, setType] = useState<WorkoutType>(existing?.type ?? 'gym')
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [items, setItems] = useState<TemplateItemFormData[]>(
    existing?.template_items.map((i) => ({
      exercise_name: i.exercise_name,
      target_sets: i.target_sets,
      target_reps: i.target_reps,
      target_weight_kg: i.target_weight_kg,
      target_distance_km: i.target_distance_km,
      target_duration_sec: i.target_duration_sec,
      custom_metric_name: i.custom_metric_name,
      custom_metric_unit: i.custom_metric_unit,
    })) ?? []
  )

  function addItem() {
    if (type === 'gym') setItems([...items, emptyGymItem()])
    else if (type === 'cardio') setItems([...items, emptyCardioItem()])
    else setItems([...items, emptyCustomItem()])
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, patch: Partial<TemplateItemFormData>) {
    setItems(items.map((item, i) => i === index ? { ...item, ...patch } : item))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim()) { setError('Name is required'); return }

    const formData: TemplateFormData = {
      name: name.trim(),
      type,
      notes: notes.trim() || undefined,
      items: items.filter((i) => i.exercise_name.trim()),
    }

    startTransition(async () => {
      try {
        if (existing) {
          await updateTemplate(existing.id, formData)
          router.push('/templates')
        } else {
          await createTemplate(formData)
          router.push('/templates')
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
      }
    })
  }

  function handleDelete() {
    startDeleting(async () => {
      try {
        await deleteTemplate(existing!.id)
        router.push('/templates')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Delete failed')
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4">
        <Input
          label="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Push Day"
          required
        />

        {/* Type selector */}
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(['gym', 'cardio', 'custom'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setItems([]) }}
                className={`h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-sm font-medium transition-colors ${
                  type === t
                    ? t === 'gym' ? 'bg-blue-600 text-white' : t === 'cardio' ? 'bg-emerald-600 text-white' : 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <span>{t === 'gym' ? '🏋️' : t === 'cardio' ? '🏃' : '✏️'}</span>
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">Exercises</label>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
            >
              + Add
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex gap-2 items-start">
                  <Input
                    value={item.exercise_name}
                    onChange={(e) => updateItem(index, { exercise_name: e.target.value })}
                    placeholder={type === 'gym' ? 'Exercise name' : type === 'cardio' ? 'Activity name' : 'Metric name'}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-0 h-11 w-11 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {type === 'gym' && (
                  <div className="grid grid-cols-3 gap-2">
                    <NumberInput
                      label="Sets"
                      value={item.target_sets ?? ''}
                      onChange={(v) => updateItem(index, { target_sets: v === '' ? null : v })}
                      min={1}
                    />
                    <NumberInput
                      label="Reps"
                      value={item.target_reps ?? ''}
                      onChange={(v) => updateItem(index, { target_reps: v === '' ? null : v })}
                      min={1}
                    />
                    <NumberInput
                      label="kg"
                      value={item.target_weight_kg ?? ''}
                      onChange={(v) => updateItem(index, { target_weight_kg: v === '' ? null : v })}
                      min={0}
                      step={2.5}
                    />
                  </div>
                )}
                {type === 'cardio' && (
                  <div className="grid grid-cols-2 gap-2">
                    <NumberInput
                      label="Distance (km)"
                      value={item.target_distance_km ?? ''}
                      onChange={(v) => updateItem(index, { target_distance_km: v === '' ? null : v })}
                      min={0}
                      step={0.5}
                    />
                    <NumberInput
                      label="Duration (min)"
                      value={item.target_duration_sec != null ? Math.round(item.target_duration_sec / 60) : ''}
                      onChange={(v) => updateItem(index, { target_duration_sec: v === '' ? null : (v as number) * 60 })}
                      min={0}
                    />
                  </div>
                )}
                {type === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={item.custom_metric_name ?? ''}
                      onChange={(e) => updateItem(index, { custom_metric_name: e.target.value })}
                      placeholder="Metric name"
                    />
                    <Input
                      value={item.custom_metric_unit ?? ''}
                      onChange={(e) => updateItem(index, { custom_metric_unit: e.target.value })}
                      placeholder="Unit"
                    />
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && (
              <button
                type="button"
                onClick={addItem}
                className="h-16 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-sm hover:border-slate-600 hover:text-slate-400 transition-colors"
              >
                Tap to add first exercise
              </button>
            )}
          </div>
        </div>

        <Input
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes..."
        />

        {error && (
          <p className="text-sm text-red-400 bg-red-950 border border-red-900 rounded-xl px-3 py-2">{error}</p>
        )}

        <Button type="submit" size="lg" loading={isPending} className="w-full">
          {existing ? 'Save Changes' : 'Create Template'}
        </Button>

        {existing && (
          <Button
            type="button"
            variant="danger"
            size="md"
            className="w-full"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Template
          </Button>
        )}
      </form>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Template?"
        message="This will permanently delete the template. Past workouts using it will not be affected."
        confirmLabel="Delete"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}
