import { useState, useCallback } from 'react'
import { fetchCurrentMetrics, fetchHistoricalMetrics } from '../services/api.js'
import { usePolling } from './usePolling.js'

/**
 * Main metrics data hook.
 *
 * Polls current metrics every 30 s and provides a manual trigger for historical
 * metrics.
 *
 * @param {number|string} customerId
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
export function useMetrics(customerId, agentId) {
  const [currentMetrics, setCurrentMetrics] = useState(null)
  const [historicalMetrics, setHistoricalMetrics] = useState(null)

  // Build the polling callback. It captures customerId/agentId from the closure;
  // because usePolling updates its internal ref each render, changes to these
  // values automatically take effect on the next poll tick. We also include
  // them in the dependency array so the effect re-runs (resets the interval)
  // whenever either value changes.
  const pollCallback = useCallback(async () => {
    const data = await fetchCurrentMetrics(customerId, agentId)
    setCurrentMetrics(data)
  }, [customerId, agentId])

  const { isPolling, lastUpdate, consecutiveFailures, connectionLost, error } =
    usePolling(pollCallback, 30000, !!customerId)

  const fetchHistory = useCallback(
    async (options = {}) => {
      if (!customerId) return
      const data = await fetchHistoricalMetrics(customerId, agentId, options)
      setHistoricalMetrics(data)
    },
    [customerId, agentId]
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
