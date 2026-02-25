import React from 'react'
import type { WorkoutType } from '@/types/app'

const typeColors: Record<WorkoutType | string, string> = {
  gym: 'bg-blue-900 text-blue-300',
  cardio: 'bg-emerald-900 text-emerald-300',
  custom: 'bg-violet-900 text-violet-300',
}

interface BadgeProps {
  type: WorkoutType | string
  className?: string
}

export function Badge({ type, className = '' }: BadgeProps) {
  const color = typeColors[type] ?? 'bg-slate-700 text-slate-300'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${color} ${className}`}>
      {type}
    </span>
  )
}
