import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STATUS_COLORS = {
  Completed: '#34d399',
  Failed: '#fb7185',
  Pending: '#fbbf24',
}

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(10,10,20,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '12px',
  fontFamily: 'var(--font-mono)',
}

function StatusBreakdownChart({ data }) {
  const chartData = data
    ? [
        { name: 'Completed', value: data.completed ?? 0 },
        { name: 'Failed', value: data.failed ?? 0 },
        { name: 'Pending', value: data.pending ?? 0 },
      ]
    : []

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-sans)' }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default StatusBreakdownChart
