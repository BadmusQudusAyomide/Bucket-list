import { AdminBucketView } from '../components/admin/AdminBucketView'
import { AdminUserList } from '../components/admin/AdminUserList'
import { StatusMessage } from '../components/ui/StatusMessage'
import { useAdminData } from '../hooks/useAdminData'

export const AdminDashboardPage = () => {
  const {
    users,
    selectedUser,
    items,
    loadingUsers,
    loadingItems,
    error,
    setSelectedUser,
  } = useAdminData()

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6 sm:p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
          Admin dashboard
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink-950 sm:text-5xl">
          Read-only visibility across every BucketLife user.
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-ink-800/76">
          Inspect registered users and the lists they own without changing their data.
        </p>
      </div>

      {error ? <StatusMessage title="Admin data issue" description={error} tone="error" /> : null}

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        {loadingUsers ? (
          <div className="glass-panel p-8 text-center text-sm text-ink-800/70">
            Loading users...
          </div>
        ) : (
          <AdminUserList
            users={users}
            selectedUserId={selectedUser?.uid}
            onSelect={setSelectedUser}
          />
        )}

        <AdminBucketView user={selectedUser} items={items} loading={loadingItems} />
      </div>
    </section>
  )
}
