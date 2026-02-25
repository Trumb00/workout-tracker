import { getTemplates } from '@/actions/templates'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { PageHeader } from '@/components/layout/PageHeader'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function TemplatesPage() {
  const templates = await getTemplates()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Templates"
        action={
          <Link href="/templates/new">
            <Button size="sm">+ New</Button>
          </Link>
        }
      />

      {templates.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-slate-300 mb-2">No templates yet</h2>
          <p className="text-slate-500 text-sm mb-6">Create a template to quickly start your regular workouts.</p>
          <Link href="/templates/new">
            <Button size="lg">Create First Template</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}
    </div>
  )
}
