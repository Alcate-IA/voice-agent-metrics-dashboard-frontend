import MetricsCard from './MetricsCard'
import styles from '../styles/Dashboard.module.css'

/**
 * Format seconds into "X min Y sec" string.
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatDuration(totalSeconds) {
  const secs = Math.round(totalSeconds || 0)
  const min = Math.floor(secs / 60)
  const sec = secs % 60
  return `${min} min ${sec} sec`
}

/**
 * Format a number as a USD currency string "$X.XX".
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return `$${(amount || 0).toFixed(2)}`
}

/**
 * Calculate success rate as a percentage string "XX.X%".
 * @param {number} completed
 * @param {number} failed
 * @param {number} pending
 * @returns {string}
 */
function formatSuccessRate(completed, failed, pending) {
  const total = (completed || 0) + (failed || 0) + (pending || 0)
  if (total === 0) return '0.0%'
  return `${((completed / total) * 100).toFixed(1)}%`
}

/**
 * Grid container that renders all metric cards from a currentMetrics object.
 *
 * @param {{ metrics: object|null }} props
 */
function MetricsGrid({ metrics }) {
  if (!metrics) {
    return (
      <div className={styles.metricsGrid} aria-label="Metrics grid">
        <p style={{ color: '#6c757d', gridColumn: '1/-1' }}>No data available</p>
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Calls',
      value: String(metrics.total_calls ?? 0),
      icon: '📞',
    },
    {
      title: 'Calls Today',
      value: String(metrics.calls_today ?? 0),
      icon: '📅',
    },
    {
      title: 'Calls This Week',
      value: String(metrics.calls_this_week ?? 0),
      icon: '📊',
    },
    {
      title: 'Avg Duration',
      value: formatDuration(metrics.avg_duration),
      icon: '⏱️',
    },
    {
      title: 'Success Rate',
      value: formatSuccessRate(metrics.completed, metrics.failed, metrics.pending),
      icon: '✅',
    },
    {
      title: 'Total Cost',
      value: formatCurrency(metrics.total_cost),
      icon: '💰',
    },
    {
      title: 'Daily Spend',
      value: formatCurrency(metrics.daily_spend),
      icon: '💵',
    },
  ]

  return (
    <div className={styles.metricsGrid} aria-label="Metrics grid">
      {cards.map((card) => (
        <MetricsCard key={card.title} {...card} />
      ))}
    </div>
  )
}

export default MetricsGrid
