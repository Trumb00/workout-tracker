import { getTemplates } from '@/actions/templates'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { StartWorkoutButton } from './StartWorkoutButton'

interface LogPageProps {
  searchParams: Promise<{ templateId?: string; type?: string }>
}

export default async function LogPage({ searchParams }: LogPageProps) {
  const params = await searchParams
  const templates = await getTemplates()

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Start Workout" />

      {/* Blank start */}
      <div className="px-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Blank Workout</h2>
        <div className="grid grid-cols-3 gap-3">
          {(['gym', 'cardio', 'custom'] as const).map((type) => (
            <StartWorkoutButton
              key={type}
              type={type}
              name={type === 'gym' ? 'Gym Session' : type === 'cardio' ? 'Cardio Session' : 'Custom Session'}
            />
          ))}
        </div>
      </div>

      {/* From template */}
      {templates.length > 0 && (
        <div className="px-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">From Template</h2>
          <div className="flex flex-col gap-2">
            {templates.map((t) => (
              <StartWorkoutButton
                key={t.id}
                type={t.type}
                name={t.name}
                templateId={t.id}
                itemCount={t.template_items.length}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
