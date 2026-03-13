import { useState, useEffect } from 'react'
import { fetchCustomers, fetchAgents } from '../services/api'
import { useMetrics } from '../hooks/useMetrics'
import Header from './Header'
import ErrorBanner from './ErrorBanner'
import ConnectionStatus from './ConnectionStatus'
import styles from '../styles/Dashboard.module.css'

/**
 * Main dashboard container.
 *
 * Manages customer/agent selection, fetches list data, delegates metric
 * polling to useMetrics, and composes the page layout.
 */
function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [agents, setAgents] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [selectedAgentId, setSelectedAgentId] = useState(null)

  // Load customer list once on mount
  useEffect(() => {
    fetchCustomers()
      .then((res) => setCustomers(res.data))
      .catch(() => {
        // Customers list failure is non-fatal; ErrorBanner handles metrics errors
      })
  }, [])

  // Reload agents whenever the selected customer changes
  useEffect(() => {
    if (!selectedCustomerId) {
      setAgents([])
      setSelectedAgentId(null)
      return
    }
    fetchAgents(selectedCustomerId)
      .then((res) => setAgents(res.data))
      .catch(() => setAgents([]))
  }, [selectedCustomerId])

  const handleCustomerChange = (id) => {
    setSelectedCustomerId(id || null)
    setSelectedAgentId(null)
  }

  const handleAgentChange = (id) => {
    setSelectedAgentId(id || null)
  }

  const {
    isLoading,
    error,
    lastUpdate,
    connectionLost,
    consecutiveFailures,
  } = useMetrics(selectedCustomerId, selectedAgentId)

  return (
    <div className={styles.dashboard} id="dashboard">
      <Header
        customers={customers}
        agents={agents}
        selectedCustomerId={selectedCustomerId}
        selectedAgentId={selectedAgentId}
        onCustomerChange={handleCustomerChange}
        onAgentChange={handleAgentChange}
        lastUpdate={lastUpdate}
      />

      <ErrorBanner
        error={error}
        connectionLost={connectionLost}
        consecutiveFailures={consecutiveFailures}
      />

      {/* Placeholder: MetricsGrid */}
      <div className={styles.metricsGrid} aria-label="Metrics grid placeholder" />

      {/* Placeholder: ChartsSection */}
      <div className={styles.chartsSection} aria-label="Charts section placeholder" />

      {/* Placeholder: CallsTable */}
      <div className={styles.tableSection} aria-label="Calls table placeholder" />

      <ConnectionStatus
        lastUpdate={lastUpdate}
        isPolling={isLoading}
        connectionLost={connectionLost}
      />
    </div>
  )
}

export default Dashboard
