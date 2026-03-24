import { Timestamp } from 'firebase/firestore'
import type { BucketItem, UserProfile } from '../types/firebase'

const toDate = (value: Timestamp | Date | null | undefined) => {
  if (!value) {
    return null
  }

  if (value instanceof Timestamp) {
    return value.toDate()
  }

  return value
}

export const mapUserProfile = (
  uid: string,
  data: Record<string, unknown>,
): UserProfile => ({
  uid,
  email: String(data.email ?? ''),
  role: data.role === 'admin' ? 'admin' : 'user',
  createdAt: toDate(data.createdAt as Timestamp | Date | undefined),
})

export const mapBucketItem = (
  id: string,
  data: Record<string, unknown>,
): BucketItem => ({
  id,
  userId: String(data.userId ?? ''),
  title: String(data.title ?? ''),
  description: typeof data.description === 'string' ? data.description : '',
  completed: Boolean(data.completed),
  collaborators: Array.isArray(data.collaborators)
    ? data.collaborators
        .filter((entry): entry is { userId: string; role?: string } =>
          Boolean(entry && typeof entry === 'object' && 'userId' in entry),
        )
        .map((entry) => ({
          userId: entry.userId,
          role: 'editor' as const,
        }))
    : [],
  collaboratorIds: Array.isArray(data.collaboratorIds)
    ? data.collaboratorIds.filter((value): value is string => typeof value === 'string')
    : [],
  createdAt: toDate(data.createdAt as Timestamp | Date | undefined),
  updatedAt: toDate(data.updatedAt as Timestamp | Date | undefined),
})
