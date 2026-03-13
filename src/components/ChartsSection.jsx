import CallsOverTimeChart from './CallsOverTimeChart'
import StatusBreakdownChart from './StatusBreakdownChart'
import CostsTrendChart from './CostsTrendChart'
import styles from '../styles/Charts.module.css'

/**
 * Container for all dashboard charts.
 *
 * @param {{
 *   historicalData: Array<object> | null | undefined,
 *   currentMetrics: object | null
 * }} props
 */
function ChartsSection({ historicalData, currentMetrics }) {
  const hasData = historicalData && historicalData.length > 0

  if (!hasData) {
    return (
      <div className={styles.chartsGrid}>
        <p className={styles.noData}>No chart data</p>
      </div>
    )
  }

  return (
    <div className={styles.chartsGrid}>
      <CallsOverTimeChart data={historicalData} />
      <StatusBreakdownChart data={currentMetrics} />
      <CostsTrendChart data={historicalData} />
    </div>
  )
}

export default ChartsSection
