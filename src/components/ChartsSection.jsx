import CallsOverTimeChart from './CallsOverTimeChart'
import StatusBreakdownChart from './StatusBreakdownChart'
import CostsTrendChart from './CostsTrendChart'

function ChartsSection({ historicalData, currentMetrics }) {
  const hasData = historicalData && historicalData.length > 0

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <p className="text-muted-foreground col-span-full text-center py-12 text-sm">
          No chart data
        </p>
      </div>
    )
  }

  return (
    <div
      className="animate-fade-up grid grid-cols-1 lg:grid-cols-3 gap-4"
      style={{ animationDelay: '0.2s' }}
    >
      <CallsOverTimeChart data={historicalData} />
      <StatusBreakdownChart data={currentMetrics} />
      <CostsTrendChart data={historicalData} />
    </div>
  )
}

export default ChartsSection
