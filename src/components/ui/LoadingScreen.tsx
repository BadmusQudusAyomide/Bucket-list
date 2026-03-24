export const LoadingScreen = ({ label }: { label: string }) => (
  <div className="glass-panel flex min-h-[60vh] items-center justify-center px-6 py-16 text-center">
    <div className="space-y-4">
      <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-sun-400/25 border-t-sun-500" />
      <p className="text-sm font-semibold tracking-[0.2em] text-ink-800/60 uppercase">
        {label}
      </p>
    </div>
  </div>
)
