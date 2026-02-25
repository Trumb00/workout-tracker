import { getSession } from '@/actions/sessions'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDateTime, sessionDuration, formatWeight } from '@/lib/utils/formatters'
import { formatPace } from '@/lib/utils/pace'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let session
  try {
    session = await getSession(id)
  } catch {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <PageHeader title={session.name} back="/history" />

      {/* Meta */}
      <div className="px-4 flex flex-wrap gap-2 items-center">
        <Badge type={session.type} />
        <span className="text-sm text-slate-400">{formatDateTime(session.started_at)}</span>
        {session.ended_at && (
          <span className="text-sm text-slate-500">· {sessionDuration(session.started_at, session.ended_at)}</span>
        )}
      </div>

      {session.notes && (
        <div className="px-4">
          <p className="text-sm text-slate-400 bg-slate-900 rounded-xl p-3">{session.notes}</p>
        </div>
      )}

      {/* Exercises */}
      <div className="flex flex-col gap-3 px-4">
        {session.session_exercises.map((ex) => (
          <Card key={ex.id}>
            <h3 className="font-semibold text-slate-100 mb-3">{ex.exercise_name}</h3>

            {/* Gym: sets table */}
            {session.type === 'gym' && ex.sets && ex.sets.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-left">
                      <th className="pb-2 w-8">#</th>
                      <th className="pb-2">Weight</th>
                      <th className="pb-2">Reps</th>
                      <th className="pb-2">Done</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {ex.sets.map((s) => (
                      <tr key={s.id} className={s.completed ? '' : 'opacity-50'}>
                        <td className="py-1.5 text-slate-500">{s.set_number}</td>
                        <td className="py-1.5 text-slate-300">{s.weight_kg != null ? `${s.weight_kg} kg` : '—'}</td>
                        <td className="py-1.5 text-slate-300">{s.reps ?? '—'}</td>
                        <td className="py-1.5">{s.completed ? <span className="text-emerald-400">✓</span> : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cardio */}
            {session.type === 'cardio' && ex.cardio_logs && ex.cardio_logs.map((log) => (
              <div key={log.id} className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-emerald-400">{log.distance_km ?? '—'}</div>
                  <div className="text-xs text-slate-500">km</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">
                    {log.duration_sec != null ? `${Math.floor(log.duration_sec / 60)}:${(log.duration_sec % 60).toString().padStart(2, '0')}` : '—'}
                  </div>
                  <div className="text-xs text-slate-500">time</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-violet-400">
                    {log.pace_sec_per_km != null ? formatPace(log.pace_sec_per_km) : '—'}
                  </div>
                  <div className="text-xs text-slate-500">pace</div>
                </div>
              </div>
            ))}

            {/* Custom */}
            {session.type === 'custom' && ex.custom_metric_logs && ex.custom_metric_logs.length > 0 && (
              <div className="flex flex-col gap-1">
                {ex.custom_metric_logs.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{m.metric_name}</span>
                    <span className="text-slate-200 font-medium">
                      {m.metric_value ?? '—'} {m.metric_unit ?? ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}

        {session.session_exercises.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-8">No exercises recorded.</p>
        )}
      </div>
    </div>
  )
}
