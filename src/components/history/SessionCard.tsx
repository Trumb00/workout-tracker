import type { WorkoutSession } from '@/types/app'
import { Badge } from '@/components/ui/Badge'
import { formatDate, sessionDuration } from '@/lib/utils/formatters'
import Link from 'next/link'

interface SessionCardProps {
  session: WorkoutSession
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Link
      href={`/history/${session.id}`}
      className="flex items-center gap-3 bg-slate-900 rounded-2xl p-4 hover:bg-slate-800 transition-colors"
    >
      <div className="flex flex-col items-center justify-center w-12 flex-none">
        <span className="text-xs text-slate-500 uppercase tracking-wide">
          {new Date(session.started_at).toLocaleDateString('en', { month: 'short' })}
        </span>
        <span className="text-2xl font-bold text-slate-100 leading-none">
          {new Date(session.started_at).getDate()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-100 truncate">{session.name}</div>
        <div className="text-xs text-slate-500 mt-0.5">
          {sessionDuration(session.started_at, session.ended_at)}
        </div>
      </div>
      <Badge type={session.type} />
    </Link>
  )
}
