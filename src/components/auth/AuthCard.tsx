import { Chrome, Eye, EyeOff, LogIn } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import type { AuthFormValues } from '../../types/forms'
import { StatusMessage } from '../ui/StatusMessage'

export const AuthCard = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [values, setValues] = useState<AuthFormValues>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup, loginWithGoogle, authLoading } = useAuth()

  const destination = useMemo(
    () => (location.state as { from?: string } | null)?.from || '/dashboard',
    [location.state],
  )

  const submitLabel = mode === 'login' ? 'Enter BucketLife' : 'Create account'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      if (mode === 'login') {
        await login(values.email, values.password)
      } else {
        await signup(values.email, values.password)
      }

      navigate(destination, { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Authentication failed.')
    }
  }

  const handleGoogleAuth = async () => {
    setError(null)

    try {
      await loginWithGoogle()
      navigate(destination, { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Google sign-in failed.')
    }
  }

  return (
    <div className="glass-panel grid overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden min-h-[520px] overflow-hidden bg-ink-950 px-10 py-12 text-sand-50 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,184,76,0.28),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(149,213,178,0.24),_transparent_28%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.24em] uppercase text-sand-100/80">
              Collaborative bucket lists
            </span>
            <h1 className="max-w-lg font-display text-5xl leading-[1.02]">
              Turn someday goals into shared, visible progress.
            </h1>
            <p className="max-w-md text-base leading-7 text-sand-100/78">
              Track life milestones, invite collaborators, and keep your progress
              visible as goals move from idea to reality.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              'Private by default with Firebase rules',
              'Admin visibility for support and oversight',
              'Installable PWA with cached sessions',
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/8 p-4 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-8 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-md space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
              {mode === 'login' ? 'Welcome back' : 'Create your workspace'}
            </p>
            <h2 className="font-display text-4xl text-ink-950">
              {mode === 'login' ? 'Sign in to continue' : 'Start your bucket journey'}
            </h2>
            <p className="text-sm leading-6 text-ink-800/70">
              Use Google or email and password. Sessions stay persisted between visits.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-ink-900/10 bg-sand-100/70 p-1">
            {(['login', 'signup'] as const).map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setMode(entry)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  entry === mode
                    ? 'bg-white text-ink-950 shadow-sm'
                    : 'text-ink-800/65 hover:text-ink-950'
                }`}
              >
                {entry === 'login' ? 'Login' : 'Signup'}
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={() => void handleGoogleAuth()}
              disabled={authLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-ink-900/10 bg-white px-5 py-3.5 text-sm font-semibold text-ink-950 transition duration-200 hover:-translate-y-0.5 hover:border-ink-900/20 hover:bg-sand-50 disabled:cursor-not-allowed disabled:opacity-65"
            >
              <Chrome className="h-4 w-4" />
              {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-ink-900/10" />
              <span className="text-xs font-semibold tracking-[0.22em] text-ink-800/50 uppercase">
                or use email
              </span>
              <div className="h-px flex-1 bg-ink-900/10" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink-900" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="field-input"
                placeholder="you@example.com"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink-900" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  minLength={6}
                  required
                  className="field-input pr-12"
                  placeholder="Minimum 6 characters"
                  value={values.password}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, password: event.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-3 inline-flex items-center text-ink-800/65 transition hover:text-ink-950"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <StatusMessage
                title="Authentication issue"
                description={error}
                tone="error"
              />
            ) : null}

            <button
              type="submit"
              disabled={authLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-950 px-5 py-3.5 text-sm font-semibold text-sand-50 transition duration-200 hover:-translate-y-0.5 hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-65"
            >
              <LogIn className="h-4 w-4" />
              {authLoading ? 'Processing...' : submitLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
