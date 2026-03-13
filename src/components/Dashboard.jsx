import { useState, useEffect } from 'react'
import { fetchCustomers, fetchAgents } from '../services/api'
import { useMetrics } from '../hooks/useMetrics'
import Header from './Header'
import ErrorBanner from './ErrorBanner'
import ConnectionStatus from './ConnectionStatus'
import MetricsGrid from './MetricsGrid'
import ChartsSection from './ChartsSection'
import CallsTable from './CallsTable'
import Filters from './Filters'
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
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSort, setCurrentSort] = useState('timestamp')
  const [days, setDays] = useState(30)
  const [statusFilter, setStatusFilter] = useState('all')

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
    currentMetrics,
    historicalMetrics,
    isLoading,
    error,
    lastUpdate,
    connectionLost,
    consecutiveFailures,
    fetchHistory,
  } = useMetrics(selectedCustomerId, selectedAgentId)

  // Fetch historical data on mount and whenever customer/agent selection changes
  useEffect(() => {
    fetchHistory({ days })
  }, [fetchHistory])

  const handleDaysChange = (newDays) => {
    setDays(newDays)
    setCurrentPage(0)
    fetchHistory({ days: newDays, page: 0, sortBy: currentSort })
  }

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus)
  }

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

      <Filters
        days={days}
        onDaysChange={handleDaysChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <MetricsGrid metrics={currentMetrics} />

      <div className={styles.chartsSection}>
        <ChartsSection
          historicalData={historicalMetrics?.content}
          currentMetrics={currentMetrics}
        />
      </div>

      <div className={styles.tableSection}>
        <CallsTable
          data={historicalMetrics?.content}
          totalElements={historicalMetrics?.total_elements}
          page={historicalMetrics?.page ?? currentPage}
          size={historicalMetrics?.size}
          totalPages={historicalMetrics?.total_pages ?? 1}
          onPageChange={(newPage) => {
            setCurrentPage(newPage)
            fetchHistory({ page: newPage, sortBy: currentSort })
          }}
          onSortChange={(field) => {
            setCurrentSort(field)
            setCurrentPage(0)
            fetchHistory({ page: 0, sortBy: field })
          }}
          currentSort={currentSort}
        />
      </div>

      <ConnectionStatus
        lastUpdate={lastUpdate}
        isPolling={isLoading}
        connectionLost={connectionLost}
        consecutiveFailures={consecutiveFailures}
      />
    </div>
  )
}

export default Dashboard
