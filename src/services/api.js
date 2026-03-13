import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
})

/**
 * Unwrap the backend ApiResponse envelope.
 * Backend returns: { data: T, status: string, message: string, timestamp: number }
 * We extract just the inner `data` field.
 */
const unwrap = (response) => response.data?.data ?? response.data

export const fetchCustomers = () =>
  apiClient.get('/api/customers').then(unwrap)

export const fetchAgents = (customerId) =>
  apiClient.get('/api/agents', { params: { customerId } }).then(unwrap)

export const fetchCurrentMetrics = (customerId, agentId) =>
  apiClient.get('/api/metrics', { params: { customerId, agentId } }).then(unwrap)

/**
 * Map frontend snake_case sort fields to backend camelCase entity fields.
 */
const SORT_FIELD_MAP = {
  timestamp: 'timestamp',
  total_calls: 'totalCalls',
  avg_duration: 'avgDuration',
  completed: 'completed',
  failed: 'failed',
  pending: 'pending',
  total_cost: 'totalCost',
}

export const fetchHistoricalMetrics = (
  customerId,
  agentId,
  { days = 30, page = 0, size = 20, sortBy = 'timestamp' } = {}
) => {
  const mappedSort = SORT_FIELD_MAP[sortBy] || 'timestamp'
  return apiClient
    .get('/api/metrics/history', {
      params: { customerId, agentId, days, page, size, sortBy: mappedSort },
    })
    .then(unwrap)
}
