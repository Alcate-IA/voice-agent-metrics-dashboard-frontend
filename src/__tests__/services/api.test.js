import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios', () => {
  const mockAxios = {
    get: vi.fn(),
    defaults: { baseURL: '' },
    create: vi.fn(),
  }
  return { default: mockAxios }
})

// Import after mock so the module picks up mocked axios
import {
  fetchCustomers,
  fetchAgents,
  fetchCurrentMetrics,
  fetchHistoricalMetrics,
} from '../../services/api.js'

describe('API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({ data: [] })
  })

  describe('fetchCustomers', () => {
    it('calls /api/customers', async () => {
      await fetchCustomers()
      expect(axios.get).toHaveBeenCalledWith('/api/customers')
    })
  })

  describe('fetchAgents', () => {
    it('calls /api/agents with customerId param', async () => {
      await fetchAgents(42)
      expect(axios.get).toHaveBeenCalledWith('/api/agents', {
        params: { customerId: 42 },
      })
    })
  })

  describe('fetchCurrentMetrics', () => {
    it('calls /api/metrics with customerId and agentId params', async () => {
      await fetchCurrentMetrics(1, 7)
      expect(axios.get).toHaveBeenCalledWith('/api/metrics', {
        params: { customerId: 1, agentId: 7 },
      })
    })
  })

  describe('fetchHistoricalMetrics', () => {
    it('calls /api/metrics/history with default params', async () => {
      await fetchHistoricalMetrics(1, 7)
      expect(axios.get).toHaveBeenCalledWith('/api/metrics/history', {
        params: {
          customerId: 1,
          agentId: 7,
          days: 30,
          page: 0,
          size: 20,
          sortBy: 'timestamp',
        },
      })
    })

    it('calls /api/metrics/history with custom params', async () => {
      await fetchHistoricalMetrics(2, 3, { days: 7, page: 1, size: 10, sortBy: 'date' })
      expect(axios.get).toHaveBeenCalledWith('/api/metrics/history', {
        params: {
          customerId: 2,
          agentId: 3,
          days: 7,
          page: 1,
          size: 10,
          sortBy: 'date',
        },
      })
    })

    it('applies partial overrides while keeping defaults for unspecified options', async () => {
      await fetchHistoricalMetrics(1, 1, { days: 14 })
      expect(axios.get).toHaveBeenCalledWith('/api/metrics/history', {
        params: {
          customerId: 1,
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
