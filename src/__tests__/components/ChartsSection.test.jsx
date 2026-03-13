import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ChartsSection from '../../components/ChartsSection'

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

vi.mock('../../components/CallsOverTimeChart', () => ({
  default: ({ data }) => <div data-testid="calls-over-time-chart" data-count={data?.length} />,
}))

vi.mock('../../components/StatusBreakdownChart', () => ({
  default: ({ data }) => <div data-testid="status-breakdown-chart" data-has-data={!!data} />,
}))

vi.mock('../../components/CostsTrendChart', () => ({
  default: ({ data }) => <div data-testid="costs-trend-chart" data-count={data?.length} />,
}))

const mockHistoricalData = [
  { timestamp: '2024-01-01T00:00:00Z', total_calls: 10, total_cost: 5.25, completed: 8, failed: 1, pending: 1 },
  { timestamp: '2024-01-02T00:00:00Z', total_calls: 20, total_cost: 8.50, completed: 16, failed: 2, pending: 2 },
]

const mockCurrentMetrics = {
  completed: 75,
  failed: 10,
  pending: 15,
  total_calls: 100,
}

describe('ChartsSection', () => {
  it('renders "No chart data" when historicalData is null', () => {
    render(<ChartsSection historicalData={null} currentMetrics={mockCurrentMetrics} />)
    expect(screen.getByText(/No chart data/i)).toBeInTheDocument()
  })

  it('renders "No chart data" when historicalData is empty array', () => {
    render(<ChartsSection historicalData={[]} currentMetrics={mockCurrentMetrics} />)
    expect(screen.getByText(/No chart data/i)).toBeInTheDocument()
  })

  it('renders all 3 chart components when data is provided', () => {
    render(<ChartsSection historicalData={mockHistoricalData} currentMetrics={mockCurrentMetrics} />)
    expect(screen.getByTestId('calls-over-time-chart')).toBeInTheDocument()
    expect(screen.getByTestId('status-breakdown-chart')).toBeInTheDocument()
    expect(screen.getByTestId('costs-trend-chart')).toBeInTheDocument()
  })

  it('passes historicalData to CallsOverTimeChart', () => {
    render(<ChartsSection historicalData={mockHistoricalData} currentMetrics={mockCurrentMetrics} />)
    const chart = screen.getByTestId('calls-over-time-chart')
    expect(chart).toHaveAttribute('data-count', String(mockHistoricalData.length))
  })

  it('passes currentMetrics to StatusBreakdownChart', () => {
    render(<ChartsSection historicalData={mockHistoricalData} currentMetrics={mockCurrentMetrics} />)
    const chart = screen.getByTestId('status-breakdown-chart')
    expect(chart).toHaveAttribute('data-has-data', 'true')
  })

  it('passes historicalData to CostsTrendChart', () => {
    render(<ChartsSection historicalData={mockHistoricalData} currentMetrics={mockCurrentMetrics} />)
    const chart = screen.getByTestId('costs-trend-chart')
    expect(chart).toHaveAttribute('data-count', String(mockHistoricalData.length))
  })

  it('renders grid container', () => {
    const { container } = render(
      <ChartsSection historicalData={mockHistoricalData} currentMetrics={mockCurrentMetrics} />
    )
    const grid = container.querySelector('[class*="chartsGrid"]')
    expect(grid).toBeTruthy()
  })
})
