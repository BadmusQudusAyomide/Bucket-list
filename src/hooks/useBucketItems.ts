import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import {
  bucketItemsQuery,
  sharedBucketItemsQuery,
} from '../services/bucketService'
import { mapBucketItem } from '../utils/firebaseMappers'
import type { BucketItem } from '../types/firebase'

const getFriendlyBucketItemsError = (message: string) => {
  if (message.includes('query requires an index')) {
    return 'Firestore index is missing or still building. Check the browser console for the Firebase link.'
  }

  if (message.includes('insufficient permissions')) {
    return 'Firestore denied access. Check your rules and signed-in user profile.'
  }

  return message || 'Unable to load bucket items.'
}

export const useBucketItems = (uid?: string | null) => {
  const [items, setItems] = useState<BucketItem[]>([])
  const [loading, setLoading] = useState(Boolean(uid))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!uid) {
      return
    }

    let ownedItems: BucketItem[] = []
    let sharedItems: BucketItem[] = []
    let ownedResolved = false
    let sharedResolved = false

    const syncState = () => {
      const merged = [...ownedItems, ...sharedItems].sort((left, right) => {
        return (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0)
      })

      if (ownedResolved) {
        setError(null)
      }
      setItems(merged)

      if (ownedResolved && sharedResolved) {
        setLoading(false)
      }
    }

    const unsubscribeOwned = onSnapshot(
      bucketItemsQuery(uid),
      (snapshot) => {
        ownedResolved = true
        ownedItems = snapshot.docs.map((entry) => mapBucketItem(entry.id, entry.data()))
        syncState()
      },
      (reason) => {
        console.error('Bucket items query failed:', reason)
        ownedResolved = true
        sharedResolved = true
        setError(getFriendlyBucketItemsError(reason.message || 'Unable to load your bucket items.'))
        setLoading(false)
      },
    )

    const unsubscribeShared = onSnapshot(
      sharedBucketItemsQuery(uid),
      (snapshot) => {
        sharedResolved = true
        sharedItems = snapshot.docs.map((entry) => mapBucketItem(entry.id, entry.data()))
        syncState()
      },
      (reason) => {
        console.error('Shared bucket items query failed:', reason)
        sharedResolved = true
        sharedItems = []

        if (!ownedResolved) {
          setError(
            getFriendlyBucketItemsError(reason.message || 'Unable to load shared bucket items.'),
          )
          setLoading(false)
          return
        }

        syncState()
      },
    )

    return () => {
      unsubscribeOwned()
      unsubscribeShared()
    }
  }, [uid])

  return { items, loading, error }
}
