import { BucketListSection } from '../components/bucket/BucketListSection'
import { useAuth } from '../context/useAuth'

export const DashboardPage = () => {
  const { user, userProfile } = useAuth()

  if (!user || !userProfile) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel overflow-hidden p-5 sm:p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
          Personal dashboard
        </p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl text-ink-950 sm:text-5xl">
              Build a list worth remembering.
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink-800/76 sm:text-base sm:leading-7">
              Track your next life milestones, share specific goals with collaborators, and
              mark progress as you complete each experience.
            </p>
          </div>
          <div className="rounded-[24px] border border-ink-900/10 bg-sand-50/80 px-4 py-3 text-sm text-ink-800 sm:rounded-[28px] sm:px-5 sm:py-4">
            Signed in as <span className="font-semibold text-ink-950">{userProfile.email}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/60 bg-white/65 px-4 py-4">
            <p className="text-xs font-semibold tracking-[0.22em] text-ink-800/55 uppercase">
              Focus
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-800/78">
              Add the next experience you want to chase, not your whole life at once.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/60 bg-white/65 px-4 py-4">
            <p className="text-xs font-semibold tracking-[0.22em] text-ink-800/55 uppercase">
              Momentum
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-800/78">
              Mark goals complete as soon as they happen so your list feels alive.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/60 bg-white/65 px-4 py-4">
            <p className="text-xs font-semibold tracking-[0.22em] text-ink-800/55 uppercase">
              Shared plans
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-800/78">
              Invite collaborators for travel, learning, or family milestones.
            </p>
          </div>
        </div>
      </div>

      <BucketListSection currentUid={user.uid} />
    </section>
  )
}
