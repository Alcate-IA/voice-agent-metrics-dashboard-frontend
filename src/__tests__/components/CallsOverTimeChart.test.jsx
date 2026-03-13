import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CallsOverTimeChart from '../../components/CallsOverTimeChart'

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
  { timestamp: '2024-01-01T00:00:00Z', total_calls: 10 },
  { timestamp: '2024-01-02T00:00:00Z', total_calls: 20 },
  { timestamp: '2024-01-03T00:00:00Z', total_calls: 15 },
]

describe('CallsOverTimeChart', () => {
  it('renders title "Calls Over Time"', () => {
    render(<CallsOverTimeChart data={mockData} />)
    expect(screen.getByText('Calls Over Time')).toBeInTheDocument()
  })

  it('renders with data array', () => {
    render(<CallsOverTimeChart data={mockData} />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('renders with empty data array', () => {
    render(<CallsOverTimeChart data={[]} />)
    expect(screen.getByText('Calls Over Time')).toBeInTheDocument()
  })

  it('renders card container', () => {
    const { container } = render(<CallsOverTimeChart data={mockData} />)
    const card = container.querySelector('[data-slot="card"]')
    expect(card).toBeTruthy()
  })
})
