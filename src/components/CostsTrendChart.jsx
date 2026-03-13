import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import styles from '../styles/Charts.module.css'

/**
 * Area chart showing total cost spending trend over time.
 *
 * @param {{ data: Array<{ timestamp: string, total_cost: number }> }} props
 */
function CostsTrendChart({ data = [] }) {
  const formatted = data.map((item) => ({
    ...item,
    date: new Date(item.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Cost Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Total Cost']} />
          <Area
            type="monotone"
            dataKey="total_cost"
            stroke="#4a6fa5"
            strokeWidth={2}
            fill="#4a6fa5"
            fillOpacity={0.2}
            name="Total Cost"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CostsTrendChart
