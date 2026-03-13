import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import StatusBreakdownChart from '../../components/StatusBreakdownChart'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => null,
  Legend: () => null,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
}))

const mockMetrics = {
  completed: 75,
  failed: 10,
  pending: 15,
  total_calls: 100,
}

describe('StatusBreakdownChart', () => {
  it('renders title "Status Breakdown"', () => {
    render(<StatusBreakdownChart data={mockMetrics} />)
    expect(screen.getByText('Status Breakdown')).toBeInTheDocument()
  })

  it('renders with metrics data', () => {
    render(<StatusBreakdownChart data={mockMetrics} />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders card container', () => {
    const { container } = render(<StatusBreakdownChart data={mockMetrics} />)
    const card = container.querySelector('[data-slot="card"]')
    expect(card).toBeTruthy()
  })

  it('renders with null data gracefully', () => {
    render(<StatusBreakdownChart data={null} />)
    expect(screen.getByText('Status Breakdown')).toBeInTheDocument()
  })
})
