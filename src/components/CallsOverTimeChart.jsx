import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CHART_THEME = {
  grid: 'rgba(255,255,255,0.04)',
  axis: 'rgba(255,255,255,0.3)',
  cyan: '#22d3ee',
  tooltipBg: 'rgba(10,10,20,0.95)',
  tooltipBorder: 'rgba(255,255,255,0.1)',
}

function CallsOverTimeChart({ data = [] }) {
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
          Calls Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={formatted} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
              itemStyle={{ color: CHART_THEME.cyan }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="total_calls"
              stroke={CHART_THEME.cyan}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: CHART_THEME.cyan, strokeWidth: 0 }}
              name="Total Calls"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default CallsOverTimeChart
