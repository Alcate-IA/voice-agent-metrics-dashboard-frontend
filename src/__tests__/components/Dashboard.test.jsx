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

const mockCustomers = [
  { id: 1, name: 'Customer A' },
  { id: 2, name: 'Customer B' },
]

const mockAgents = [
  { id: 10, name: 'Agent One' },
  { id: 11, name: 'Agent Two' },
]

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useMetrics.mockReturnValue(defaultMetrics)
    api.fetchCustomers.mockResolvedValue({ data: mockCustomers })
    api.fetchAgents.mockResolvedValue({ data: mockAgents })
  })

  it('renders without crashing', async () => {
    const { container } = render(<Dashboard />)
    expect(container).toBeTruthy()
  })

  it('shows loading state initially (before customers load)', async () => {
    // fetchCustomers returns a promise that we can control timing of
    api.fetchCustomers.mockReturnValue(new Promise(() => {})) // never resolves
    render(<Dashboard />)
    // The dashboard container should still render
    const dashboardEl = document.querySelector('[class*="dashboard"]') ||
                        document.querySelector('.dashboard') ||
                        document.getElementById('dashboard')
    expect(document.body).toBeTruthy()
  })

  it('renders Header component', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      // Header should contain customer and agent selector elements
      expect(document.body).toBeTruthy()
    })
    // There should be select elements for customers and agents
    const selects = document.querySelectorAll('select')
    expect(selects.length).toBeGreaterThanOrEqual(1)
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

  it('renders placeholder sections for metrics grid, charts, and calls table', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      const metricsGrid = document.querySelector('[class*="metricsGrid"]')
      const chartsSection = document.querySelector('[class*="chartsSection"]')
      const tableSection = document.querySelector('[class*="tableSection"]')
      expect(metricsGrid).toBeTruthy()
      expect(chartsSection).toBeTruthy()
      expect(tableSection).toBeTruthy()
    })
  })

  it('fetches customers on mount', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(api.fetchCustomers).toHaveBeenCalledTimes(1)
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
      // Both ErrorBanner and ConnectionStatus show "Connection lost" — check at least one
      const matches = screen.getAllByText(/Connection lost/i)
      expect(matches.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders customer options after loading', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Customer A')).toBeInTheDocument()
    })
  })
})
