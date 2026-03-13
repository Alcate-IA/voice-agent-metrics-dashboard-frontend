import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.hoisted ensures the mock fn is available when vi.mock runs (hoisted)
const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    create: () => ({ get: mockGet }),
  },
}))

import {
  fetchAgents,
  fetchCurrentMetrics,
  fetchHistoricalMetrics,
} from '../../services/api.js'

describe('API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGet.mockResolvedValue({
      data: { data: [], status: 'success', timestamp: Date.now() },
    })
  })

  describe('fetchAgents', () => {
    it('calls /api/agents and unwraps', async () => {
      const mockAgents = [{ id: 10, name: 'Agent' }]
      mockGet.mockResolvedValue({
        data: { data: mockAgents, status: 'success', timestamp: Date.now() },
      })
      const result = await fetchAgents()
      expect(mockGet).toHaveBeenCalledWith('/api/agents')
      expect(result).toEqual(mockAgents)
    })
  })

  describe('fetchCurrentMetrics', () => {
    it('calls /api/metrics with agentId param and unwraps', async () => {
      const mockMetrics = { total_calls: 100 }
      mockGet.mockResolvedValue({
        data: { data: mockMetrics, status: 'success', timestamp: Date.now() },
      })
      const result = await fetchCurrentMetrics(7)
      expect(mockGet).toHaveBeenCalledWith('/api/metrics', {
        params: { agentId: 7 },
      })
      expect(result).toEqual(mockMetrics)
    })
  })

  describe('fetchHistoricalMetrics', () => {
    it('calls /api/metrics/history with default params', async () => {
      mockGet.mockResolvedValue({
        data: { data: { content: [] }, status: 'success', timestamp: Date.now() },
      })
      await fetchHistoricalMetrics(7)
      expect(mockGet).toHaveBeenCalledWith('/api/metrics/history', {
        params: {
          agentId: 7,
          days: 30,
          page: 0,
          size: 20,
          sortBy: 'timestamp',
        },
      })
    })

    it('maps snake_case sort fields to camelCase for backend', async () => {
      mockGet.mockResolvedValue({
        data: { data: { content: [] }, status: 'success', timestamp: Date.now() },
      })
      await fetchHistoricalMetrics(3, { days: 7, page: 1, size: 10, sortBy: 'total_calls' })
      expect(mockGet).toHaveBeenCalledWith('/api/metrics/history', {
        params: {
          agentId: 3,
          days: 7,
          page: 1,
          size: 10,
          sortBy: 'totalCalls',
        },
      })
    })

    it('applies partial overrides while keeping defaults', async () => {
      mockGet.mockResolvedValue({
        data: { data: { content: [] }, status: 'success', timestamp: Date.now() },
      })
      await fetchHistoricalMetrics(1, { days: 14 })
      expect(mockGet).toHaveBeenCalledWith('/api/metrics/history', {
        params: {
          agentId: 1,
          days: 14,
          page: 0,
          size: 20,
          sortBy: 'timestamp',
        },
      })
    })
  })
})
