import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Generic polling hook.
 *
 * @param {() => Promise<any>} callback - Async function to call on each poll tick.
 * @param {number} intervalMs - Polling interval in milliseconds (default 30 000).
 * @param {boolean} enabled - When false, polling is disabled entirely (default true).
 * @returns {{ isPolling: boolean, lastUpdate: Date|null, consecutiveFailures: number, connectionLost: boolean, error: Error|null }}
 */
export function usePolling(callback, intervalMs = 30000, enabled = true) {
  const [isPolling, setIsPolling] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [consecutiveFailures, setConsecutiveFailures] = useState(0)
  const [connectionLost, setConnectionLost] = useState(false)
  const [error, setError] = useState(null)

  // Track mounted state to avoid state updates after unmount
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    const execute = async () => {
      if (cancelled) return
      setIsPolling(true)
      try {
        await callback()
        if (!cancelled) {
          setConsecutiveFailures(0)
          setConnectionLost(false)
          setError(null)
          setLastUpdate(new Date())
        }
      } catch (err) {
        if (!cancelled) {
          setError(err)
          setConsecutiveFailures((prev) => {
            const next = prev + 1
            if (next >= 3) {
              setConnectionLost(true)
            }
            return next
          })
        }
      } finally {
        if (!cancelled) {
          setIsPolling(false)
        }
      }
    }

    // Immediate call on mount / when callback changes
    execute()

    const id = setInterval(execute, intervalMs)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [enabled, intervalMs, callback])

  return { isPolling, lastUpdate, consecutiveFailures, connectionLost, error }
}
