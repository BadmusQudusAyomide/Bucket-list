import {
  CheckCircle2,
  Pencil,
  Trash2,
  Undo2,
  UserRoundPlus,
  Users,
} from 'lucide-react'
import { formatDate } from '../../utils/date'
import { ShareItemForm } from './ShareItemForm'
import type { BucketItem } from '../../types/firebase'

interface BucketItemCardProps {
  item: BucketItem
  canEdit: boolean
  isOwner: boolean
  actionLoading?: boolean
  onEdit: (item: BucketItem) => void
  onDelete: (item: BucketItem) => Promise<void>
  onToggleComplete: (item: BucketItem) => void
  onShare: (item: BucketItem, email: string) => Promise<void>
  onRemoveCollaborator: (item: BucketItem, collaboratorUid: string) => Promise<void>
}

export const BucketItemCard = ({
  item,
  canEdit,
  isOwner,
  actionLoading = false,
  onEdit,
  onDelete,
  onToggleComplete,
  onShare,
  onRemoveCollaborator,
}: BucketItemCardProps) => {
  const collaboratorLabel =
    item.collaboratorIds.length === 1 ? '1 collaborator' : `${item.collaboratorIds.length} collaborators`

  return (
    <article className="glass-panel group overflow-hidden p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(20,33,61,0.14)] sm:p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                  item.completed
                    ? 'bg-mint-300/25 text-mint-500'
                    : 'bg-sun-400/18 text-sun-500'
                }`}
              >
                {item.completed ? 'Completed' : 'In progress'}
              </span>
              {item.collaboratorIds.length > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-cloud-100 px-3 py-1 text-xs font-semibold text-ink-800">
                  <Users className="h-3.5 w-3.5" />
                  {collaboratorLabel}
                </span>
              ) : null}
            </div>
            <h3 className="font-display text-2xl text-ink-950 sm:text-3xl">{item.title}</h3>
            <p className="max-w-2xl text-sm leading-6 text-ink-800/75">
              {item.description || 'No description yet. Add more context when you refine this goal.'}
            </p>
          </div>

          {canEdit ? (
            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end">
              <button type="button" onClick={() => onEdit(item)} className="action-chip justify-center">
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onToggleComplete(item)}
                className="action-chip justify-center"
              >
                {item.completed ? <Undo2 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {item.completed ? 'Reopen' : 'Complete'}
              </button>
              <button
                type="button"
                onClick={() => void onDelete(item)}
                disabled={actionLoading}
                className="action-chip justify-center text-rose-400"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 text-sm text-ink-800/72 sm:flex-row sm:flex-wrap sm:gap-4">
          <span>Created {formatDate(item.createdAt)}</span>
          <span>{isOwner ? 'Owned by you' : 'Shared with you as an editor'}</span>
          {item.collaboratorIds.length > 0 ? <span>{collaboratorLabel}</span> : null}
        </div>

        {isOwner ? (
          <div className="rounded-[24px] border border-ink-900/10 bg-sand-50/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-950">
              <UserRoundPlus className="h-4 w-4" />
              Share with collaborator
            </div>
            <ShareItemForm onShare={(email) => onShare(item, email)} loading={actionLoading} />

            {item.collaborators.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.collaborators.map((collaborator) => (
                  <button
                    key={collaborator.userId}
                    type="button"
                    onClick={() => void onRemoveCollaborator(item, collaborator.userId)}
                    className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-800 transition hover:border-rose-400/30 hover:text-rose-400"
                  >
                    {collaborator.userId} · remove
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
