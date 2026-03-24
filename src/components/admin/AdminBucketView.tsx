import { formatDate } from '../../utils/date'
import { StatusMessage } from '../ui/StatusMessage'
import type { BucketItem, UserProfile } from '../../types/firebase'

interface AdminBucketViewProps {
  user: UserProfile | null
  items: BucketItem[]
  loading: boolean
}

export const AdminBucketView = ({ user, items, loading }: AdminBucketViewProps) => {
  if (!user) {
    return (
      <StatusMessage
        title="No user selected"
        description="Choose a user from the left to inspect their bucket list in read-only mode."
      />
    )
  }

  if (loading) {
    return (
      <div className="glass-panel p-8 text-center text-sm text-ink-800/70">
        Loading {user.email}&apos;s bucket list...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <StatusMessage
        title="Empty bucket list"
        description={`${user.email} has not added any bucket list items yet.`}
      />
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="glass-panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-ink-800/55 uppercase">
                {item.completed ? 'Completed' : 'Open'}
              </p>
              <h3 className="mt-2 font-display text-3xl text-ink-950">{item.title}</h3>
            </div>
            <p className="text-sm text-ink-800/70">Created {formatDate(item.createdAt)}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-800/78">
            {item.description || 'No description provided.'}
          </p>
        </article>
      ))}
    </div>
  )
}
