import { useState } from 'react'
import {
  createBucketItem,
  deleteBucketItem,
  setBucketItemCompleted,
  updateBucketItem,
} from '../../services/bucketService'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { useBucketItems } from '../../hooks/useBucketItems'
import {
  groupBucketItemsByCategory,
  goalBucketSuggestions,
  normalizeBucketCategory,
} from '../../utils/categories'
import { StatusMessage } from '../ui/StatusMessage'
import { BucketItemForm } from './BucketItemForm'
import { CompactBucketItemCard } from './CompactBucketItemCard'
import type { BucketItem } from '../../types/firebase'

interface BucketListSectionProps {
  currentUid: string
}

export const BucketListSection = ({ currentUid }: BucketListSectionProps) => {
  const { items, loading, error } = useBucketItems(currentUid)
  const { run, loading: actionLoading, error: actionError, setError } = useAsyncAction()
  const [editingItem, setEditingItem] = useState<BucketItem | null>(null)
  const goalBuckets = goalBucketSuggestions.map((bucket) => normalizeBucketCategory(bucket))
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleCreateOrUpdate = async (values: {
    title: string
    description: string
    category: string
  }) => {
    if (!selectedCategory) {
      return
    }

    await run(async () => {
      if (editingItem) {
        await updateBucketItem(editingItem.id, {
          ...values,
          category: selectedCategory,
        })
        setEditingItem(null)
        return
      }

      await createBucketItem(currentUid, {
        ...values,
        category: selectedCategory,
      })
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

  const ownedItems = items.filter((item) => item.userId === currentUid)
  const completedCount = ownedItems.filter((item) => item.completed).length
  const openCount = ownedItems.length - completedCount
  const ownedByCategory = groupBucketItemsByCategory(ownedItems)

  const ownedByCategoryMap = new Map<string, BucketItem[]>(
    ownedByCategory.map(({ category, items: categoryItems }) => [category, categoryItems]),
  )
  const selectedItems = ownedByCategoryMap.get(selectedCategory) ?? []
  const selectedCompletedCount = selectedItems.filter((item) => item.completed).length
  const selectedOpenCount = selectedItems.length - selectedCompletedCount

  // State 1: dashboard shows ONLY the goal categories.
  if (!selectedCategory) {
    return (
      <section className="space-y-5">
        {actionError ? (
          <StatusMessage title="Action failed" description={actionError} tone="error" />
        ) : null}
        {error ? (
          <StatusMessage title="Unable to load items" description={error} tone="error" />
        ) : null}

        <div className="glass-panel p-5 sm:p-7">
          <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
            Goal chapters
          </p>
          <h2 className="mt-2 font-display text-3xl text-ink-950 sm:text-4xl">
            Choose where this wish belongs.
          </h2>
          <p className="mt-3 text-sm text-ink-800/76">
            Start with the chapter that feels most real right now – this year, this month, before 25,
            before 20, or just other human goals.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {goalBuckets.map((bucket) => {
              const bucketItems = ownedByCategoryMap.get(bucket) ?? []
              const bucketCompleted = bucketItems.filter((item) => item.completed).length

              return (
                <button
                  key={bucket}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(bucket)
                    setEditingItem(null)
                  }}
                  className="flex flex-col items-start gap-1 rounded-[24px] border border-ink-900/10 bg-white/70 px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-sun-500/40 hover:bg-white"
                >
                  <p className="text-xs font-semibold tracking-[0.22em] text-ink-800/55 uppercase">
                    Category
                  </p>
                  <h3 className="mt-1 font-display text-xl text-ink-950">{bucket}</h3>
                  <p className="mt-1 text-sm text-ink-800/72">
                    {bucketItems.length} wish{bucketItems.length === 1 ? '' : 'es'} · {bucketCompleted}{' '}
                    completed
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // State 2: inside a specific category – show form + compact wishes.
  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <BucketItemForm
        key={`${selectedCategory}-${editingItem?.id ?? 'new-item'}`}
        initialItem={editingItem}
        fixedCategory={selectedCategory}
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

        <button
          type="button"
          onClick={() => {
            setSelectedCategory(null)
            setEditingItem(null)
          }}
          className="action-chip"
        >
          Back to all goal categories
        </button>

        <div className="glass-panel p-4 sm:p-5">
          <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
            Goal bucket
          </p>
          <h2 className="mt-1 font-display text-2xl text-ink-950 sm:text-3xl">{selectedCategory}</h2>
          <p className="mt-2 text-sm text-ink-800/72">
            {selectedOpenCount} open · {selectedCompletedCount} completed
          </p>
        </div>

        {loading ? (
          <div className="glass-panel p-8 text-center text-sm text-ink-800/70">
            Loading your wishes...
          </div>
        ) : selectedItems.length === 0 ? (
          <StatusMessage
            title="No wishes in this bucket yet"
            description="Use the form on the left to add the first one for this chapter."
          />
        ) : (
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <CompactBucketItemCard
                key={item.id}
                item={item}
                canEdit
                actionLoading={actionLoading}
                onEdit={(nextItem) => {
                  setError(null)
                  setEditingItem(nextItem)
                }}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
