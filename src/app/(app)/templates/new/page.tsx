import { TemplateForm } from '@/components/templates/TemplateForm'
import { PageHeader } from '@/components/layout/PageHeader'

export default function NewTemplatePage() {
  return (
    <div>
      <PageHeader title="New Template" back="/templates" />
      <TemplateForm />
    </div>
  )
}
