import type { UserProfile } from '../../types/firebase'

interface AdminUserListProps {
  users: UserProfile[]
  selectedUserId?: string
  onSelect: (user: UserProfile) => void
}

export const AdminUserList = ({
  users,
  selectedUserId,
  onSelect,
}: AdminUserListProps) => (
  <div className="glass-panel p-5">
    <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
      Users
    </p>
    <div className="mt-4 space-y-2">
      {users.map((user) => (
        <button
          key={user.uid}
          type="button"
          onClick={() => onSelect(user)}
          className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
            user.uid === selectedUserId
              ? 'border-ink-950 bg-ink-950 text-sand-50'
              : 'border-ink-900/10 bg-white/80 text-ink-900 hover:border-ink-900/20'
          }`}
        >
          <p className="font-semibold">{user.email}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-70">{user.role}</p>
        </button>
      ))}
    </div>
  </div>
)
