import { AuthForm } from '@/components/auth/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💪</div>
          <h1 className="text-2xl font-bold text-slate-100">Workout Tracker</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  )
}
