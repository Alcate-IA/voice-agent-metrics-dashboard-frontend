import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ConnectionStatus from '../../components/ConnectionStatus'

describe('ConnectionStatus', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ConnectionStatus lastUpdate={null} isPolling={false} connectionLost={false} />
    )
    expect(container).toBeTruthy()
  })

  it('displays last update time when provided', () => {
    const lastUpdate = new Date('2026-03-13T10:00:00Z')
    const { container } = render(
      <ConnectionStatus lastUpdate={lastUpdate} isPolling={false} connectionLost={false} />
    )
    // Shows formatted time string somewhere in the component
    expect(container.textContent).toMatch(/\d+:\d+/)
  })

  it('shows countdown seconds when not polling', () => {
    render(
      <ConnectionStatus lastUpdate={new Date()} isPolling={false} connectionLost={false} />
    )
    // Shows countdown like "30s"
    expect(screen.getByText(/\d+s/)).toBeInTheDocument()
  })

  it('shows polling indicator when isPolling is true', () => {
    render(
      <ConnectionStatus lastUpdate={null} isPolling={true} connectionLost={false} />
    )
    expect(screen.getByText(/polling/i)).toBeInTheDocument()
  })

  it('shows "Connection lost" when connectionLost is true', () => {
    render(
      <ConnectionStatus lastUpdate={null} isPolling={false} connectionLost={true} consecutiveFailures={3} />
    )
    expect(screen.getByText(/connection lost/i)).toBeInTheDocument()
  })

  it('shows failure count when connection is lost', () => {
    render(
      <ConnectionStatus lastUpdate={null} isPolling={false} connectionLost={true} consecutiveFailures={5} />
    )
    expect(screen.getByText(/5 failures/i)).toBeInTheDocument()
  })
})
