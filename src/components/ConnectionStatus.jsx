import { useState, useEffect } from 'react'
import styles from '../styles/Dashboard.module.css'

const POLL_INTERVAL_MS = 30000

/**
 * Shows polling indicator, last-update timestamp, and a countdown to the next
 * refresh.
 *
 * Props:
 *   lastUpdate     {Date|null}
 *   isPolling      {boolean}
 *   connectionLost {boolean}
 */
function ConnectionStatus({ lastUpdate, isPolling, connectionLost }) {
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(
    POLL_INTERVAL_MS / 1000
  )

  // Reset the countdown whenever lastUpdate changes (a poll just finished)
  useEffect(() => {
    setSecondsUntilRefresh(POLL_INTERVAL_MS / 1000)
    const id = setInterval(() => {
      setSecondsUntilRefresh((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [lastUpdate])

  const formattedLastUpdate = lastUpdate
    ? lastUpdate.toLocaleTimeString()
    : null

  return (
    <div className={styles.connectionStatus}>
      {connectionLost ? (
        <span className={styles.connectionLost}>Connection lost</span>
      ) : (
        <>
          <span className={styles.lastUpdateLabel}>
            Last update:{' '}
            <strong>{formattedLastUpdate ?? 'Never'}</strong>
          </span>

          {isPolling ? (
            <span className={styles.pollingIndicator}>Polling&hellip;</span>
          ) : (
            <span className={styles.nextRefresh}>
              Next refresh in <strong>{secondsUntilRefresh}s</strong>
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default ConnectionStatus
