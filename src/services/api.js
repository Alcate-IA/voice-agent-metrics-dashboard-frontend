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

export const fetchAgents = () =>
  apiClient.get('/api/agents').then(unwrap)

export const fetchCurrentMetrics = (agentId) =>
  apiClient.get('/api/metrics', { params: { agentId } }).then(unwrap)

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
  agentId,
  { days = 30, page = 0, size = 20, sortBy = 'timestamp' } = {}
) => {
  const mappedSort = SORT_FIELD_MAP[sortBy] || 'timestamp'
  return apiClient
    .get('/api/metrics/history', {
      params: { agentId, days, page, size, sortBy: mappedSort },
    })
    .then(unwrap)
}
