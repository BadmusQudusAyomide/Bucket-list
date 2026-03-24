export type UserRole = 'user' | 'admin'

export interface UserProfile {
  uid: string
  email: string
  role: UserRole
  createdAt?: Date | null
}

export interface Collaborator {
  userId: string
  role: 'editor'
}

export interface BucketItem {
  id: string
  userId: string
  title: string
  description?: string
  completed: boolean
  collaborators: Collaborator[]
  collaboratorIds: string[]
  createdAt: Date | null
  updatedAt?: Date | null
}

export interface BucketItemInput {
  title: string
  description?: string
}
