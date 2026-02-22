"use client"

import { useState, useMemo } from "react"
import { Timer, TrendingDown } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

interface DelaySimulatorProps {
  delayImpact?: {
    baseAge: number
    retirementAge: number
    monthlyContribution: number
    annualReturn: number
  }
}

function calculateFutureValue(
  monthlyContribution: number,
  annualReturn: number,
  years: number
): number {
  const monthlyRate = annualReturn / 12
  const months = years * 12
  return monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload || !payload[0]) return null
  return (
    <div className="glass-card-elevated rounded-lg border border-border px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">Start at {label}</p>
      <p className="text-muted-foreground">
        Net Worth: ${(payload[0].value / 1_000_000).toFixed(2)}M
      </p>
    </div>
  )
}

export function DelaySimulator({ delayImpact }: DelaySimulatorProps) {
  const config = delayImpact || {
    baseAge: 22,
    retirementAge: 65,
    monthlyContribution: 500,
    annualReturn: 0.08,
  }

  const [startAge, setStartAge] = useState(25)

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const age = 20 + i * 5
      const years = config.retirementAge - age
      const value =
        years > 0
          ? calculateFutureValue(config.monthlyContribution, config.annualReturn, years)
          : 0
      return { age: `${age}`, value, isSelected: age === startAge }
    })
  }, [config, startAge])

  const currentValue = calculateFutureValue(
    config.monthlyContribution,
    config.annualReturn,
    config.retirementAge - startAge
  )
  const optimalValue = calculateFutureValue(
    config.monthlyContribution,
    config.annualReturn,
    config.retirementAge - config.baseAge
  )
  const wealthLost = optimalValue - currentValue

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="mb-5 flex items-center gap-2">
        <Timer className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">
          Delay Cost Simulator
        </h3>
      </div>

      {/* Slider Control */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Investment starting age</span>
          <span className="text-sm font-bold text-foreground">{startAge} years old</span>
        </div>
        <Slider
          value={[startAge]}
          onValueChange={(v) => setStartAge(v[0])}
          min={20}
          max={50}
          step={1}
          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>20</span>
          <span>50</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="age"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748B" }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isSelected ? "#3B82F6" : "rgba(51,65,85,0.5)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary/50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Future Net Worth
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">
            ${(currentValue / 1_000_000).toFixed(2)}M
          </p>
        </div>
        <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-3">
          <div className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-destructive" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-destructive">
              Wealth Lost
            </p>
          </div>
          <p className="mt-1 text-lg font-bold text-destructive">
            -${(wealthLost / 1_000_000).toFixed(2)}M
          </p>
        </div>
      </div>
    </div>
  )
}
