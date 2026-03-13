import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import styles from '../styles/Charts.module.css'

const STATUS_COLORS = {
  Completed: '#4CAF50',
  Failed: '#f44336',
  Pending: '#ff9800',
}

/**
 * Donut chart showing completed/failed/pending call distribution.
 *
 * @param {{ data: { completed: number, failed: number, pending: number } | null }} props
 */
function StatusBreakdownChart({ data }) {
  const chartData = data
    ? [
        { name: 'Completed', value: data.completed ?? 0 },
        { name: 'Failed', value: data.failed ?? 0 },
        { name: 'Pending', value: data.pending ?? 0 },
      ]
    : []

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Call Status Breakdown</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatusBreakdownChart
