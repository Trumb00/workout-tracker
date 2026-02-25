'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { WorkoutType } from '@/types/app'

const types: Array<{ value: WorkoutType | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'gym', label: 'Gym' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'custom', label: 'Custom' },
]

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeType = searchParams.get('type') ?? 'all'

  const setType = useCallback((type: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (type === 'all') params.delete('type')
    else params.set('type', type)
    router.push(`/history?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-1 scrollbar-hide">
      {types.map((t) => (
        <button
          key={t.value}
          onClick={() => setType(t.value)}
          className={`flex-none h-9 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeType === t.value
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
