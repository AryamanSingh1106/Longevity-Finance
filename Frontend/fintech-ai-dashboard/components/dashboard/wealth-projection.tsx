"use client"

import { TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface WealthProjectionProps {
  data?: Array<{
    year: number | string
    current: number
    optimized: number
  }>
}

const defaultData = [
  { year: "2026", current: 45000, optimized: 48000 },
  { year: "2028", current: 78000, optimized: 95000 },
  { year: "2030", current: 120000, optimized: 165000 },
  { year: "2032", current: 168000, optimized: 258000 },
  { year: "2034", current: 225000, optimized: 380000 },
  { year: "2036", current: 290000, optimized: 530000 },
  { year: "2038", current: 365000, optimized: 720000 },
  { year: "2040", current: 450000, optimized: 960000 },
]

const formatCurrency = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
}) {
  if (!active || !payload) return null

  return (
    <div className="glass-card-elevated rounded-lg border border-border px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-medium text-foreground">{label}</p>

      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              background:
                entry.dataKey === "optimized" ? "#8B5CF6" : "#3B82F6",
            }}
          />
          <span className="text-muted-foreground">
            {entry.dataKey === "optimized" ? "Optimized" : "Current"}:
          </span>
          <span className="font-medium text-foreground">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function WealthProjection({ data }: WealthProjectionProps) {
  const chartData = data || defaultData

  return (
    <div
      className="glass-card rounded-2xl p-6 animate-slide-up"
      style={{ animationDelay: "0.1s" }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Wealth Projection Engine
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-muted-foreground">Optimized</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(51,65,85,0.3)"
            vertical={false}
          />

          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748B" }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickFormatter={formatCurrency}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="current"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#currentGrad)"
          />

          <Area
            type="monotone"
            dataKey="optimized"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#optimizedGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}