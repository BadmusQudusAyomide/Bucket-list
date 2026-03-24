import { useState } from 'react'

interface ShareItemFormProps {
  onShare: (email: string) => Promise<void>
  loading?: boolean
}

export const ShareItemForm = ({ onShare, loading = false }: ShareItemFormProps) => {
  const [email, setEmail] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onShare(email)
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        className="field-input flex-1"
        placeholder="teammate@example.com"
        onChange={(event) => setEmail(event.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-950 transition duration-200 hover:-translate-y-0.5 hover:bg-sand-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sharing...' : 'Share'}
      </button>
    </form>
  )
}
