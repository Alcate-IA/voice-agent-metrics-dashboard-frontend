import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import styles from '../styles/Charts.module.css'

/**
 * Line chart showing total calls over time.
 *
 * @param {{ data: Array<{ timestamp: string, total_calls: number }> }} props
 */
function CallsOverTimeChart({ data = [] }) {
  const formatted = data.map((item) => ({
    ...item,
    date: new Date(item.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Calls Over Time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total_calls"
            stroke="#4a6fa5"
            strokeWidth={2}
            dot={false}
            name="Total Calls"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CallsOverTimeChart
