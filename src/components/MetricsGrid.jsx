import MetricsCard from './MetricsCard'

function formatDuration(totalSeconds) {
  const secs = Math.round(totalSeconds || 0)
  const min = Math.floor(secs / 60)
  const sec = secs % 60
  return `${min} min ${sec} sec`
}

function formatCurrency(amount) {
  return `$${(amount || 0).toFixed(2)}`
}

function formatSuccessRate(completed, failed, pending) {
  const total = (completed || 0) + (failed || 0) + (pending || 0)
  if (total === 0) return '0.0%'
  return `${((completed / total) * 100).toFixed(1)}%`
}

function MetricsGrid({ metrics }) {
  if (!metrics) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4"
        aria-label="Metrics grid"
      >
        <p className="text-muted-foreground col-span-full text-center py-8 text-sm">
          No data available
        </p>
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Calls',
      value: String(metrics.total_calls ?? 0),
      icon: '📞',
      color: 'cyan',
    },
    {
      title: 'Calls Today',
      value: String(metrics.calls_today ?? 0),
      icon: '📅',
      color: 'cyan',
    },
    {
      title: 'Calls This Week',
      value: String(metrics.calls_this_week ?? 0),
      icon: '📊',
      color: 'cyan',
    },
    {
      title: 'Avg Duration',
      value: formatDuration(metrics.avg_duration),
      icon: '⏱️',
      color: 'amber',
    },
    {
      title: 'Success Rate',
      value: formatSuccessRate(metrics.completed, metrics.failed, metrics.pending),
      icon: '✅',
      color: 'emerald',
    },
    {
      title: 'Total Cost',
      value: formatCurrency(metrics.total_cost),
      icon: '💰',
      color: 'rose',
    },
    {
      title: 'Daily Spend',
      value: formatCurrency(metrics.daily_spend),
      icon: '💵',
      color: 'rose',
    },
  ]

  return (
    <div
      className="animate-fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4"
      style={{ animationDelay: '0.1s' }}
      aria-label="Metrics grid"
    >
      {cards.map((card, i) => (
        <div key={card.title} style={{ animationDelay: `${0.05 * i}s` }} className="animate-fade-up">
          <MetricsCard {...card} />
        </div>
      ))}
    </div>
  )
}

export default MetricsGrid
