import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CostsTrendChart from '../../components/CostsTrendChart'

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

const mockData = [
  { timestamp: '2024-01-01T00:00:00Z', total_cost: 5.25 },
  { timestamp: '2024-01-02T00:00:00Z', total_cost: 8.50 },
  { timestamp: '2024-01-03T00:00:00Z', total_cost: 6.75 },
]

describe('CostsTrendChart', () => {
  it('renders title "Cost Trend"', () => {
    render(<CostsTrendChart data={mockData} />)
    expect(screen.getByText('Cost Trend')).toBeInTheDocument()
  })

  it('renders with data array', () => {
    render(<CostsTrendChart data={mockData} />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders with empty data array', () => {
    render(<CostsTrendChart data={[]} />)
    expect(screen.getByText('Cost Trend')).toBeInTheDocument()
  })

  it('renders card container', () => {
    const { container } = render(<CostsTrendChart data={mockData} />)
    const card = container.querySelector('[class*="chartCard"]')
    expect(card).toBeTruthy()
  })
})
