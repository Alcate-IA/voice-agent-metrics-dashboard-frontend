import styles from '../styles/CallsTable.module.css'

/**
 * Formats a UTC ISO timestamp string to "YYYY-MM-DD HH:mm".
 * Uses UTC to ensure consistent output regardless of local timezone.
 */
function formatTimestamp(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const hours = String(d.getUTCHours()).padStart(2, '0')
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * Formats a numeric duration as "X.Xs".
 */
function formatDuration(val) {
  if (val == null) return ''
  return `${val}s`
}

/**
 * Formats a numeric cost as "$X.XXXX".
 */
function formatCost(val) {
  if (val == null) return ''
  return `$${Number(val).toFixed(4)}`
}

const COLUMNS = [
  { label: 'Date/Time', field: 'timestamp', format: formatTimestamp },
  { label: 'Total Calls', field: 'total_calls', format: (v) => v },
  { label: 'Duration (avg)', field: 'avg_duration', format: formatDuration },
  { label: 'Completed', field: 'completed', format: (v) => v },
  { label: 'Failed', field: 'failed', format: (v) => v },
  { label: 'Pending', field: 'pending', format: (v) => v },
  { label: 'Cost', field: 'total_cost', format: formatCost },
]

/**
 * CallsTable — displays historical metrics records with sortable columns
 * and pagination controls.
 *
 * @param {object} props
 * @param {Array}  props.data          - Array of record objects
 * @param {number} props.totalElements - Total number of records
 * @param {number} props.page          - Current zero-based page index
 * @param {number} props.size          - Page size
 * @param {number} props.totalPages    - Total page count
 * @param {function} props.onPageChange  - Called with new page index
 * @param {function} props.onSortChange  - Called with field name string
 * @param {string} props.currentSort   - Currently active sort field
 */
function CallsTable({
  data,
  totalElements,
  page,
  size,
  totalPages,
  onPageChange,
  onSortChange,
  currentSort,
}) {
  const isEmpty = !data || data.length === 0

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Recent Calls</h2>

      {isEmpty ? (
        <p className={styles.noData}>No data available</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map(({ label, field }) => {
                const isActive = currentSort === field
                return (
                  <th
                    key={field}
                    className={`${styles.th}${isActive ? ` ${styles.active}` : ''}`}
                    onClick={() => onSortChange && onSortChange(field)}
                    role="columnheader"
                    aria-sort={isActive ? 'ascending' : 'none'}
                  >
                    {label}
                    {isActive && ' ▲'}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={styles.tr}>
                {COLUMNS.map(({ field, format }) => (
                  <td key={field} className={styles.td}>
                    {format(row[field])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => onPageChange && onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Previous"
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          className={styles.pageButton}
          onClick={() => onPageChange && onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Next"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default CallsTable
