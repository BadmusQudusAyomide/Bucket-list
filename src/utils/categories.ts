import type { BucketItem } from '../types/firebase'

// Public UX label (what users see as "other goals")
export const DEFAULT_BUCKET_CATEGORY = 'Other human goals'

// Legacy fallback to keep existing saved items grouped correctly.
const LEGACY_DEFAULT_BUCKET_CATEGORY = 'Someday dreams'

// Buckets shown on the dashboard after login.
export const goalBucketSuggestions = [
  'This year',
  'This month',
  'Before 25',
  'Before 20',
  'This quarter',
  DEFAULT_BUCKET_CATEGORY,
] as const

export const bucketCategorySuggestions = [
  'This year',
  'This month',
  'This quarter',
  'Before 25',
  'Before 20',
  'Before 30',
  'Travel goals',
  'Career goals',
  'Health and wellness',
  'Family and relationships',
  'Learning goals',
  DEFAULT_BUCKET_CATEGORY,
]

export const normalizeBucketCategory = (value?: string | null) => {
  const cleaned = value?.trim()
  if (cleaned && cleaned.length > 0) {
    if (cleaned === LEGACY_DEFAULT_BUCKET_CATEGORY) {
      return DEFAULT_BUCKET_CATEGORY
    }

    return cleaned
  }

  return DEFAULT_BUCKET_CATEGORY
}

export const groupBucketItemsByCategory = (items: BucketItem[]) => {
  const grouped = new Map<string, BucketItem[]>()

  for (const item of items) {
    const key = normalizeBucketCategory(item.category)
    const currentItems = grouped.get(key) ?? []
    currentItems.push(item)
    grouped.set(key, currentItems)
  }

  return Array.from(grouped.entries())
    .map(([category, categoryItems]) => ({
      category,
      items: categoryItems.sort(
        (left, right) => (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0),
      ),
    }))
    .sort((left, right) => left.category.localeCompare(right.category))
}
