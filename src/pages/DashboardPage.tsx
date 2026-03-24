import { BucketListSection } from '../components/bucket/BucketListSection'
import { useAuth } from '../context/useAuth'

export const DashboardPage = () => {
  const { user, userProfile } = useAuth()

  if (!user || !userProfile) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6 sm:p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
          Personal dashboard
        </p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl text-ink-950 sm:text-5xl">
              Build a list worth remembering.
            </h1>
            <p className="mt-3 text-base leading-7 text-ink-800/76">
              Track your next life milestones, share specific goals with collaborators, and
              mark progress as you complete each experience.
            </p>
          </div>
          <div className="rounded-[28px] border border-ink-900/10 bg-sand-50/80 px-5 py-4 text-sm text-ink-800">
            Signed in as <span className="font-semibold text-ink-950">{userProfile.email}</span>
          </div>
        </div>
      </div>

      <BucketListSection currentUid={user.uid} />
    </section>
  )
}
