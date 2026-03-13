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
    render(
      <ConnectionStatus lastUpdate={lastUpdate} isPolling={false} connectionLost={false} />
    )
    // Should show some time-related content
    expect(screen.getByText(/last update/i)).toBeInTheDocument()
  })

  it('shows "Never" or similar when lastUpdate is null', () => {
    render(
      <ConnectionStatus lastUpdate={null} isPolling={false} connectionLost={false} />
    )
    expect(screen.getByText(/never/i)).toBeInTheDocument()
  })

  it('shows polling indicator when isPolling is true', () => {
    render(
      <ConnectionStatus lastUpdate={null} isPolling={true} connectionLost={false} />
    )
    expect(screen.getByText(/polling/i)).toBeInTheDocument()
  })

  it('shows "Connection lost" when connectionLost is true', () => {
    render(
      <ConnectionStatus lastUpdate={null} isPolling={false} connectionLost={true} />
    )
    expect(screen.getByText(/connection lost/i)).toBeInTheDocument()
  })

  it('shows next refresh countdown text', () => {
    render(
      <ConnectionStatus lastUpdate={new Date()} isPolling={false} connectionLost={false} />
    )
    expect(screen.getByText(/next refresh/i)).toBeInTheDocument()
  })
})
