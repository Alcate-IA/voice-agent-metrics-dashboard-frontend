import { AlertTriangle, WifiOff } from 'lucide-react'

function ErrorBanner({ error, connectionLost, consecutiveFailures }) {
  if (!error && !connectionLost) return null

  const errorMessage = error?.message || null

  return (
    <div className="animate-fade-up" role="alert" aria-live="assertive">
      {connectionLost && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">
            Connection lost — retrying&hellip;
          </span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}
      {consecutiveFailures > 0 && (
        <p className="text-xs text-muted-foreground pl-1">
          ({consecutiveFailures} consecutive failure
          {consecutiveFailures !== 1 ? 's' : ''})
        </p>
      )}
    </div>
  )
}

export default ErrorBanner
