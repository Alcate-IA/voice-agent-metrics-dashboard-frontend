import { useRef, useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const ACCENT_COLORS = {
  cyan: 'border-l-cyan-500 glow-cyan',
  emerald: 'border-l-emerald-500 glow-emerald',
  rose: 'border-l-rose-500 glow-rose',
  amber: 'border-l-amber-500 glow-amber',
  violet: 'border-l-violet-500',
  default: 'border-l-border',
}

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

  const accentClass = ACCENT_COLORS[color] || ACCENT_COLORS.default

  return (
    <Card
      className={cn(
        'border-l-[3px] bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300',
        accentClass,
        isUpdated && 'animate-pulse-value'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          {icon && <span className="text-lg opacity-60">{icon}</span>}
        </div>

        <p className="text-2xl font-bold font-mono tabular-nums tracking-tight text-foreground">
          {value}
        </p>

        <div className="flex items-center justify-between mt-1.5">
          {subtitle && (
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <span
              className={cn(
                'text-xs font-semibold',
                trend === 'up' && 'text-emerald-400',
                trend === 'down' && 'text-rose-400',
                trend === 'neutral' && 'text-muted-foreground'
              )}
            >
              {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricsCard
