import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Activity } from 'lucide-react'

function Header({
  customers = [],
  agents = [],
  selectedCustomerId,
  selectedAgentId,
  onCustomerChange,
  onAgentChange,
  lastUpdate,
}) {
  return (
    <header className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <Activity className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Voice Agent Metrics
          </h1>
          <p className="text-[11px] text-muted-foreground font-semibold tracking-widest uppercase">
            Real-time monitoring
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={selectedCustomerId ? String(selectedCustomerId) : undefined}
          onValueChange={onCustomerChange}
        >
          <SelectTrigger
            className="w-[200px] bg-card border-border hover:border-cyan-500/30 transition-colors"
            aria-label="Select customer"
          >
            <SelectValue placeholder="All customers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All customers</SelectItem>
            {customers.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedAgentId ? String(selectedAgentId) : undefined}
          onValueChange={onAgentChange}
          disabled={!selectedCustomerId}
        >
          <SelectTrigger
            className="w-[200px] bg-card border-border hover:border-cyan-500/30 transition-colors disabled:opacity-40"
            aria-label="Select agent"
          >
            <SelectValue placeholder="All agents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All agents</SelectItem>
            {agents.map((a) => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {lastUpdate && (
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>
    </header>
  )
}

export default Header
