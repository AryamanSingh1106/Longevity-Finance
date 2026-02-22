"use client"

import { useEffect, useState } from "react"

import { PageWrapper } from "@/components/dashboard/page-wrapper"
import { SpendingIntelligence } from "@/components/dashboard/spending-intelligence"
import { ChartCard } from "@/components/dashboard/chart-card"
import { ScoreCard } from "@/components/dashboard/score-card"

import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  PieChart as PieChartIcon,
} from "lucide-react"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts"

type BehaviorData = {
  monthly_spend: number
  savings_rate: number
  lifestyle_inflation: number
  anomalies_count: number
  categories: {
    name: string
    value: number
  }[]
  monthly_trend: {
    month: string
    value: number
  }[]
  anomalies: {
    title?: string
    desc?: string
    impact?: string
  }[]
}

function SpendingTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.[0]) return null

  return (
    <div className="glass-card-elevated rounded-lg border border-border px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

export default function BehaviorPage() {
  const [data, setData] = useState<BehaviorData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchBehavior = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/behavior")
        const json = await res.json()

        console.log("BEHAVIOR DATA:", json)

        setData(json)
      } catch (e) {
        console.error(e)
        setError(true)
      }
    }

    fetchBehavior()
  }, [])

  if (error) {
    return (
      <PageWrapper
        title="Spending Intelligence"
        subtitle="Behavioral analytics and spending pattern detection."
      >
        <p className="text-red-400">Failed to load behavior data.</p>
      </PageWrapper>
    )
  }

  if (!data) {
    return (
      <PageWrapper
        title="Spending Intelligence"
        subtitle="Behavioral analytics and spending pattern detection."
      >
        <p className="text-muted-foreground">Loading...</p>
      </PageWrapper>
    )
  }

  const total = data.categories.reduce((a, b) => a + b.value, 0)

  return (
    <PageWrapper
      title="Spending Intelligence"
      subtitle="Behavioral analytics and spending pattern detection."
    >
      {/* KPI Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard icon={PieChartIcon} label="Monthly Spend" value={`$${data.monthly_spend}`} subtext="Current month" />
        <ScoreCard icon={TrendingDown} label="Savings Rate" value={`${data.savings_rate}%`} subtext="Of gross income" />
        <ScoreCard icon={TrendingUp} label="Lifestyle Inflation" value={`${data.lifestyle_inflation}%`} subtext="Year over year" />
        <ScoreCard icon={AlertTriangle} label="Anomalies" value={`${data.anomalies_count}`} subtext="Detected this month" />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingIntelligence
          spendingData={data.categories.map((c) => ({
            ...c,
            percentage: total ? Math.round((c.value / total) * 100) : 0,
            color:
              c.name === "Housing"
                ? "#3B82F6"
                : c.name === "Food"
                ? "#06B6D4"
                : c.name === "Transport"
                ? "#8B5CF6"
                : c.name === "Shopping"
                ? "#F59E0B"
                : "#10B981",
          }))}
        />

        <ChartCard icon={TrendingDown} title="Monthly Trend">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.monthly_trend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<SpendingTooltip />} />

              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.monthly_trend.map((m, index) => (
                  <Cell
                    key={`${m.month}-${index}`}
                    fill={
                      index === data.monthly_trend.length - 1
                        ? "#3B82F6"
                        : "rgba(51,65,85,0.5)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Anomalies */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Spending Anomalies
        </h3>

        <div className="flex flex-col gap-3">
          {(data.anomalies || []).map((item, index) => {
            const impact = item.impact || "0%"
            const isPositive = impact.includes("-")

            return (
              <div
                key={`${item.title || "anomaly"}-${index}`}
                className={`flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3 border-l-2 ${
                  isPositive ? "border-l-success/60" : "border-l-warning/60"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title || "Spending Event"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.desc || "No description"}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold ${
                    isPositive ? "text-success" : "text-warning"
                  }`}
                >
                  {impact}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </PageWrapper>
  )
}