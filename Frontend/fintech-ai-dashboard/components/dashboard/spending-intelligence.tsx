"use client"

import { PieChart as PieChartIcon } from "lucide-react"
import { Cell, Pie, PieChart, Tooltip } from "recharts"

interface SpendingIntelligenceProps {
  spendingData?: Array<{
    name: string
    value: number
  }>
}

const COLORS: Record<string, string> = {
  Housing: "#3B82F6",
  Food: "#06B6D4",
  Transport: "#8B5CF6",
  Shopping: "#F59E0B",
  Lifestyle: "#10B981",
  Other: "#334155",
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: any }>
}) {
  if (!active || !payload?.[0]) return null
  const data = payload[0].payload

  return (
    <div className="glass-card-elevated rounded-lg border border-border px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">{data.name}</p>
      <p className="text-muted-foreground">
        ${data.value.toLocaleString()} ({data.percentage}%)
      </p>
    </div>
  )
}

export function SpendingIntelligence({ spendingData }: SpendingIntelligenceProps) {
  if (!spendingData) return null

  const total = spendingData.reduce((acc, item) => acc + item.value, 0)

  const data = spendingData.map((item) => ({
    ...item,
    percentage: Math.round((item.value / total) * 100),
    color: COLORS[item.name] || "#334155",
  }))

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-2">
        <PieChartIcon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">
          Spending Intelligence
        </h3>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <PieChart width={140} height={140}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={62}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-foreground">
              ${(total / 1000).toFixed(1)}K
            </span>
            <span className="text-[10px] text-muted-foreground">Monthly</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">
                  ${item.value.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[11px] italic text-muted-foreground">
        Behavioral spending pattern detected.
      </p>
    </div>
  )
}