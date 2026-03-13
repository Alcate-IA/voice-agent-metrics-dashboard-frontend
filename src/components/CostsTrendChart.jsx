import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CHART_THEME = {
  grid: 'rgba(255,255,255,0.04)',
  axis: 'rgba(255,255,255,0.3)',
  emerald: '#34d399',
  emeraldFill: 'rgba(52,211,153,0.15)',
  tooltipBg: 'rgba(10,10,20,0.95)',
  tooltipBorder: 'rgba(255,255,255,0.1)',
}

function CostsTrendChart({ data = [] }) {
  const formatted = data.map((item) => ({
    ...item,
    date: new Date(item.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Cost Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_THEME.emerald} stopOpacity={0.25} />
                <stop offset="100%" stopColor={CHART_THEME.emerald} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: CHART_THEME.axis }}
              axisLine={{ stroke: CHART_THEME.grid }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: CHART_THEME.axis }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: CHART_THEME.tooltipBg,
                border: `1px solid ${CHART_THEME.tooltipBorder}`,
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
              itemStyle={{ color: CHART_THEME.emerald }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Total Cost']}
            />
            <Area
              type="monotone"
              dataKey="total_cost"
              stroke={CHART_THEME.emerald}
              strokeWidth={2}
              fill="url(#costGradient)"
              name="Total Cost"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default CostsTrendChart
