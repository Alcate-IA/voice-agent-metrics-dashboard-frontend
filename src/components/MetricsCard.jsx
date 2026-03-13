import styles from '../styles/MetricsCard.module.css'

/**
 * Reusable metric card component.
 *
 * @param {{ title: string, value: string|number, subtitle?: string, icon?: string, trend?: 'up'|'down'|'neutral', color?: string }} props
 */
function MetricsCard({ title, value, subtitle, icon, trend, color }) {
  return (
    <div className={styles.card} style={color ? { borderTop: `3px solid ${color}` } : undefined}>
      <div className={styles.header}>
        <p className={styles.title}>{title}</p>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>

      <p className={styles.value}>{value}</p>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      {trend && (
        <span className={`${styles.trend} ${styles[trend]}`}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
        </span>
      )}
    </div>
  )
}

export default MetricsCard
