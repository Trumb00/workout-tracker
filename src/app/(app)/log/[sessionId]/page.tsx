import { getSession } from '@/actions/sessions'
import { WorkoutLogger } from '@/components/logging/WorkoutLogger'
import { notFound } from 'next/navigation'

export default async function ActiveSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params
  let session
  try {
    session = await getSession(sessionId)
  } catch {
    notFound()
  }

  // If session is already completed, redirect to history
  if (session.ended_at) {
    const { redirect } = await import('next/navigation')
    redirect(`/history/${sessionId}`)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <WorkoutLogger session={session as any} />
    </div>
  )
}
