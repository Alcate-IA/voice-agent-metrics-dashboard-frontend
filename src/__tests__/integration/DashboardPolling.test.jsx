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

beforeEach(() => {
  vi.clearAllMocks()
  useMetrics.mockReturnValue(defaultMetrics)
  api.fetchAgents.mockResolvedValue([])
})

describe('Dashboard polling integration', () => {
  it('renders ConnectionStatus component', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      // ConnectionStatus shows countdown when no lastUpdate
      expect(screen.getByText(/\d+s/)).toBeInTheDocument()
    })
  })

  it('renders ConnectionStatus with lastUpdate timestamp', async () => {
    const lastUpdate = new Date('2026-03-13T10:00:00Z')
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      lastUpdate,
    })
    render(<Dashboard />)
    await waitFor(() => {
      // Shows formatted time in the connection status
      expect(screen.getByText(/\d+s/)).toBeInTheDocument()
    })
  })

  it('shows countdown timer in ConnectionStatus when not polling', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      lastUpdate: new Date(),
      isLoading: false,
    })
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/\d+s/)).toBeInTheDocument()
    })
  })

  it('shows polling indicator when isLoading is true', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      isLoading: true,
    })
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/polling/i)).toBeInTheDocument()
    })
  })

  it('ErrorBanner does not appear when there is no error', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('ErrorBanner appears when error is present', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      error: new Error('Network failure'),
      consecutiveFailures: 1,
    })
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/Network failure/i)).toBeInTheDocument()
    })
  })

  it('ErrorBanner shows connection lost message when connectionLost is true', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      connectionLost: true,
      consecutiveFailures: 3,
    })
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      const matches = screen.getAllByText(/connection lost/i)
      expect(matches.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('ErrorBanner shows consecutive failure count', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      connectionLost: true,
      consecutiveFailures: 5,
    })
    render(<Dashboard />)
    await waitFor(() => {
      const matches = screen.getAllByText(/5/)
      expect(matches.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('ConnectionStatus shows connection lost when connectionLost is true', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      connectionLost: true,
      consecutiveFailures: 3,
    })
    render(<Dashboard />)
    await waitFor(() => {
      const matches = screen.getAllByText(/connection lost/i)
      expect(matches.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('passes isPolling (from isLoading) to ConnectionStatus', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      isLoading: true,
      lastUpdate: new Date(),
    })
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/polling/i)).toBeInTheDocument()
    })
  })

  it('mocks fetchAgents correctly', async () => {
    api.fetchAgents.mockResolvedValue([{ id: 1, name: 'Test Agent' }])
    render(<Dashboard />)
    await waitFor(() => {
      expect(api.fetchAgents).toHaveBeenCalledTimes(1)
    })
  })
})
