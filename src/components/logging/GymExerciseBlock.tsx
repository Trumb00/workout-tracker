'use client'

import { useState, useCallback } from 'react'
import { upsertSet, deleteSet } from '@/actions/exercises'
import { NumberInput } from '@/components/ui/NumberInput'
import type { SetRow as SetRowType } from '@/types/app'

interface SetData {
  id?: string
  set_number: number
  reps: number | ''
  weight_kg: number | ''
  completed: boolean
}

interface GymExerciseBlockProps {
  exerciseId: string
  exerciseName: string
  initialSets?: SetRowType[]
  onDelete: () => void
}

export function GymExerciseBlock({ exerciseId, exerciseName, initialSets = [], onDelete }: GymExerciseBlockProps) {
  const [sets, setSets] = useState<SetData[]>(
    initialSets.length > 0
      ? initialSets.map((s) => ({
          id: s.id,
          set_number: s.set_number,
          reps: s.reps ?? '',
          weight_kg: s.weight_kg ?? '',
          completed: s.completed,
        }))
      : [{ set_number: 1, reps: '', weight_kg: '', completed: false }]
  )

  const saveSet = useCallback(async (index: number, data: SetData) => {
    const id = await upsertSet({
      id: data.id,
      session_exercise_id: exerciseId,
      set_number: data.set_number,
      reps: data.reps === '' ? null : data.reps,
      weight_kg: data.weight_kg === '' ? null : data.weight_kg,
      completed: data.completed,
    })
    setSets((prev) => prev.map((s, i) => i === index ? { ...s, id } : s))
  }, [exerciseId])

  function updateSet(index: number, patch: Partial<SetData>) {
    setSets((prev) => {
      const updated = prev.map((s, i) => i === index ? { ...s, ...patch } : s)
      saveSet(index, updated[index])
      return updated
    })
  }

  function addSet() {
    const lastCompleted = [...sets].reverse().find((s) => s.weight_kg !== '')
    setSets((prev) => [
      ...prev,
      {
        set_number: prev.length + 1,
        reps: lastCompleted?.reps ?? '',
        weight_kg: lastCompleted?.weight_kg ?? '',
        completed: false,
      },
    ])
  }

  async function handleDeleteSet(index: number) {
    const set = sets[index]
    if (set.id) await deleteSet(set.id)
    setSets((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, set_number: i + 1 })))
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-100">{exerciseName}</h3>
        <button
          onClick={onDelete}
          className="text-slate-500 hover:text-red-400 p-1 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 text-xs text-slate-500 px-1">
        <span>#</span><span>Weight (kg)</span><span>Reps</span><span></span>
      </div>

      {sets.map((set, index) => (
        <div key={index} className={`grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center rounded-xl p-1 transition-colors ${set.completed ? 'bg-emerald-950/50' : ''}`}>
          <button
            onClick={() => updateSet(index, { completed: !set.completed })}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
              set.completed ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {set.completed ? '✓' : set.set_number}
          </button>
          <NumberInput
            value={set.weight_kg}
            onChange={(v) => updateSet(index, { weight_kg: v })}
            min={0}
            step={2.5}
            placeholder="0"
          />
          <NumberInput
            value={set.reps}
            onChange={(v) => updateSet(index, { reps: v })}
            min={0}
            placeholder="0"
          />
          <button
            onClick={() => handleDeleteSet(index)}
            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-red-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}

      <button
        onClick={addSet}
        className="h-10 rounded-xl border border-dashed border-slate-700 text-slate-500 text-sm hover:border-slate-500 hover:text-slate-400 transition-colors"
      >
        + Add Set
      </button>
    </div>
  )
}
