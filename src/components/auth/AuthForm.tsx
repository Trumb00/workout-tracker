'use client'

import { useState, useTransition } from 'react'
import { signIn, signUp } from '@/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = mode === 'login'
        ? await signIn(formData)
        : await signUp(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === 'signup' && (
        <Input
          label="Name"
          id="displayName"
          name="displayName"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          required
        />
      )}
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        required
        minLength={6}
      />
      {error && (
        <p className="text-sm text-red-400 bg-red-950 border border-red-900 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" loading={isPending} className="w-full mt-2">
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </Button>
      <p className="text-center text-sm text-slate-400">
        {mode === 'login' ? (
          <>Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign up</Link>
          </>
        ) : (
          <>Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
          </>
        )}
      </p>
    </form>
  )
}
