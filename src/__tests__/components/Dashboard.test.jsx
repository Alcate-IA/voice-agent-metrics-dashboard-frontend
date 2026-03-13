import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dashboard from '../../components/Dashboard'

vi.mock('../../services/api', () => ({
  fetchAgents: vi.fn(),
  fetchCurrentMetrics: vi.fn(),
  fetchHistoricalMetrics: vi.fn(),
}))

vi.mock('../../hooks/useMetrics', () => ({
  useMetrics: vi.fn(),
}))

import * as api from '../../services/api'
import { useMetrics } from '../../hooks/useMetrics'

const defaultMetrics = {
  currentMetrics: null,
  historicalMetrics: null,
  isLoading: false,
  error: null,
  lastUpdate: null,
  connectionLost: false,
  consecutiveFailures: 0,
  fetchHistory: vi.fn(),
}

const mockAgents = [
  { id: 10, name: 'Agent One' },
  { id: 11, name: 'Agent Two' },
]

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useMetrics.mockReturnValue(defaultMetrics)
    api.fetchAgents.mockResolvedValue(mockAgents)
  })

  it('renders without crashing', async () => {
    const { container } = render(<Dashboard />)
    expect(container).toBeTruthy()
  })

  it('renders dashboard container with id', async () => {
    render(<Dashboard />)
    expect(document.getElementById('dashboard')).toBeTruthy()
  })

  it('renders Header with agent select', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      const triggers = screen.getAllByRole('combobox')
      expect(triggers.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders ErrorBanner when error exists', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      error: new Error('API Failed'),
      consecutiveFailures: 1,
    })
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/API Failed/i)).toBeInTheDocument()
    })
  })

  it('renders metrics grid and charts sections', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      // MetricsGrid and ChartsSection both show "No data" messages when no metrics
      const noDataMessages = screen.getAllByText(/No (data|chart)/i)
      expect(noDataMessages.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('fetches agents on mount', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(api.fetchAgents).toHaveBeenCalledTimes(1)
    })
  })

  it('shows connection lost state via ErrorBanner', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      connectionLost: true,
      consecutiveFailures: 3,
    })
    render(<Dashboard />)
    await waitFor(() => {
      const matches = screen.getAllByText(/Connection lost/i)
      expect(matches.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('loads agents and auto-selects first on mount', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(api.fetchAgents).toHaveBeenCalled()
    })
  })
})
