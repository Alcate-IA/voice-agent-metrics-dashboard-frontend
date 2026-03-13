import { useState, useEffect } from 'react'
import { fetchAgents } from '../services/api'
import { useMetrics } from '../hooks/useMetrics'
import Header from './Header'
import ErrorBanner from './ErrorBanner'
import ConnectionStatus from './ConnectionStatus'
import MetricsGrid from './MetricsGrid'
import ChartsSection from './ChartsSection'
import CallsTable from './CallsTable'
import Filters from './Filters'

function Dashboard() {
  const [agents, setAgents] = useState([])
  const [selectedAgentId, setSelectedAgentId] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSort, setCurrentSort] = useState('timestamp')
  const [days, setDays] = useState(30)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchAgents()
      .then((data) => {
        const list = data || []
        setAgents(list)
        if (list.length > 0) {
          setSelectedAgentId(String(list[0].id))
        }
      })
      .catch(() => setAgents([]))
  }, [])

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
  } = useMetrics(selectedAgentId)

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
    setCurrentPage(0)
  }

  const filteredContent = (() => {
    const content = historicalMetrics?.content
    if (!content || statusFilter === 'all') return content
    return content.filter((row) => (row[statusFilter] ?? 0) > 0)
  })()

  return (
    <div className="min-h-screen bg-background noise-bg relative" id="dashboard">
      {/* Top accent gradient line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500 z-50 opacity-80" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Header
          agents={agents}
          selectedAgentId={selectedAgentId}
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
          historicalData={filteredContent}
          currentMetrics={currentMetrics}
        />

        <CallsTable
          data={filteredContent}
          totalElements={filteredContent?.length ?? 0}
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
