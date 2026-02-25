'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { startSession } from '@/actions/sessions'
import { Badge } from '@/components/ui/Badge'
import type { WorkoutType } from '@/types/app'

interface StartWorkoutButtonProps {
  type: WorkoutType
  name: string
  templateId?: string
  itemCount?: number
}

export function StartWorkoutButton({ type, name, templateId, itemCount }: StartWorkoutButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleStart() {
    startTransition(async () => {
      const sessionId = await startSession({ type, name, templateId })
      router.push(`/log/${sessionId}`)
    })
  }

  if (!templateId) {
    return (
      <button
        onClick={handleStart}
        disabled={isPending}
        className={`flex flex-col items-center justify-center h-20 rounded-2xl gap-1 font-medium text-sm transition-colors disabled:opacity-50 ${
          type === 'gym' ? 'bg-blue-900 hover:bg-blue-800 text-blue-300' :
          type === 'cardio' ? 'bg-emerald-900 hover:bg-emerald-800 text-emerald-300' :
          'bg-violet-900 hover:bg-violet-800 text-violet-300'
        }`}
      >
        <span className="text-2xl">
          {type === 'gym' ? '🏋️' : type === 'cardio' ? '🏃' : '✏️'}
        </span>
        <span className="capitalize">{type}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleStart}
      disabled={isPending}
      className="flex items-center gap-3 bg-slate-900 rounded-2xl p-3 hover:bg-slate-800 w-full text-left transition-colors disabled:opacity-50"
    >
      <span className="text-2xl">
        {type === 'gym' ? '🏋️' : type === 'cardio' ? '🏃' : '✏️'}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-100 truncate">{name}</div>
        {itemCount !== undefined && (
          <div className="text-xs text-slate-500">{itemCount} exercises</div>
        )}
      </div>
      <Badge type={type} />
    </button>
  )
}
