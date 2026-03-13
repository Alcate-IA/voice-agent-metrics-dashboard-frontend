import { useState, useCallback } from 'react'
import { fetchCurrentMetrics, fetchHistoricalMetrics } from '../services/api.js'
import { usePolling } from './usePolling.js'

/**
 * Main metrics data hook.
 *
 * Polls current metrics every 30 s and provides a manual trigger for historical
 * metrics.
 *
 * @param {number|string} agentId
 * @returns {{
 *   currentMetrics: object|null,
 *   historicalMetrics: object|null,
 *   isLoading: boolean,
 *   error: Error|null,
 *   lastUpdate: Date|null,
 *   connectionLost: boolean,
 *   consecutiveFailures: number,
 *   fetchHistory: (options?: object) => Promise<void>
 * }}
 */
export function useMetrics(agentId) {
  const [currentMetrics, setCurrentMetrics] = useState(null)
  const [historicalMetrics, setHistoricalMetrics] = useState(null)

  const pollCallback = useCallback(async () => {
    const data = await fetchCurrentMetrics(agentId)
    setCurrentMetrics(data)
  }, [agentId])

  const { isPolling, lastUpdate, consecutiveFailures, connectionLost, error } =
    usePolling(pollCallback, 30000, !!agentId)

  const fetchHistory = useCallback(
    async (options = {}) => {
      if (!agentId) return
      try {
        const data = await fetchHistoricalMetrics(agentId, options)
        setHistoricalMetrics(data)
      } catch {
        // Historical fetch errors are non-fatal; current-metrics polling
        // already surfaces connection issues via usePolling.
      }
    },
    [agentId]
  )

  return {
    currentMetrics,
    historicalMetrics,
    isLoading: isPolling,
    error,
    lastUpdate,
    connectionLost,
    consecutiveFailures,
    fetchHistory,
  }
}
