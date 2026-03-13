import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMetrics } from '../../hooks/useMetrics.js'

vi.mock('../../services/api.js', () => ({
  fetchCurrentMetrics: vi.fn(),
  fetchHistoricalMetrics: vi.fn(),
}))

import { fetchCurrentMetrics, fetchHistoricalMetrics } from '../../services/api.js'

// API functions now return unwrapped data directly (no axios .data wrapper)
const mockCurrentData = {
  total_calls: 100,
  calls_today: 10,
  calls_this_week: 50,
  avg_duration: 120,
  completed: 80,
  failed: 10,
  pending: 10,
  total_cost: 5.0,
  daily_spend: 0.5,
}

const mockHistoricalData = {
  content: [{ id: 1, timestamp: '2026-03-01T00:00:00Z', total_calls: 20 }],
  total_elements: 1,
  page: 0,
  size: 20,
  total_pages: 1,
}

describe('useMetrics', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    fetchCurrentMetrics.mockResolvedValue(mockCurrentData)
    fetchHistoricalMetrics.mockResolvedValue(mockHistoricalData)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetches current metrics on mount with provided customerId and agentId', async () => {
    const { result } = renderHook(() => useMetrics(1, 7))

    await act(async () => {
      await Promise.resolve()
    })

    expect(fetchCurrentMetrics).toHaveBeenCalledWith(1, 7)
    expect(result.current.currentMetrics).toEqual(mockCurrentData)
  })

  it('starts with isLoading true and sets it to false after fetch', async () => {
    let resolveMetrics
    fetchCurrentMetrics.mockReturnValue(
      new Promise((res) => {
        resolveMetrics = res
      })
    )

    const { result } = renderHook(() => useMetrics(1, 7))
    expect(result.current.isLoading).toBe(true)

    await act(async () => {
      resolveMetrics(mockCurrentData)
      await Promise.resolve()
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('re-fetches when customerId changes', async () => {
    const { result, rerender } = renderHook(
      ({ customerId, agentId }) => useMetrics(customerId, agentId),
      { initialProps: { customerId: 1, agentId: 7 } }
    )

    await act(async () => {
      await Promise.resolve()
    })
    expect(fetchCurrentMetrics).toHaveBeenCalledTimes(1)

    rerender({ customerId: 2, agentId: 7 })
    await act(async () => {
      await Promise.resolve()
    })
    expect(fetchCurrentMetrics).toHaveBeenCalledTimes(2)
    expect(fetchCurrentMetrics).toHaveBeenLastCalledWith(2, 7)
  })

  it('re-fetches when agentId changes', async () => {
    const { result, rerender } = renderHook(
      ({ customerId, agentId }) => useMetrics(customerId, agentId),
      { initialProps: { customerId: 1, agentId: 7 } }
    )

    await act(async () => {
      await Promise.resolve()
    })
    expect(fetchCurrentMetrics).toHaveBeenCalledTimes(1)

    rerender({ customerId: 1, agentId: 8 })
    await act(async () => {
      await Promise.resolve()
    })
    expect(fetchCurrentMetrics).toHaveBeenCalledTimes(2)
    expect(fetchCurrentMetrics).toHaveBeenLastCalledWith(1, 8)
  })

  it('fetchHistory fetches historical metrics with default options', async () => {
    const { result } = renderHook(() => useMetrics(1, 7))

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.fetchHistory()
    })

    expect(fetchHistoricalMetrics).toHaveBeenCalledWith(1, 7, {})
    expect(result.current.historicalMetrics).toEqual(mockHistoricalData)
  })

  it('fetchHistory passes custom options', async () => {
    const { result } = renderHook(() => useMetrics(1, 7))

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      await result.current.fetchHistory({ days: 7, page: 1, size: 10 })
    })

    expect(fetchHistoricalMetrics).toHaveBeenCalledWith(1, 7, { days: 7, page: 1, size: 10 })
  })

  it('sets error when fetch fails', async () => {
    const error = new Error('API error')
    fetchCurrentMetrics.mockRejectedValue(error)

    const { result } = renderHook(() => useMetrics(1, 7))

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.error).toBe(error)
  })

  it('returns lastUpdate and connectionLost from polling state', async () => {
    const { result } = renderHook(() => useMetrics(1, 7))

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.lastUpdate).toBeInstanceOf(Date)
    expect(result.current.connectionLost).toBe(false)
  })
})
