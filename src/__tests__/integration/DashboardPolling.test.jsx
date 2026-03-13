import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dashboard from '../../components/Dashboard'

// Mock the API module
vi.mock('../../services/api', () => ({
  fetchCustomers: vi.fn(),
  fetchAgents: vi.fn(),
  fetchCurrentMetrics: vi.fn(),
  fetchHistoricalMetrics: vi.fn(),
}))

// Mock the useMetrics hook
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
  api.fetchCustomers.mockResolvedValue({ data: [] })
  api.fetchAgents.mockResolvedValue({ data: [] })
})

describe('Dashboard polling integration', () => {
  it('renders ConnectionStatus component', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      // ConnectionStatus renders "Never" when lastUpdate is null
      expect(screen.getByText(/never/i)).toBeInTheDocument()
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
      expect(screen.getByText(/last update/i)).toBeInTheDocument()
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
      expect(screen.getByText(/next refresh/i)).toBeInTheDocument()
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
      expect(screen.getByText(/5 consecutive failures/i)).toBeInTheDocument()
    })
  })

  it('ConnectionStatus shows warning icon when connectionLost is true', async () => {
    useMetrics.mockReturnValue({
      ...defaultMetrics,
      connectionLost: true,
    })
    render(<Dashboard />)
    await waitFor(() => {
      // ConnectionStatus renders "Connection lost" text when connectionLost=true
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
      // When isPolling=true, ConnectionStatus shows "Polling..."
      expect(screen.getByText(/polling/i)).toBeInTheDocument()
    })
  })

  it('mocks fetchCustomers and fetchAgents correctly', async () => {
    api.fetchCustomers.mockResolvedValue({ data: [{ id: 1, name: 'Test Corp' }] })
    render(<Dashboard />)
    await waitFor(() => {
      expect(api.fetchCustomers).toHaveBeenCalledTimes(1)
    })
  })
})
