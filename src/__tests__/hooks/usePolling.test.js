import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePolling } from '../../hooks/usePolling.js'

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls callback immediately on mount', async () => {
    const callback = vi.fn().mockResolvedValue('ok')
    renderHook(() => usePolling(callback, 5000))
    // Flush the microtask queue so the async callback completes
    await act(async () => {
      await Promise.resolve()
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('calls callback again after interval elapses', async () => {
    const callback = vi.fn().mockResolvedValue('ok')
    renderHook(() => usePolling(callback, 5000))
    await act(async () => {
      await Promise.resolve()
    })
    expect(callback).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.advanceTimersByTime(5000)
      await Promise.resolve()
    })
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('tracks consecutive failures and sets error', async () => {
    const error = new Error('network error')
    const callback = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() => usePolling(callback, 1000))

    // First failure
    await act(async () => {
      await Promise.resolve()
    })
    expect(result.current.consecutiveFailures).toBe(1)
    expect(result.current.error).toBe(error)

    // Second failure
    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })
    expect(result.current.consecutiveFailures).toBe(2)

    // Third failure — connectionLost should now be true
    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })
    expect(result.current.consecutiveFailures).toBe(3)
    expect(result.current.connectionLost).toBe(true)
  })

  it('resets failure count on success after failures', async () => {
    const error = new Error('fail')
    const callback = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockResolvedValue('ok')

    const { result } = renderHook(() => usePolling(callback, 1000))

    // Three failures
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        if (i > 0) vi.advanceTimersByTime(1000)
        await Promise.resolve()
      })
    }
    expect(result.current.connectionLost).toBe(true)

    // Success
    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })
    expect(result.current.consecutiveFailures).toBe(0)
    expect(result.current.connectionLost).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('does not poll when enabled is false', async () => {
    const callback = vi.fn().mockResolvedValue('ok')
    renderHook(() => usePolling(callback, 1000, false))
    await act(async () => {
      vi.advanceTimersByTime(5000)
      await Promise.resolve()
    })
    expect(callback).not.toHaveBeenCalled()
  })

  it('cleans up interval on unmount', async () => {
    const callback = vi.fn().mockResolvedValue('ok')
    const { unmount } = renderHook(() => usePolling(callback, 1000))
    await act(async () => {
      await Promise.resolve()
    })
    unmount()
    await act(async () => {
      vi.advanceTimersByTime(5000)
      await Promise.resolve()
    })
    // Should still be 1 — no additional calls after unmount
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('returns isPolling true while callback is in-flight', async () => {
    let resolve
    const callback = vi.fn().mockReturnValue(
      new Promise((res) => {
        resolve = res
      })
    )
    const { result } = renderHook(() => usePolling(callback, 5000))
    // While the promise hasn't resolved, isPolling should be true
    expect(result.current.isPolling).toBe(true)
    await act(async () => {
      resolve('done')
      await Promise.resolve()
    })
    expect(result.current.isPolling).toBe(false)
  })
})
