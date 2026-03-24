import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import { mapBucketItem, mapUserProfile } from '../utils/firebaseMappers'
import type { BucketItem, BucketItemInput, UserProfile } from '../types/firebase'

const bucketItemsRef = collection(db, 'bucketItems')
const usersRef = collection(db, 'users')

export const bucketItemsQuery = (uid: string) =>
  query(bucketItemsRef, where('userId', '==', uid), orderBy('createdAt', 'desc'))

export const sharedBucketItemsQuery = (uid: string) =>
  query(
    bucketItemsRef,
    where('collaboratorIds', 'array-contains', uid),
    orderBy('createdAt', 'desc'),
  )

export const createBucketItem = async (uid: string, values: BucketItemInput) => {
  await addDoc(bucketItemsRef, {
    userId: uid,
    title: values.title.trim(),
    description: values.description?.trim() ?? '',
    completed: false,
    collaborators: [],
    collaboratorIds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateBucketItem = async (itemId: string, values: BucketItemInput) => {
  await updateDoc(doc(db, 'bucketItems', itemId), {
    title: values.title.trim(),
    description: values.description?.trim() ?? '',
    updatedAt: serverTimestamp(),
  })
}

export const deleteBucketItem = async (item: BucketItem) => {
  await deleteDoc(doc(db, 'bucketItems', item.id))
}

export const setBucketItemCompleted = async (item: BucketItem, completed: boolean) => {
  await updateDoc(doc(db, 'bucketItems', item.id), {
    completed,
    updatedAt: serverTimestamp(),
  })
}

export const shareBucketItemWithEmail = async (item: BucketItem, email: string) => {
  const emailQuery = query(usersRef, where('email', '==', email.trim().toLowerCase()), limit(1))
  const userResult = await getDocs(emailQuery)

  if (userResult.empty) {
    throw new Error('No user found for that email address.')
  }

  const collaboratorDoc = userResult.docs[0]
  const collaborator = mapUserProfile(collaboratorDoc.id, collaboratorDoc.data())

  if (collaborator.uid === item.userId) {
    throw new Error('You already own this bucket item.')
  }

  const collaboratorIds = Array.from(new Set([...item.collaboratorIds, collaborator.uid]))
  const collaborators = collaboratorIds.map((userId) => ({ userId, role: 'editor' as const }))

  await updateDoc(doc(db, 'bucketItems', item.id), {
    collaboratorIds,
    collaborators,
    updatedAt: serverTimestamp(),
  })

  return collaborator
}

export const removeCollaborator = async (item: BucketItem, collaboratorUid: string) => {
  const collaboratorIds = item.collaboratorIds.filter((uid) => uid !== collaboratorUid)
  const collaborators = item.collaborators.filter(
    (collaborator) => collaborator.userId !== collaboratorUid,
  )

  await updateDoc(doc(db, 'bucketItems', item.id), {
    collaboratorIds,
    collaborators,
    updatedAt: serverTimestamp(),
  })
}

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const snapshot = await getDocs(query(usersRef, orderBy('email', 'asc')))
  return snapshot.docs.map((entry) => mapUserProfile(entry.id, entry.data()))
}

export const getItemsForUser = async (uid: string): Promise<BucketItem[]> => {
  const snapshot = await getDocs(
    query(bucketItemsRef, where('userId', '==', uid), orderBy('createdAt', 'desc')),
  )
  return snapshot.docs.map((entry) => mapBucketItem(entry.id, entry.data()))
}

export const getUserProfileByUid = async (uid: string): Promise<UserProfile | null> => {
  const snapshot = await getDoc(doc(db, 'users', uid))

  if (!snapshot.exists()) {
    return null
  }

  return mapUserProfile(snapshot.id, snapshot.data())
}
