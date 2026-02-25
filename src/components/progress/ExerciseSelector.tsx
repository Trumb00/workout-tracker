'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface ExerciseSelectorProps {
  names: string[]
  selectedName?: string
  paramKey?: string
}

export function ExerciseSelector({ names, selectedName, paramKey = 'exercise' }: ExerciseSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (names.length === 0) {
    return <p className="text-slate-500 text-sm px-1">No exercises logged yet.</p>
  }

  return (
    <select
      value={selectedName ?? ''}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString())
        if (e.target.value) params.set(paramKey, e.target.value)
        else params.delete(paramKey)
        router.push(`?${params.toString()}`)
      }}
      className="w-full h-11 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Select exercise...</option>
      {names.map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  )
}
