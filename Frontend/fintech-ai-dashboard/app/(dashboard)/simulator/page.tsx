"use client"

import { PageWrapper } from "@/components/dashboard/page-wrapper"
import { DelaySimulator } from "@/components/dashboard/delay-simulator"
import { WealthProjection } from "@/components/dashboard/wealth-projection"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Slider } from "@/components/ui/slider"
import { useState, useMemo } from "react"
import { Calculator, TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

function RetirementTooltip({
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
      <p className="mb-1 font-medium text-foreground">Age {label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              background:
                entry.dataKey === "aggressive" ? "#10B981" : entry.dataKey === "moderate" ? "#3B82F6" : "#F59E0B",
            }}
          />
          <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
          <span className="font-medium text-foreground">
            ${(entry.value / 1_000_000).toFixed(2)}M
          </span>
        </div>
      ))}
    </div>
  )
}

export default function SimulatorPage() {
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [retirementAge, setRetirementAge] = useState(65)

  const scenarioData = useMemo(() => {
    const currentAge = 28
    const points: Array<{
      age: string
      conservative: number
      moderate: number
      aggressive: number
    }> = []
    for (let age = currentAge; age <= retirementAge; age += 5) {
      const years = age - currentAge
      const months = years * 12
      const calc = (rate: number) =>
        monthlyContribution * ((Math.pow(1 + rate / 12, months) - 1) / (rate / 12))
      points.push({
        age: `${age}`,
        conservative: calc(0.05),
        moderate: calc(0.08),
        aggressive: calc(0.11),
      })
    }
    return points
  }, [monthlyContribution, retirementAge])

  const finalModerate = scenarioData[scenarioData.length - 1]?.moderate ?? 0

  return (
    <PageWrapper
      title="Financial Simulator"
      subtitle="Interactive tools to model your financial future."
    >
      {/* Scenario Modeler */}
      <div className="mb-6 glass-card-elevated glow-border-blue rounded-2xl p-6">
        <div className="mb-5 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Retirement Scenario Modeler
          </h3>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Monthly contribution
              </span>
              <span className="text-sm font-bold text-foreground">
                ${monthlyContribution.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[monthlyContribution]}
              onValueChange={(v) => setMonthlyContribution(v[0])}
              min={100}
              max={5000}
              step={50}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background"
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>$100</span>
              <span>$5,000</span>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Target retirement age
              </span>
              <span className="text-sm font-bold text-foreground">
                {retirementAge}
              </span>
            </div>
            <Slider
              value={[retirementAge]}
              onValueChange={(v) => setRetirementAge(v[0])}
              min={50}
              max={75}
              step={1}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background"
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>50</span>
              <span>75</span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Conservative (5%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Moderate (8%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Aggressive (11%)</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={scenarioData}
            margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="modGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="aggGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(51,65,85,0.3)"
              vertical={false}
            />
            <XAxis
              dataKey="age"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748B" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(v: number) =>
                v >= 1_000_000
                  ? `$${(v / 1_000_000).toFixed(1)}M`
                  : `$${(v / 1_000).toFixed(0)}K`
              }
            />
            <Tooltip content={<RetirementTooltip />} />
            <Area
              type="monotone"
              dataKey="conservative"
              stroke="#F59E0B"
              strokeWidth={1.5}
              fill="url(#consGrad)"
            />
            <Area
              type="monotone"
              dataKey="moderate"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#modGrad)"
            />
            <Area
              type="monotone"
              dataKey="aggressive"
              stroke="#10B981"
              strokeWidth={1.5}
              fill="url(#aggGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 rounded-xl bg-secondary/50 p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Projected moderate portfolio at age {retirementAge}
          </p>
          <p className="text-2xl font-bold text-foreground">
            ${(finalModerate / 1_000_000).toFixed(2)}M
          </p>
        </div>
      </div>

      {/* Existing Tools */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DelaySimulator />
        <WealthProjection />
      </div>
    </PageWrapper>
  )
}
