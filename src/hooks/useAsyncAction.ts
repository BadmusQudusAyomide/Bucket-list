import { useState } from 'react'

export const useAsyncAction = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async <T,>(callback: () => Promise<T>) => {
    setLoading(true)
    setError(null)

    try {
      return await callback()
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : 'Something went wrong. Please try again.'
      setError(message)
      throw reason
    } finally {
      setLoading(false)
    }
  }

  return { run, loading, error, setError }
}
