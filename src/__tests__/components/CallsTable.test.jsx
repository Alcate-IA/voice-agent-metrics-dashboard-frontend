import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CallsTable from '../../components/CallsTable'

const mockData = [
  {
    timestamp: '2024-03-15T14:30:00Z',
    total_calls: 42,
    avg_duration: 12.5,
    total_duration: 525,
    completed: 38,
    failed: 3,
    pending: 1,
    voice_generation_time: 1.1,
    call_execution_time: 11.4,
    cost_per_call: 0.012,
    total_cost: 0.504,
    daily_spend: 5.2,
  },
  {
    timestamp: '2024-03-14T09:00:00Z',
    total_calls: 100,
    avg_duration: 8.3,
    total_duration: 830,
    completed: 90,
    failed: 8,
    pending: 2,
    voice_generation_time: 0.9,
    call_execution_time: 7.4,
    cost_per_call: 0.0085,
    total_cost: 0.85,
    daily_spend: 9.1,
  },
]

const defaultProps = {
  data: mockData,
  totalElements: 2,
  page: 0,
  size: 10,
  totalPages: 1,
  onPageChange: vi.fn(),
  onSortChange: vi.fn(),
  currentSort: 'timestamp',
}

describe('CallsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "No data available" when data is null', () => {
    render(<CallsTable {...defaultProps} data={null} />)
    expect(screen.getByText(/No data available/i)).toBeInTheDocument()
  })

  it('renders "No data available" when data is empty array', () => {
    render(<CallsTable {...defaultProps} data={[]} />)
    expect(screen.getByText(/No data available/i)).toBeInTheDocument()
  })

  it('renders table with correct 7 column headers', () => {
    render(<CallsTable {...defaultProps} />)
    const headers = screen.getAllByRole('columnheader')
    const headerTexts = headers.map(h => h.textContent.replace(/[▲▼]/g, '').trim())
    expect(headerTexts).toContain('Date/Time')
    expect(headerTexts).toContain('Total Calls')
    expect(headerTexts).toContain('Duration (avg)')
    expect(headerTexts).toContain('Completed')
    expect(headerTexts).toContain('Failed')
    expect(headerTexts).toContain('Pending')
    expect(headerTexts).toContain('Cost')
    expect(headers.length).toBe(7)
  })

  it('renders data rows', () => {
    render(<CallsTable {...defaultProps} />)
    const rows = screen.getAllByRole('row')
    // header row + 2 data rows
    expect(rows.length).toBe(3)
  })

  it('formats timestamp correctly as "YYYY-MM-DD HH:mm"', () => {
    render(<CallsTable {...defaultProps} />)
    expect(screen.getByText('2024-03-15 14:30')).toBeInTheDocument()
    expect(screen.getByText('2024-03-14 09:00')).toBeInTheDocument()
  })

  it('formats avg_duration with "s" suffix', () => {
    render(<CallsTable {...defaultProps} />)
    expect(screen.getByText('12.5s')).toBeInTheDocument()
    expect(screen.getByText('8.3s')).toBeInTheDocument()
  })

  it('formats total_cost with "$" prefix and 4 decimal places', () => {
    render(<CallsTable {...defaultProps} />)
    expect(screen.getByText('$0.5040')).toBeInTheDocument()
    expect(screen.getByText('$0.8500')).toBeInTheDocument()
  })

  it('renders total_calls values', () => {
    render(<CallsTable {...defaultProps} />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders completed, failed, pending counts', () => {
    render(<CallsTable {...defaultProps} />)
    expect(screen.getByText('38')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows sort indicator (▲ or ▼) on active sort column', () => {
    render(<CallsTable {...defaultProps} currentSort="timestamp" />)
    const dateHeader = screen.getAllByRole('columnheader').find(h =>
      h.textContent.replace(/[▲▼]/g, '').trim() === 'Date/Time'
    )
    expect(dateHeader.textContent).toMatch(/[▲▼]/)
  })

  it('does not show sort indicator on inactive columns', () => {
    render(<CallsTable {...defaultProps} currentSort="timestamp" />)
    const totalCallsHeader = screen.getAllByRole('columnheader').find(h =>
      h.textContent.replace(/[▲▼]/g, '').trim() === 'Total Calls'
    )
    expect(totalCallsHeader.textContent).not.toMatch(/[▲▼]/)
  })

  it('calls onSortChange with field name when column header clicked', () => {
    const onSortChange = vi.fn()
    render(<CallsTable {...defaultProps} onSortChange={onSortChange} />)
    const totalCallsHeader = screen.getAllByRole('columnheader').find(h =>
      h.textContent.replace(/[▲▼]/g, '').trim() === 'Total Calls'
    )
    fireEvent.click(totalCallsHeader)
    expect(onSortChange).toHaveBeenCalledWith('total_calls')
  })

  it('calls onSortChange with "timestamp" when Date/Time header clicked', () => {
    const onSortChange = vi.fn()
    render(<CallsTable {...defaultProps} onSortChange={onSortChange} />)
    const dateHeader = screen.getAllByRole('columnheader').find(h =>
      h.textContent.replace(/[▲▼]/g, '').trim() === 'Date/Time'
    )
    fireEvent.click(dateHeader)
    expect(onSortChange).toHaveBeenCalledWith('timestamp')
  })

  it('calls onSortChange with correct field for each sortable column', () => {
    const onSortChange = vi.fn()
    render(<CallsTable {...defaultProps} onSortChange={onSortChange} />)
    const headers = screen.getAllByRole('columnheader')

    const completedHeader = headers.find(h => h.textContent.replace(/[▲▼]/g, '').trim() === 'Completed')
    fireEvent.click(completedHeader)
    expect(onSortChange).toHaveBeenCalledWith('completed')

    const failedHeader = headers.find(h => h.textContent.replace(/[▲▼]/g, '').trim() === 'Failed')
    fireEvent.click(failedHeader)
    expect(onSortChange).toHaveBeenCalledWith('failed')

    const costHeader = headers.find(h => h.textContent.replace(/[▲▼]/g, '').trim() === 'Cost')
    fireEvent.click(costHeader)
    expect(onSortChange).toHaveBeenCalledWith('total_cost')
  })

  it('shows pagination controls', () => {
    render(<CallsTable {...defaultProps} totalPages={3} page={1} />)
    expect(screen.getByText(/Previous/i)).toBeInTheDocument()
    expect(screen.getByText(/Next/i)).toBeInTheDocument()
    expect(screen.getByText(/Page 2 of 3/i)).toBeInTheDocument()
  })

  it('disables "Previous" button on first page', () => {
    render(<CallsTable {...defaultProps} page={0} totalPages={3} />)
    const prevButton = screen.getByText(/Previous/i).closest('button') ||
      screen.getByRole('button', { name: /Previous/i })
    expect(prevButton).toBeDisabled()
  })

  it('disables "Next" button on last page', () => {
    render(<CallsTable {...defaultProps} page={2} totalPages={3} />)
    const nextButton = screen.getByText(/Next/i).closest('button') ||
      screen.getByRole('button', { name: /Next/i })
    expect(nextButton).toBeDisabled()
  })

  it('enables both buttons on middle page', () => {
    render(<CallsTable {...defaultProps} page={1} totalPages={3} />)
    expect(screen.getByRole('button', { name: /Previous/i })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /Next/i })).not.toBeDisabled()
  })

  it('calls onPageChange with previous page when Previous clicked', () => {
    const onPageChange = vi.fn()
    render(<CallsTable {...defaultProps} page={2} totalPages={3} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByRole('button', { name: /Previous/i }))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('calls onPageChange with next page when Next clicked', () => {
    const onPageChange = vi.fn()
    render(<CallsTable {...defaultProps} page={1} totalPages={3} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('shows "Page 1 of 1" when single page', () => {
    render(<CallsTable {...defaultProps} page={0} totalPages={1} />)
    expect(screen.getByText(/Page 1 of 1/i)).toBeInTheDocument()
  })
})
