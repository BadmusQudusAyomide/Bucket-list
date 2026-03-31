import { CheckCircle2, Pencil, Tag, Trash2, Undo2 } from 'lucide-react'
import { formatDate } from '../../utils/date'
import type { BucketItem } from '../../types/firebase'

interface CompactBucketItemCardProps {
  item: BucketItem
  canEdit: boolean
  actionLoading?: boolean
  onEdit: (item: BucketItem) => void
  onDelete: (item: BucketItem) => Promise<void>
  onToggleComplete: (item: BucketItem) => void
}

export const CompactBucketItemCard = ({
  item,
  canEdit,
  actionLoading = false,
  onEdit,
  onDelete,
  onToggleComplete,
}: CompactBucketItemCardProps) => {
  return (
    <article className="glass-panel overflow-hidden p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                item.completed ? 'bg-mint-300/25 text-mint-500' : 'bg-sun-400/18 text-sun-500'
              }`}
            >
              {item.completed ? 'Completed' : 'In progress'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-ink-800">
              <Tag className="h-3.5 w-3.5" />
              {item.category}
            </span>
          </div>

          <h3 className="font-display text-2xl text-ink-950 sm:text-2xl">{item.title}</h3>

          {item.description ? (
            <p className="max-h-10 overflow-hidden text-sm leading-6 text-ink-800/75">{item.description}</p>
          ) : (
            <p className="max-h-10 overflow-hidden text-sm leading-6 text-ink-800/50">
              No description yet.
            </p>
          )}
        </div>

        {canEdit ? (
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => onEdit(item)} className="action-chip justify-center">
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => void onDelete(item)}
              disabled={actionLoading}
              className="action-chip justify-center text-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        ) : null}

        {/* Completion control lives at the bottom for a “quick check” UX. */}
        {canEdit ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-ink-800/65">Created {formatDate(item.createdAt)}</span>
            <button
              type="button"
              onClick={() => onToggleComplete(item)}
              className="action-chip justify-center"
            >
              {item.completed ? <Undo2 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {item.completed ? 'Reopen' : 'Complete'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-ink-800/65">Created {formatDate(item.createdAt)}</span>
          </div>
        )}
      </div>
    </article>
  )
}

