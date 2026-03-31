import { useState } from 'react'
import type { BucketFormValues } from '../../types/forms'
import type { BucketItem } from '../../types/firebase'
import {
  bucketCategorySuggestions,
  normalizeBucketCategory,
} from '../../utils/categories'

interface BucketItemFormProps {
  initialItem?: BucketItem | null
  fixedCategory?: string
  loading?: boolean
  onSubmit: (values: BucketFormValues) => Promise<void>
  onCancel?: () => void
}

export const BucketItemForm = ({
  initialItem,
  fixedCategory,
  loading = false,
  onSubmit,
  onCancel,
}: BucketItemFormProps) => {
  const effectiveCategory = fixedCategory
    ? normalizeBucketCategory(fixedCategory)
    : bucketCategorySuggestions[0]

  const [values, setValues] = useState<BucketFormValues>(() =>
    initialItem
      ? {
          title: initialItem.title,
          description: initialItem.description || '',
          // When the dashboard bucket is selected, category is fixed.
          category: effectiveCategory,
        }
      : {
          title: '',
          description: '',
          category: effectiveCategory,
        },
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({
      ...values,
      category: normalizeBucketCategory(values.category),
    })

    if (!initialItem) {
      setValues({
        title: '',
        description: '',
        category: effectiveCategory,
      })
    }
  }

  const showCategoryField = !fixedCategory

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-5 p-5 sm:p-7 xl:sticky xl:top-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.24em] text-ink-800/55 uppercase">
            {initialItem ? 'Edit wish' : 'New wish'}
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink-950 sm:text-3xl">
            {initialItem
              ? 'Refine this wish'
              : fixedCategory
                ? 'Add a wish in this bucket'
                : 'Add a bucket list item'}
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

      {showCategoryField ? (
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-semibold text-ink-900">
            Category or life chapter
          </label>
          <input
            id="category"
            list="bucket-category-suggestions"
            value={values.category}
            className="field-input"
            placeholder="This year"
            onChange={(event) =>
              setValues((current) => ({ ...current, category: event.target.value }))
            }
          />
          <datalist id="bucket-category-suggestions">
            {bucketCategorySuggestions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
      ) : null}

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
