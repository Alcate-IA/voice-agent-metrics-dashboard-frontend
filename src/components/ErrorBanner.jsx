import styles from '../styles/Dashboard.module.css'

/**
 * Displays API errors and connection-lost warnings.
 *
 * Props:
 *   error              {Error|{message:string}|null}
 *   connectionLost     {boolean}
 *   consecutiveFailures {number}
 */
function ErrorBanner({ error, connectionLost, consecutiveFailures }) {
  // Nothing to show
  if (!error && !connectionLost) return null

  const errorMessage = error?.message || null

  return (
    <div className={styles.errorBanner} role="alert" aria-live="assertive">
      {connectionLost && (
        <span className={styles.errorConnectionLost}>
          Connection lost — retrying&hellip;
        </span>
      )}
      {errorMessage && (
        <span className={styles.errorMessage}>
          {errorMessage}
        </span>
      )}
      {consecutiveFailures > 0 && (
        <span className={styles.errorCount}>
          ({consecutiveFailures} consecutive failure{consecutiveFailures !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  )
}

export default ErrorBanner
