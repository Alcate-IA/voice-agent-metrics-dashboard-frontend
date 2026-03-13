import { useRef, useEffect, useState } from 'react'
import styles from '../styles/MetricsCard.module.css'

/**
 * Reusable metric card component.
 *
 * When `value` changes, briefly applies a `.updated` CSS class to produce a
 * background-pulse animation that signals the data was refreshed.
 *
 * @param {{ title: string, value: string|number, subtitle?: string, icon?: string, trend?: 'up'|'down'|'neutral', color?: string }} props
 */
function MetricsCard({ title, value, subtitle, icon, trend, color }) {
  const previousValueRef = useRef(value)
  const [isUpdated, setIsUpdated] = useState(false)

  useEffect(() => {
    if (previousValueRef.current !== value) {
      previousValueRef.current = value
      setIsUpdated(true)
      const timer = setTimeout(() => setIsUpdated(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [value])

  const cardClass = [styles.card, isUpdated ? styles.updated : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cardClass}
      style={color ? { borderTop: `3px solid ${color}` } : undefined}
    >
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
