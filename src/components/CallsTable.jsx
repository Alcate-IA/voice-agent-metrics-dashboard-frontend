import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatTimestamp(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const hours = String(d.getUTCHours()).padStart(2, '0')
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

function formatDuration(val) {
  if (val == null) return ''
  return `${val}s`
}

function formatCost(val) {
  if (val == null) return ''
  return `$${Number(val).toFixed(4)}`
}

const COLUMNS = [
  { label: 'Date/Time', field: 'timestamp', format: formatTimestamp },
  { label: 'Total Calls', field: 'total_calls', format: (v) => v },
  { label: 'Duration (avg)', field: 'avg_duration', format: formatDuration },
  { label: 'Completed', field: 'completed', format: (v) => v },
  { label: 'Failed', field: 'failed', format: (v) => v },
  { label: 'Pending', field: 'pending', format: (v) => v },
  { label: 'Cost', field: 'total_cost', format: formatCost },
]

function CallsTable({
  data,
  totalElements,
  page,
  size,
  totalPages,
  onPageChange,
  onSortChange,
  currentSort,
}) {
  const isEmpty = !data || data.length === 0

  return (
    <Card
      className="animate-fade-up bg-card/50 backdrop-blur-sm"
      style={{ animationDelay: '0.3s' }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Calls
          </CardTitle>
          {totalElements > 0 && (
            <Badge variant="secondary" className="font-mono text-xs">
              {totalElements} records
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isEmpty ? (
          <p className="text-muted-foreground text-center py-12 text-sm">
            No data available
          </p>
        ) : (
          <>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    {COLUMNS.map(({ label, field }) => {
                      const isActive = currentSort === field
                      return (
                        <TableHead
                          key={field}
                          className={cn(
                            'cursor-pointer select-none text-xs font-semibold uppercase tracking-wider transition-colors hover:text-foreground whitespace-nowrap',
                            isActive ? 'text-cyan-400' : 'text-muted-foreground'
                          )}
                          onClick={() => onSortChange && onSortChange(field)}
                          role="columnheader"
                          aria-sort={isActive ? 'ascending' : 'none'}
                        >
                          <span className="flex items-center gap-1">
                            {label}
                            {isActive ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-30" />
                            )}
                          </span>
                        </TableHead>
                      )
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className="border-border hover:bg-accent/50 transition-colors"
                    >
                      {COLUMNS.map(({ field, format }) => (
                        <TableCell
                          key={field}
                          className={cn(
                            'py-2.5 text-sm whitespace-nowrap',
                            field === 'timestamp' && 'font-mono text-xs text-muted-foreground',
                            field === 'total_cost' && 'font-mono',
                            field === 'avg_duration' && 'font-mono',
                            field === 'completed' && 'text-emerald-400',
                            field === 'failed' && 'text-rose-400',
                            field === 'pending' && 'text-amber-400'
                          )}
                        >
                          {format(row[field])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange && onPageChange(page - 1)}
                disabled={page === 0}
                className="gap-1"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-xs text-muted-foreground font-mono tabular-nums">
                Page {page + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange && onPageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="gap-1"
                aria-label="Next"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default CallsTable
