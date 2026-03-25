import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { LoadingScreen } from '../ui/LoadingScreen'

export const AppShell = ({ children }: { children: ReactNode }) => {
  const location = useLocation()
  const { userProfile, logoutUser, authLoading, initializing } = useAuth()

  if (initializing) {
    return <LoadingScreen label="Warming up your BucketLife workspace..." />
  }

  const signedIn = Boolean(userProfile)
  const onAuthPage = location.pathname === '/auth'

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(236,159,5,0.14),_transparent_54%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col">
        <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/50 bg-white/55 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-[32px] sm:px-6 sm:py-5">
          <div>
            <Link to={signedIn ? '/' : '/auth'} className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 text-sand-50 shadow-lg shadow-ink-950/20">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-2xl text-ink-950">BucketLife</p>
                <p className="text-sm text-ink-800/70">
                  Shared goals and gentle momentum.
                </p>
              </div>
            </Link>
          </div>

          {signedIn && !onAuthPage ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="rounded-full border border-ink-900/10 bg-white/85 px-4 py-2 text-center text-sm text-ink-800 sm:text-left">
                <span className="font-semibold text-ink-950">{userProfile?.email}</span>
              </div>
              {userProfile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="action-chip justify-center border-mint-500/30 bg-mint-300/25 text-mint-500"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin view
                </Link>
              )}
              <button
                type="button"
                onClick={() => void logoutUser()}
                disabled={authLoading}
                className="action-chip justify-center"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : null}
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
