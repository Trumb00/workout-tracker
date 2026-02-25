'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { completeSession, deleteSession } from '@/actions/sessions'
import { upsertSessionExercise, deleteSessionExercise } from '@/actions/exercises'
import { GymExerciseBlock } from './GymExerciseBlock'
import { CardioBlock } from './CardioBlock'
import { CustomBlock } from './CustomBlock'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTimer } from '@/hooks/useTimer'
import type { SessionWithExercises, WorkoutType } from '@/types/app'

interface WorkoutLoggerProps {
  session: SessionWithExercises
}

interface ExerciseState {
  id: string
  exercise_name: string
  position: number
  sets?: NonNullable<SessionWithExercises['session_exercises'][0]['sets']>
  cardio_logs?: NonNullable<SessionWithExercises['session_exercises'][0]['cardio_logs']>
  custom_metric_logs?: NonNullable<SessionWithExercises['session_exercises'][0]['custom_metric_logs']>
}

export function WorkoutLogger({ session }: WorkoutLoggerProps) {
  const router = useRouter()
  const { display } = useTimer(session.started_at)
  const [exercises, setExercises] = useState<ExerciseState[]>(session.session_exercises)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false)
  const [newExerciseName, setNewExerciseName] = useState('')
  const [isFinishing, startFinishing] = useTransition()
  const [isAbandoning, startAbandoning] = useTransition()

  async function handleAddExercise() {
    if (!newExerciseName.trim()) return
    const name = newExerciseName.trim()
    const position = exercises.length
    const id = await upsertSessionExercise({
      session_id: session.id,
      exercise_name: name,
      position,
    })
    setExercises((prev) => [...prev, { id, exercise_name: name, position }])
    setNewExerciseName('')
    setShowAddModal(false)
  }

  async function handleDeleteExercise(id: string) {
    await deleteSessionExercise(id)
    setExercises((prev) => prev.filter((e) => e.id !== id))
  }

  function handleFinish() {
    startFinishing(async () => {
      await completeSession(session.id)
      router.push(`/history/${session.id}`)
    })
  }

  function handleAbandon() {
    startAbandoning(async () => {
      await deleteSession(session.id)
      router.push('/log')
    })
  }

  return (
    <>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b border-slate-800">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-100 truncate">{session.name}</div>
          <div className="text-sm text-indigo-400 font-mono">{display}</div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowAbandonConfirm(true)}
          className="text-slate-500"
        >
          Cancel
        </Button>
        <Button size="sm" onClick={() => setShowFinishConfirm(true)}>
          Finish
        </Button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {exercises.map((ex) => {
          if (session.type === 'gym') {
            return (
              <GymExerciseBlock
                key={ex.id}
                exerciseId={ex.id}
                exerciseName={ex.exercise_name}
                initialSets={ex.sets ?? []}
                onDelete={() => handleDeleteExercise(ex.id)}
              />
            )
          }
          if (session.type === 'cardio') {
            return (
              <CardioBlock
                key={ex.id}
                exerciseId={ex.id}
                exerciseName={ex.exercise_name}
                initialLog={ex.cardio_logs?.[0] ?? null}
                onDelete={() => handleDeleteExercise(ex.id)}
              />
            )
          }
          return (
            <CustomBlock
              key={ex.id}
              exerciseId={ex.id}
              exerciseName={ex.exercise_name}
              initialMetrics={ex.custom_metric_logs ?? []}
              onDelete={() => handleDeleteExercise(ex.id)}
            />
          )
        })}

        <button
          onClick={() => setShowAddModal(true)}
          className="h-14 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 text-sm hover:border-slate-500 hover:text-slate-400 transition-colors"
        >
          + Add Exercise
        </button>
      </div>

      {/* Add exercise modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Exercise">
        <div className="flex flex-col gap-4">
          <Input
            label="Exercise Name"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            placeholder={session.type === 'cardio' ? 'e.g. Running' : 'e.g. Bench Press'}
            autoFocus
          />
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAddExercise}>
              Add
            </Button>
          </div>
        </div>
      </Modal>

      {/* Finish confirm */}
      <ConfirmDialog
        open={showFinishConfirm}
        title="Finish Workout?"
        message="This will save your session and update your personal records."
        confirmLabel="Finish"
        loading={isFinishing}
        onConfirm={handleFinish}
        onCancel={() => setShowFinishConfirm(false)}
      />

      {/* Abandon confirm */}
      <ConfirmDialog
        open={showAbandonConfirm}
        title="Cancel Workout?"
        message="All data from this session will be lost."
        confirmLabel="Cancel Workout"
        variant="danger"
        loading={isAbandoning}
        onConfirm={handleAbandon}
        onCancel={() => setShowAbandonConfirm(false)}
      />
    </>
  )
}
