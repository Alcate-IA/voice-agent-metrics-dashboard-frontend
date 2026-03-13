import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ErrorBanner from '../../components/ErrorBanner'

describe('ErrorBanner', () => {
  it('renders nothing when no error and no connectionLost', () => {
    const { container } = render(
      <ErrorBanner error={null} connectionLost={false} consecutiveFailures={0} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows error message when error is provided', () => {
    const error = new Error('Network request failed')
    render(
      <ErrorBanner error={error} connectionLost={false} consecutiveFailures={1} />
    )
    expect(screen.getByText(/Network request failed/i)).toBeInTheDocument()
  })

  it('shows error string message', () => {
    const error = { message: 'API unavailable' }
    render(
      <ErrorBanner error={error} connectionLost={false} consecutiveFailures={1} />
    )
    expect(screen.getByText(/API unavailable/i)).toBeInTheDocument()
  })

  it('shows connection lost message when connectionLost is true', () => {
    render(
      <ErrorBanner error={null} connectionLost={true} consecutiveFailures={3} />
    )
    expect(screen.getByText(/Connection lost/i)).toBeInTheDocument()
  })

  it('shows consecutive failures count', () => {
    const error = new Error('Timeout')
    render(
      <ErrorBanner error={error} connectionLost={true} consecutiveFailures={5} />
    )
    expect(screen.getByText(/5/)).toBeInTheDocument()
  })

  it('renders nothing when error is null and connectionLost is false', () => {
    const { container } = render(
      <ErrorBanner error={null} connectionLost={false} consecutiveFailures={2} />
    )
    expect(container.firstChild).toBeNull()
  })
})
