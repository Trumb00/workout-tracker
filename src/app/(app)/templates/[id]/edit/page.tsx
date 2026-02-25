import { getTemplate } from '@/actions/templates'
import { TemplateForm } from '@/components/templates/TemplateForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { notFound } from 'next/navigation'

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let template
  try {
    template = await getTemplate(id)
  } catch {
    notFound()
  }

  return (
    <div>
      <PageHeader title="Edit Template" back="/templates" />
      <TemplateForm existing={template} />
    </div>
  )
}
