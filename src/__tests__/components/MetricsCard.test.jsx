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
    const { container } = render(<MetricsCard title="Calls Today" value="10" />)
    const subtitle = container.querySelector('[class*="subtitle"]')
    expect(subtitle).toBeNull()
  })

  it('renders icon when provided', () => {
    render(<MetricsCard title="Total Calls" value="42" icon="📞" />)
    expect(screen.getByText('📞')).toBeInTheDocument()
  })

  it('does not render icon element when not provided', () => {
    const { container } = render(<MetricsCard title="Total Calls" value="42" />)
    const icon = container.querySelector('[class*="icon"]')
    expect(icon).toBeNull()
  })

  it('applies trend up class when trend is up', () => {
    const { container } = render(
      <MetricsCard title="Total Calls" value="42" trend="up" />
    )
    const trendEl = container.querySelector('[class*="trend"]')
    expect(trendEl).toBeTruthy()
    expect(trendEl.className).toMatch(/up/)
  })

  it('applies trend down class when trend is down', () => {
    const { container } = render(
      <MetricsCard title="Total Calls" value="42" trend="down" />
    )
    const trendEl = container.querySelector('[class*="trend"]')
    expect(trendEl).toBeTruthy()
    expect(trendEl.className).toMatch(/down/)
  })

  it('does not render trend element when trend is not provided', () => {
    const { container } = render(<MetricsCard title="Total Calls" value="42" />)
    const trendEl = container.querySelector('[class*="trend"]')
    expect(trendEl).toBeNull()
  })

  it('renders card with class containing "card"', () => {
    const { container } = render(<MetricsCard title="Total Calls" value="42" />)
    const card = container.querySelector('[class*="card"]')
    expect(card).toBeTruthy()
  })
})
