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

function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [agents, setAgents] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [selectedAgentId, setSelectedAgentId] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSort, setCurrentSort] = useState('timestamp')
  const [days, setDays] = useState(30)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchCustomers()
      .then((res) => setCustomers(res.data))
      .catch(() => {})
  }, [])

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
    <div className="min-h-screen bg-background noise-bg relative" id="dashboard">
      {/* Top accent gradient line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500 z-50 opacity-80" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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

        <ChartsSection
          historicalData={historicalMetrics?.content}
          currentMetrics={currentMetrics}
        />

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

        <ConnectionStatus
          lastUpdate={lastUpdate}
          isPolling={isLoading}
          connectionLost={connectionLost}
          consecutiveFailures={consecutiveFailures}
        />
      </div>
    </div>
  )
}

export default Dashboard
