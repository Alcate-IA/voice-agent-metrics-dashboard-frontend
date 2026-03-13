import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
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

  it('renders period select trigger with aria-label', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByLabelText('Period')).toBeInTheDocument()
  })

  it('renders status select trigger with aria-label', () => {
    render(<Filters {...defaultProps} />)
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('renders two combobox triggers', () => {
    render(<Filters {...defaultProps} />)
    const triggers = screen.getAllByRole('combobox')
    expect(triggers.length).toBe(2)
  })

  it('period trigger has hidden input with correct value', () => {
    const { container } = render(<Filters {...defaultProps} days={30} />)
    const hiddenInputs = container.querySelectorAll('input[aria-hidden="true"]')
    const periodInput = Array.from(hiddenInputs).find(i => i.value === '30')
    expect(periodInput).toBeTruthy()
  })

  it('status trigger has hidden input with correct value', () => {
    const { container } = render(<Filters {...defaultProps} statusFilter="all" />)
    const hiddenInputs = container.querySelectorAll('input[aria-hidden="true"]')
    const statusInput = Array.from(hiddenInputs).find(i => i.value === 'all')
    expect(statusInput).toBeTruthy()
  })

  it('period trigger reflects days=7 value', () => {
    const { container } = render(<Filters {...defaultProps} days={7} />)
    const hiddenInputs = container.querySelectorAll('input[aria-hidden="true"]')
    const periodInput = Array.from(hiddenInputs).find(i => i.value === '7')
    expect(periodInput).toBeTruthy()
  })

  it('status trigger reflects completed value', () => {
    const { container } = render(<Filters {...defaultProps} statusFilter="completed" />)
    const hiddenInputs = container.querySelectorAll('input[aria-hidden="true"]')
    const statusInput = Array.from(hiddenInputs).find(i => i.value === 'completed')
    expect(statusInput).toBeTruthy()
  })

  it('status trigger reflects failed value', () => {
    const { container } = render(<Filters {...defaultProps} statusFilter="failed" />)
    const hiddenInputs = container.querySelectorAll('input[aria-hidden="true"]')
    const statusInput = Array.from(hiddenInputs).find(i => i.value === 'failed')
    expect(statusInput).toBeTruthy()
  })

  it('status trigger reflects pending value', () => {
    const { container } = render(<Filters {...defaultProps} statusFilter="pending" />)
    const hiddenInputs = container.querySelectorAll('input[aria-hidden="true"]')
    const statusInput = Array.from(hiddenInputs).find(i => i.value === 'pending')
    expect(statusInput).toBeTruthy()
  })

  it('opens period dropdown on click', async () => {
    const user = userEvent.setup()
    render(<Filters {...defaultProps} />)
    const periodTrigger = screen.getByLabelText('Period')
    await user.click(periodTrigger)
    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()
  })

  it('calls onDaysChange when period option selected', async () => {
    const onDaysChange = vi.fn()
    const user = userEvent.setup()
    render(<Filters {...defaultProps} onDaysChange={onDaysChange} />)
    const periodTrigger = screen.getByLabelText('Period')
    await user.click(periodTrigger)
    const option = screen.getByRole('option', { name: 'Last 7 days' })
    await user.click(option)
    expect(onDaysChange).toHaveBeenCalledWith(7)
  })

  it('calls onStatusFilterChange when status option selected', async () => {
    const onStatusFilterChange = vi.fn()
    const user = userEvent.setup()
    render(<Filters {...defaultProps} onStatusFilterChange={onStatusFilterChange} />)
    const statusTrigger = screen.getByLabelText('Status')
    await user.click(statusTrigger)
    const option = screen.getByRole('option', { name: 'Completed' })
    await user.click(option)
    expect(onStatusFilterChange).toHaveBeenCalled()
    expect(onStatusFilterChange.mock.calls[0][0]).toBe('completed')
  })
})
