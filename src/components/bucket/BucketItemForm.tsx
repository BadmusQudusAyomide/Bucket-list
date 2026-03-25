import { useState } from 'react'
import type { BucketFormValues } from '../../types/forms'
import type { BucketItem } from '../../types/firebase'

interface BucketItemFormProps {
  initialItem?: BucketItem | null
  loading?: boolean
  onSubmit: (values: BucketFormValues) => Promise<void>
  onCancel?: () => void
}

const emptyValues = { title: '', description: '' }

export const BucketItemForm = ({
  initialItem,
  loading = false,
  onSubmit,
  onCancel,
}: BucketItemFormProps) => {
  const [values, setValues] = useState<BucketFormValues>(() =>
    initialItem
      ? {
          title: initialItem.title,
          description: initialItem.description || '',
        }
      : emptyValues,
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(values)

    if (!initialItem) {
      setValues(emptyValues)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-5 p-5 sm:p-7 xl:sticky xl:top-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
            {initialItem ? 'Edit item' : 'New goal'}
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink-950 sm:text-3xl">
            {initialItem ? 'Refine the plan' : 'Add a bucket list item'}
          </h2>
        </div>
        {initialItem && onCancel ? (
          <button type="button" onClick={onCancel} className="action-chip">
            Cancel
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-semibold text-ink-900">
          Title
        </label>
        <input
          id="title"
          required
          value={values.title}
          className="field-input"
          placeholder="See the northern lights"
          onChange={(event) =>
            setValues((current) => ({ ...current, title: event.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-semibold text-ink-900">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          className="field-input resize-none"
          placeholder="Why it matters, target date, or anything collaborators should know..."
          onChange={(event) =>
            setValues((current) => ({ ...current, description: event.target.value }))
          }
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-sun-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-sun-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Saving...' : initialItem ? 'Save changes' : 'Add item'}
      </button>
    </form>
  )
}
