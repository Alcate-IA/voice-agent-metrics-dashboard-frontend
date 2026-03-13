import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Filters from '../../components/Filters'

const defaultProps = {
  days: 30,
  onDaysChange: vi.fn(),
  statusFilter: 'all',
  onStatusFilterChange: vi.fn(),
}

describe('Filters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(<Filters {...defaultProps} />)
    expect(container).toBeTruthy()
  })

  it('renders the period filter label', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/period/i)).toBeInTheDocument()
  })

  it('renders the status filter label', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/status/i)).toBeInTheDocument()
  })

  it('renders period options: Last 7 days', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/last 7 days/i)).toBeInTheDocument()
  })

  it('renders period options: Last 14 days', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/last 14 days/i)).toBeInTheDocument()
  })

  it('renders period options: Last 30 days', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/last 30 days/i)).toBeInTheDocument()
  })

  it('renders period options: Last 90 days', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/last 90 days/i)).toBeInTheDocument()
  })

  it('renders status options: All', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/^all$/i)).toBeInTheDocument()
  })

  it('renders status options: Completed', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/^completed$/i)).toBeInTheDocument()
  })

  it('renders status options: Failed', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/^failed$/i)).toBeInTheDocument()
  })

  it('renders status options: Pending', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByText(/^pending$/i)).toBeInTheDocument()
  })

  it('calls onDaysChange with numeric value when period select changes', () => {
    const onDaysChange = vi.fn()
    render(<Filters {...defaultProps} onDaysChange={onDaysChange} />)
    const periodSelect = screen.getByLabelText(/period/i)
    fireEvent.change(periodSelect, { target: { value: '7' } })
    expect(onDaysChange).toHaveBeenCalledWith(7)
  })

  it('calls onDaysChange with 14 when selecting Last 14 days', () => {
    const onDaysChange = vi.fn()
    render(<Filters {...defaultProps} onDaysChange={onDaysChange} />)
    const periodSelect = screen.getByLabelText(/period/i)
    fireEvent.change(periodSelect, { target: { value: '14' } })
    expect(onDaysChange).toHaveBeenCalledWith(14)
  })

  it('calls onDaysChange with 90 when selecting Last 90 days', () => {
    const onDaysChange = vi.fn()
    render(<Filters {...defaultProps} onDaysChange={onDaysChange} />)
    const periodSelect = screen.getByLabelText(/period/i)
    fireEvent.change(periodSelect, { target: { value: '90' } })
    expect(onDaysChange).toHaveBeenCalledWith(90)
  })

  it('calls onStatusFilterChange when status select changes', () => {
    const onStatusFilterChange = vi.fn()
    render(<Filters {...defaultProps} onStatusFilterChange={onStatusFilterChange} />)
    const statusSelect = screen.getByLabelText(/status/i)
    fireEvent.change(statusSelect, { target: { value: 'completed' } })
    expect(onStatusFilterChange).toHaveBeenCalledWith('completed')
  })

  it('calls onStatusFilterChange with "failed" when selecting Failed', () => {
    const onStatusFilterChange = vi.fn()
    render(<Filters {...defaultProps} onStatusFilterChange={onStatusFilterChange} />)
    const statusSelect = screen.getByLabelText(/status/i)
    fireEvent.change(statusSelect, { target: { value: 'failed' } })
    expect(onStatusFilterChange).toHaveBeenCalledWith('failed')
  })

  it('calls onStatusFilterChange with "pending" when selecting Pending', () => {
    const onStatusFilterChange = vi.fn()
    render(<Filters {...defaultProps} onStatusFilterChange={onStatusFilterChange} />)
    const statusSelect = screen.getByLabelText(/status/i)
    fireEvent.change(statusSelect, { target: { value: 'pending' } })
    expect(onStatusFilterChange).toHaveBeenCalledWith('pending')
  })

  it('shows correct selected period value (days=30)', () => {
    render(<Filters {...defaultProps} days={30} />)
    const periodSelect = screen.getByLabelText(/period/i)
    expect(periodSelect.value).toBe('30')
  })

  it('shows correct selected period value (days=7)', () => {
    render(<Filters {...defaultProps} days={7} />)
    const periodSelect = screen.getByLabelText(/period/i)
    expect(periodSelect.value).toBe('7')
  })

  it('shows correct selected status value (statusFilter=all)', () => {
    render(<Filters {...defaultProps} statusFilter="all" />)
    const statusSelect = screen.getByLabelText(/status/i)
    expect(statusSelect.value).toBe('all')
  })

  it('shows correct selected status value (statusFilter=completed)', () => {
    render(<Filters {...defaultProps} statusFilter="completed" />)
    const statusSelect = screen.getByLabelText(/status/i)
    expect(statusSelect.value).toBe('completed')
  })
})
