import { getDashboardStats, getSessions } from '@/actions/sessions'
import { getTemplates } from '@/actions/templates'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDate, sessionDuration } from '@/lib/utils/formatters'
import Link from 'next/link'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/Button'

export default async function DashboardPage() {
  const [stats, recentSessions, templates] = await Promise.all([
    getDashboardStats(),
    getSessions(3),
    getTemplates(),
  ])

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <form action={signOut}>
          <button type="submit" className="text-sm text-slate-400 hover:text-slate-300">
            Sign out
          </button>
        </form>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <div className="text-2xl font-bold text-indigo-400">{stats.sessionsThisWeek}</div>
            <div className="text-xs text-slate-500 mt-1">This week</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {stats.weeklyVolume > 0 ? `${(stats.weeklyVolume / 1000).toFixed(1)}t` : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-1">Volume 7d</div>
          </Card>
          <Card className="text-center">
            <div className="text-lg font-bold text-slate-300">
              {stats.lastWorkout ? formatDate(stats.lastWorkout.started_at).replace(/\d{4}$/, '').trim() : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-1">Last session</div>
          </Card>
        </div>
      )}

      {/* Quick start */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Start</h2>
        <div className="grid grid-cols-3 gap-3">
          {(['gym', 'cardio', 'custom'] as const).map((type) => (
            <Link
              key={type}
              href={`/log?type=${type}`}
              className={`flex flex-col items-center justify-center h-20 rounded-2xl gap-2 font-medium text-sm transition-colors ${
                type === 'gym' ? 'bg-blue-900 hover:bg-blue-800 text-blue-300' :
                type === 'cardio' ? 'bg-emerald-900 hover:bg-emerald-800 text-emerald-300' :
                'bg-violet-900 hover:bg-violet-800 text-violet-300'
              }`}
            >
              <span className="text-2xl">
                {type === 'gym' ? '🏋️' : type === 'cardio' ? '🏃' : '✏️'}
              </span>
              <span className="capitalize">{type}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Templates */}
      {templates.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Templates</h2>
            <Link href="/templates" className="text-sm text-indigo-400">See all</Link>
          </div>
          <div className="flex flex-col gap-2">
            {templates.slice(0, 3).map((t) => (
              <Link
                key={t.id}
                href={`/log?templateId=${t.id}`}
                className="flex items-center gap-3 bg-slate-900 rounded-2xl p-3 hover:bg-slate-800 transition-colors"
              >
                <span className="text-2xl">
                  {t.type === 'gym' ? '🏋️' : t.type === 'cardio' ? '🏃' : '✏️'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-100 truncate">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.template_items.length} exercises</div>
                </div>
                <Badge type={t.type} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Recent</h2>
            <Link href="/history" className="text-sm text-indigo-400">See all</Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentSessions.map((s) => (
              <Link
                key={s.id}
                href={`/history/${s.id}`}
                className="flex items-center gap-3 bg-slate-900 rounded-2xl p-3 hover:bg-slate-800 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-100 truncate">{s.name}</div>
                  <div className="text-xs text-slate-500">{formatDate(s.started_at)} · {sessionDuration(s.started_at, s.ended_at)}</div>
                </div>
                <Badge type={s.type} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {templates.length === 0 && recentSessions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">💪</div>
          <h2 className="text-lg font-semibold text-slate-300 mb-2">Ready to train?</h2>
          <p className="text-slate-500 text-sm mb-6">Start a blank workout or create a template first.</p>
          <Link href="/log">
            <Button size="lg">Start First Workout</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
