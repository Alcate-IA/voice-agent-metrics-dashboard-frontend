import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MetricsGrid from '../../components/MetricsGrid'

const sampleMetrics = {
  total_calls: 500,
  calls_today: 20,
  calls_this_week: 130,
  avg_duration: 125, // 2 min 5 sec
  total_duration: 62500,
  completed: 450,
  failed: 30,
  pending: 20,
  voice_generation_time: 1.2,
  call_execution_time: 95.3,
  cost_per_call: 0.05,
  total_cost: 25.0,
  daily_spend: 1.5,
}

describe('MetricsGrid', () => {
  it('renders all 7 cards when metrics provided', () => {
    render(<MetricsGrid metrics={sampleMetrics} />)
    expect(screen.getByText('Total Calls')).toBeInTheDocument()
    expect(screen.getByText('Calls Today')).toBeInTheDocument()
    expect(screen.getByText('Calls This Week')).toBeInTheDocument()
    expect(screen.getByText('Avg Duration')).toBeInTheDocument()
    expect(screen.getByText('Success Rate')).toBeInTheDocument()
    expect(screen.getByText('Total Cost')).toBeInTheDocument()
    expect(screen.getByText('Daily Spend')).toBeInTheDocument()
  })

  it('shows "No data available" when metrics is null', () => {
    render(<MetricsGrid metrics={null} />)
    expect(screen.getByText(/No data available/i)).toBeInTheDocument()
  })

  it('shows "No data available" when metrics is undefined', () => {
    render(<MetricsGrid metrics={undefined} />)
    expect(screen.getByText(/No data available/i)).toBeInTheDocument()
  })

  it('formats avg_duration correctly (2 min 5 sec)', () => {
    render(<MetricsGrid metrics={sampleMetrics} />)
    expect(screen.getByText('2 min 5 sec')).toBeInTheDocument()
  })

  it('formats avg_duration correctly when under 1 minute (45 sec)', () => {
    render(<MetricsGrid metrics={{ ...sampleMetrics, avg_duration: 45 }} />)
    expect(screen.getByText('0 min 45 sec')).toBeInTheDocument()
  })

  it('formats total_cost correctly as currency', () => {
    render(<MetricsGrid metrics={sampleMetrics} />)
    expect(screen.getByText('$25.00')).toBeInTheDocument()
  })

  it('formats daily_spend correctly as currency', () => {
    render(<MetricsGrid metrics={sampleMetrics} />)
    expect(screen.getByText('$1.50')).toBeInTheDocument()
  })

  it('calculates success rate correctly', () => {
    // 450 / (450 + 30 + 20) * 100 = 90.0%
    render(<MetricsGrid metrics={sampleMetrics} />)
    expect(screen.getByText('90.0%')).toBeInTheDocument()
  })

  it('calculates success rate of 0% when all failed or pending', () => {
    render(<MetricsGrid metrics={{ ...sampleMetrics, completed: 0, failed: 10, pending: 0 }} />)
    expect(screen.getByText('0.0%')).toBeInTheDocument()
  })

  it('shows 0.0% success rate when all counts are zero', () => {
    render(<MetricsGrid metrics={{ ...sampleMetrics, completed: 0, failed: 0, pending: 0 }} />)
    expect(screen.getByText('0.0%')).toBeInTheDocument()
  })

  it('renders total_calls value', () => {
    render(<MetricsGrid metrics={sampleMetrics} />)
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('renders calls_today value', () => {
    render(<MetricsGrid metrics={sampleMetrics} />)
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('renders calls_this_week value', () => {
    render(<MetricsGrid metrics={sampleMetrics} />)
    expect(screen.getByText('130')).toBeInTheDocument()
  })
})
