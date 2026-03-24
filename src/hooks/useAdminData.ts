import { useEffect, useState } from 'react'
import { getAllUsers, getItemsForUser } from '../services/bucketService'
import type { BucketItem, UserProfile } from '../types/firebase'

export const useAdminData = () => {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [items, setItems] = useState<BucketItem[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingItems, setLoadingItems] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true)
      setError(null)

      try {
        const result = await getAllUsers()
        setUsers(result)
        setSelectedUser((current) => current ?? result[0] ?? null)
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Unable to fetch users.')
      } finally {
        setLoadingUsers(false)
      }
    }

    void loadUsers()
  }, [])

  useEffect(() => {
    if (!selectedUser) {
      setItems([])
      return
    }

    const loadItems = async () => {
      setLoadingItems(true)
      setError(null)

      try {
        const result = await getItemsForUser(selectedUser.uid)
        setItems(result)
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Unable to fetch bucket items.')
      } finally {
        setLoadingItems(false)
      }
    }

    void loadItems()
  }, [selectedUser])

  return {
    users,
    selectedUser,
    items,
    loadingUsers,
    loadingItems,
    error,
    setSelectedUser,
  }
}
