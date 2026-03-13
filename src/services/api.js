import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || ''

export const fetchCustomers = () => axios.get('/api/customers')

export const fetchAgents = (customerId) =>
  axios.get('/api/agents', { params: { customerId } })

export const fetchCurrentMetrics = (customerId, agentId) =>
  axios.get('/api/metrics', { params: { customerId, agentId } })

export const fetchHistoricalMetrics = (
  customerId,
  agentId,
  { days = 30, page = 0, size = 20, sortBy = 'timestamp' } = {}
) =>
  axios.get('/api/metrics/history', {
    params: { customerId, agentId, days, page, size, sortBy },
  })
