import type { TemplateWithItems } from '@/types/app'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface TemplateCardProps {
  template: TemplateWithItems
  showActions?: boolean
}

export function TemplateCard({ template, showActions = true }: TemplateCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate">{template.name}</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {template.template_items.length} exercise{template.template_items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Badge type={template.type} />
      </div>
      {template.template_items.length > 0 && (
        <ul className="text-sm text-slate-400 space-y-1">
          {template.template_items.slice(0, 4).map((item) => (
            <li key={item.id} className="truncate">{item.exercise_name}</li>
          ))}
          {template.template_items.length > 4 && (
            <li className="text-slate-600">+{template.template_items.length - 4} more</li>
          )}
        </ul>
      )}
      {showActions && (
        <div className="flex gap-2 pt-1">
          <Link
            href={`/log?templateId=${template.id}`}
            className="flex-1 h-10 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Start Workout
          </Link>
          <Link
            href={`/templates/${template.id}/edit`}
            className="h-10 px-4 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
          >
            Edit
          </Link>
        </div>
      )}
    </div>
  )
}
