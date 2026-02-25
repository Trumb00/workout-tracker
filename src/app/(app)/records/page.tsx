import { getPersonalRecords } from '@/actions/records'
import { PageHeader } from '@/components/layout/PageHeader'
import { formatDate } from '@/lib/utils/formatters'
import { formatPace } from '@/lib/utils/pace'
import Link from 'next/link'

export default async function RecordsPage() {
  const records = await getPersonalRecords()

  const gymRecords = records.filter((r) => r.type === 'gym')
  const cardioRecords = records.filter((r) => r.type === 'cardio')

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Personal Records" />

      {records.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-lg font-semibold text-slate-300 mb-2">No records yet</h2>
          <p className="text-slate-500 text-sm">
            Complete workouts and your personal records will show up here.
          </p>
        </div>
      )}

      {gymRecords.length > 0 && (
        <div className="px-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="text-base">🏋️</span> Strength
          </h2>
          <div className="bg-slate-900 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="text-left p-3 font-medium">Exercise</th>
                    <th className="text-right p-3 font-medium">Best</th>
                    <th className="text-right p-3 font-medium">Est. 1RM</th>
                    <th className="text-right p-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {gymRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-medium text-slate-100 max-w-[120px] truncate">{r.exercise_name}</td>
                      <td className="p-3 text-right text-slate-300 whitespace-nowrap">
                        {r.best_weight_kg != null && r.best_reps != null
                          ? `${r.best_weight_kg}kg × ${r.best_reps}`
                          : '—'}
                      </td>
                      <td className="p-3 text-right text-indigo-400 font-semibold">
                        {r.best_1rm_kg != null ? `${r.best_1rm_kg}kg` : '—'}
                      </td>
                      <td className="p-3 text-right text-slate-500 text-xs">
                        {r.achieved_at ? formatDate(r.achieved_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {cardioRecords.length > 0 && (
        <div className="px-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="text-base">🏃</span> Cardio
          </h2>
          <div className="bg-slate-900 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="text-left p-3 font-medium">Activity</th>
                    <th className="text-right p-3 font-medium">Best Distance</th>
                    <th className="text-right p-3 font-medium">Best Pace</th>
                    <th className="text-right p-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {cardioRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-medium text-slate-100 max-w-[120px] truncate">{r.exercise_name}</td>
                      <td className="p-3 text-right text-emerald-400 font-semibold">
                        {r.best_distance_km != null ? `${r.best_distance_km} km` : '—'}
                      </td>
                      <td className="p-3 text-right text-slate-300">
                        {r.best_pace_sec_per_km != null ? formatPace(r.best_pace_sec_per_km) : '—'}
                      </td>
                      <td className="p-3 text-right text-slate-500 text-xs">
                        {r.achieved_at ? formatDate(r.achieved_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
