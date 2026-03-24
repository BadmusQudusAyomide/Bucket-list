interface StatusMessageProps {
  title: string
  description: string
  tone?: 'neutral' | 'error'
}

export const StatusMessage = ({
  title,
  description,
  tone = 'neutral',
}: StatusMessageProps) => {
  const toneClasses =
    tone === 'error'
      ? 'border-rose-400/30 bg-rose-400/10 text-rose-400'
      : 'border-ink-900/10 bg-cloud-100/70 text-ink-800'

  return (
    <div className={`rounded-3xl border px-5 py-4 ${toneClasses}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-80">{description}</p>
    </div>
  )
}
