import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

function ConnectionStatus({
  lastUpdate,
  isPolling,
  connectionLost,
  consecutiveFailures,
  intervalMs = 30000,
}) {
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(
    Math.round(intervalMs / 1000)
  )

  useEffect(() => {
    setSecondsUntilRefresh(Math.round(intervalMs / 1000))
    const id = setInterval(() => {
      setSecondsUntilRefresh((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [lastUpdate, intervalMs])

  const formattedLastUpdate = lastUpdate
    ? lastUpdate.toLocaleTimeString()
    : null

  if (connectionLost) {
    return (
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 backdrop-blur-sm">
        <WifiOff className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-xs font-medium text-rose-400">
          Connection lost ({consecutiveFailures} failures)
        </span>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 px-3 py-2 rounded-lg bg-card/80 border border-border backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        </div>
        {formattedLastUpdate && (
          <span className="text-xs text-muted-foreground">
            {formattedLastUpdate}
          </span>
        )}
      </div>

      {isPolling ? (
        <span className="text-xs text-cyan-400 font-medium">
          Polling&hellip;
        </span>
      ) : (
        <span className="text-xs text-muted-foreground font-mono tabular-nums">
          {secondsUntilRefresh}s
        </span>
      )}
    </div>
  )
}

export default ConnectionStatus
