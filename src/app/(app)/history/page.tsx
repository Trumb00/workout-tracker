import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/PageHeader'
import { SessionCard } from '@/components/history/SessionCard'
import { FilterBar } from '@/components/history/FilterBar'
import { Suspense } from 'react'
import type { WorkoutType } from '@/types/app'

interface HistoryPageProps {
  searchParams: Promise<{ type?: string }>
}

async function SessionList({ type }: { type?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('workout_sessions')
    .select('*')
    .not('ended_at', 'is', null)
    .order('started_at', { ascending: false })
    .limit(50)

  if (type && type !== 'all') {
    query = query.eq('type', type as WorkoutType)
  }

  const { data: sessions } = await query

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-5xl mb-4">📅</div>
        <h2 className="text-lg font-semibold text-slate-300 mb-2">No sessions yet</h2>
        <p className="text-slate-500 text-sm">
          {type && type !== 'all' ? `No ${type} sessions recorded.` : 'Start your first workout to see it here.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} />
      ))}
    </div>
  )
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams
  return (
    <div className="flex flex-col gap-2">
      <PageHeader title="History" />
      <FilterBar />
      <Suspense fallback={<div className="text-center py-8 text-slate-500">Loading...</div>}>
        <SessionList type={params.type} />
      </Suspense>
    </div>
  )
}
