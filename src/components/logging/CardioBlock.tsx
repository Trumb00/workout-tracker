'use client'

import { useState, useEffect, useCallback } from 'react'
import { upsertCardioLog } from '@/actions/exercises'
import { NumberInput } from '@/components/ui/NumberInput'
import { calcPace, formatPace } from '@/lib/utils/pace'
import type { CardioLog } from '@/types/app'

interface CardioBlockProps {
  exerciseId: string
  exerciseName: string
  initialLog?: CardioLog | null
  onDelete: () => void
}

export function CardioBlock({ exerciseId, exerciseName, initialLog, onDelete }: CardioBlockProps) {
  const [logId, setLogId] = useState<string | undefined>(initialLog?.id)
  const [distance, setDistance] = useState<number | ''>(initialLog?.distance_km ?? '')
  const [hours, setHours] = useState<number | ''>(
    initialLog?.duration_sec != null ? Math.floor(initialLog.duration_sec / 3600) : ''
  )
  const [minutes, setMinutes] = useState<number | ''>(
    initialLog?.duration_sec != null ? Math.floor((initialLog.duration_sec % 3600) / 60) : ''
  )
  const [seconds, setSeconds] = useState<number | ''>(
    initialLog?.duration_sec != null ? initialLog.duration_sec % 60 : ''
  )

  const totalSec =
    (hours === '' ? 0 : hours) * 3600 +
    (minutes === '' ? 0 : minutes) * 60 +
    (seconds === '' ? 0 : seconds)

  const pace = distance !== '' && distance > 0 && totalSec > 0
    ? calcPace(distance as number, totalSec)
    : null

  const save = useCallback(async () => {
    const id = await upsertCardioLog({
      id: logId,
      session_exercise_id: exerciseId,
      distance_km: distance === '' ? null : distance as number,
      duration_sec: totalSec > 0 ? totalSec : null,
    })
    setLogId(id)
  }, [logId, exerciseId, distance, totalSec])

  // Auto-save on change with debounce
  useEffect(() => {
    const timer = setTimeout(() => { save() }, 800)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, hours, minutes, seconds])

  return (
    <div className="bg-slate-900 rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-100">{exerciseName}</h3>
        <button onClick={onDelete} className="text-slate-500 hover:text-red-400 p-1 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <NumberInput
        label="Distance (km)"
        value={distance}
        onChange={setDistance}
        min={0}
        step={0.1}
        placeholder="0.0"
      />

      <div>
        <label className="text-sm font-medium text-slate-300 block mb-1">Duration</label>
        <div className="grid grid-cols-3 gap-2">
          <NumberInput
            label="h"
            value={hours}
            onChange={setHours}
            min={0}
            max={23}
            placeholder="0"
          />
          <NumberInput
            label="min"
            value={minutes}
            onChange={setMinutes}
            min={0}
            max={59}
            placeholder="0"
          />
          <NumberInput
            label="sec"
            value={seconds}
            onChange={setSeconds}
            min={0}
            max={59}
            placeholder="0"
          />
        </div>
      </div>

      {pace !== null && (
        <div className="bg-slate-800 rounded-xl px-4 py-2 text-center">
          <span className="text-emerald-400 font-semibold text-lg">{formatPace(pace)}</span>
          <span className="text-slate-500 text-sm ml-2">pace</span>
        </div>
      )}
    </div>
  )
}
