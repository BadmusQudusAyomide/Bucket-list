import { useState } from 'react'
import {
  createBucketItem,
  deleteBucketItem,
  removeCollaborator,
  setBucketItemCompleted,
  shareBucketItemWithEmail,
  updateBucketItem,
} from '../../services/bucketService'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { useBucketItems } from '../../hooks/useBucketItems'
import { StatusMessage } from '../ui/StatusMessage'
import { BucketItemForm } from './BucketItemForm'
import { BucketItemCard } from './BucketItemCard'
import type { BucketItem } from '../../types/firebase'

interface BucketListSectionProps {
  currentUid: string
}

export const BucketListSection = ({ currentUid }: BucketListSectionProps) => {
  const { items, loading, error } = useBucketItems(currentUid)
  const { run, loading: actionLoading, error: actionError, setError } = useAsyncAction()
  const [editingItem, setEditingItem] = useState<BucketItem | null>(null)

  const handleCreateOrUpdate = async (values: { title: string; description: string }) => {
    await run(async () => {
      if (editingItem) {
        await updateBucketItem(editingItem.id, values)
        setEditingItem(null)
        return
      }

      await createBucketItem(currentUid, values)
    })
  }

  const handleDelete = async (item: BucketItem) => {
    await run(async () => {
      await deleteBucketItem(item)
    })
  }

  const handleToggleComplete = (item: BucketItem) => {
    void run(() => setBucketItemCompleted(item, !item.completed))
  }

  const handleShare = async (item: BucketItem, email: string) => {
    await run(async () => {
      await shareBucketItemWithEmail(item, email)
    })
  }

  const handleRemoveCollaborator = async (item: BucketItem, collaboratorUid: string) => {
    await run(async () => {
      await removeCollaborator(item, collaboratorUid)
    })
  }

  const ownedItems = items.filter((item) => item.userId === currentUid)
  const sharedItems = items.filter((item) => item.userId !== currentUid)

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <BucketItemForm
        key={editingItem?.id ?? 'new-item'}
        initialItem={editingItem}
        loading={actionLoading}
        onCancel={() => setEditingItem(null)}
        onSubmit={handleCreateOrUpdate}
      />

      <section className="space-y-5">
        {actionError ? (
          <StatusMessage title="Action failed" description={actionError} tone="error" />
        ) : null}
        {error ? (
          <StatusMessage title="Unable to load items" description={error} tone="error" />
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="glass-panel p-5">
            <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
              Your goals
            </p>
            <p className="mt-2 font-display text-4xl text-ink-950">{ownedItems.length}</p>
            <p className="mt-2 text-sm text-ink-800/72">
              Items you own and can share with collaborators.
            </p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
              Shared with you
            </p>
            <p className="mt-2 font-display text-4xl text-ink-950">{sharedItems.length}</p>
            <p className="mt-2 text-sm text-ink-800/72">
              Goals where you've been invited to collaborate.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
                Owned items
              </p>
              <h2 className="mt-1 font-display text-3xl text-ink-950">
                Build the list you want to live
              </h2>
            </div>

            {loading ? (
              <div className="glass-panel p-8 text-center text-sm text-ink-800/70">
                Loading your bucket list...
              </div>
            ) : ownedItems.length === 0 ? (
              <StatusMessage
                title="No bucket items yet"
                description="Create your first milestone on the left. It will appear here instantly."
              />
            ) : (
              <div className="space-y-4">
                {ownedItems.map((item) => (
                  <BucketItemCard
                    key={item.id}
                    item={item}
                    canEdit
                    isOwner
                    actionLoading={actionLoading}
                    onEdit={(nextItem) => {
                      setError(null)
                      setEditingItem(nextItem)
                    }}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                    onShare={handleShare}
                    onRemoveCollaborator={handleRemoveCollaborator}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
                Shared items
              </p>
              <h2 className="mt-1 font-display text-3xl text-ink-950">Collaborate with others</h2>
            </div>

            {sharedItems.length === 0 ? (
              <StatusMessage
                title="Nothing shared yet"
                description="When someone adds you as a collaborator, those items will show up here."
              />
            ) : (
              <div className="space-y-4">
                {sharedItems.map((item) => (
                  <BucketItemCard
                    key={item.id}
                    item={item}
                    canEdit
                    isOwner={false}
                    actionLoading={actionLoading}
                    onEdit={setEditingItem}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                    onShare={handleShare}
                    onRemoveCollaborator={handleRemoveCollaborator}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
