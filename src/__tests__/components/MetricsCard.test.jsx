import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MetricsCard from '../../components/MetricsCard'

describe('MetricsCard', () => {
  it('renders title and value', () => {
    render(<MetricsCard title="Total Calls" value="42" />)
    expect(screen.getByText('Total Calls')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<MetricsCard title="Calls Today" value="10" subtitle="since midnight" />)
    expect(screen.getByText('since midnight')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    render(<MetricsCard title="Calls Today" value="10" />)
    expect(screen.queryByText('since midnight')).toBeNull()
  })

  it('renders icon when provided', () => {
    render(<MetricsCard title="Total Calls" value="42" icon="📞" />)
    expect(screen.getByText('📞')).toBeInTheDocument()
  })

  it('does not render icon element when not provided', () => {
    const { container } = render(<MetricsCard title="Total Calls" value="42" />)
    // No emoji should be present
    expect(container.textContent).not.toMatch(/📞/)
  })

  it('renders trend up indicator', () => {
    render(<MetricsCard title="Total Calls" value="42" trend="up" />)
    expect(screen.getByText('▲')).toBeInTheDocument()
  })

  it('renders trend down indicator', () => {
    render(<MetricsCard title="Total Calls" value="42" trend="down" />)
    expect(screen.getByText('▼')).toBeInTheDocument()
  })

  it('does not render trend element when trend is not provided', () => {
    render(<MetricsCard title="Total Calls" value="42" />)
    expect(screen.queryByText('▲')).toBeNull()
    expect(screen.queryByText('▼')).toBeNull()
    expect(screen.queryByText('—')).toBeNull()
  })

  it('renders card with shadcn card structure', () => {
    const { container } = render(<MetricsCard title="Total Calls" value="42" />)
    const card = container.querySelector('[data-slot="card"]')
    expect(card).toBeTruthy()
  })
})
