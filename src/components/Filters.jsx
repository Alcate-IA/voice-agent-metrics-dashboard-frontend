import styles from '../styles/Filters.module.css'

const PERIOD_OPTIONS = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 14 days', value: 14 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
]

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Pending', value: 'pending' },
]

/**
 * Filters — horizontal filter bar for period and call status.
 *
 * @param {object}   props
 * @param {number}   props.days                 - Currently selected days range
 * @param {function} props.onDaysChange         - Called with new numeric days value
 * @param {string}   props.statusFilter         - Currently selected status ('all'|'completed'|'failed'|'pending')
 * @param {function} props.onStatusFilterChange - Called with new status string
 */
function Filters({ days, onDaysChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className={styles.filtersBar}>
      <div className={styles.filterGroup}>
        <label htmlFor="period-select" className={styles.label}>
          Period
        </label>
        <select
          id="period-select"
          className={styles.select}
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
          aria-label="Period"
        >
          {PERIOD_OPTIONS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="status-select" className={styles.label}>
          Status
        </label>
        <select
          id="status-select"
          className={styles.select}
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          aria-label="Status"
        >
          {STATUS_OPTIONS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Filters
