"use client"

import { useEffect, useState } from "react"

import { PageWrapper } from "@/components/dashboard/page-wrapper"
import { MicroSavings } from "@/components/dashboard/micro-savings"
import { ScoreCard } from "@/components/dashboard/score-card"
import { ChartCard } from "@/components/dashboard/chart-card"

import { Wallet, PiggyBank, TrendingUp, Zap } from "lucide-react"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

/* =========================
   TYPES
========================= */

type Roundup = {
  merchant: string
  amount: number
  roundup: number   // ⭐ FIXED (was rounded)
  date: string
}

type CompoundPoint = {
  year: number
  value: number
}

type MicroSavingsData = {
  total_saved?: number
  roundups_today?: number
  monthly_auto?: number
  projected_15yr?: number
  projection?: CompoundPoint[]   // ⭐ FIXED
  recent_roundups?: Roundup[]
}

/* =========================
   TOOLTIP
========================= */

function CompoundTooltip({
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

/* =========================
   PAGE
========================= */

export default function MicroSavingsPage() {
  const [data, setData] = useState<MicroSavingsData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/microsavings")
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Microsavings fetch error:", err)
        setError(true)
      }
    }

    fetchData()
  }, [])

  /* =========================
     STATES
  ========================= */

  if (error) {
    return (
      <PageWrapper
        title="Micro-Savings Engine"
        subtitle="Save spare change today. Retire years earlier tomorrow."
      >
        <p className="text-red-400">Failed to load micro-savings data.</p>
      </PageWrapper>
    )
  }

  if (!data) {
    return (
      <PageWrapper
        title="Micro-Savings Engine"
        subtitle="Save spare change today. Retire years earlier tomorrow."
      >
        <p className="text-muted-foreground">Loading...</p>
      </PageWrapper>
    )
  }

  /* =========================
     SAFE FALLBACKS
  ========================= */

  const compoundData = data.projection || []     // ⭐ FIXED
  const recentRoundups = data.recent_roundups || []

  return (
    <PageWrapper
      title="Micro-Savings Engine"
      subtitle="Save spare change today. Retire years earlier tomorrow."
    >
      {/* KPI Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          icon={Wallet}
          label="Total Saved"
          value={`$${data.total_saved ?? 0}`}
          subtext="Since launch"
        />

        <ScoreCard
          icon={Zap}
          label="Round-ups"
          value={`$${data.roundups_today ?? 0}`}
          subtext="Today"
        />

        <ScoreCard
          icon={PiggyBank}
          label="Monthly Auto"
          value={`$${data.monthly_auto ?? 0}`}
          subtext="Scheduled"
        />

        <ScoreCard
          icon={TrendingUp}
          label="Projected (15yr)"
          value={`$${((data.projected_15yr ?? 0) / 1000).toFixed(0)}K`}
          subtext="At 8% return"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <MicroSavings
  spareChangeSaved={data.total_saved}
  monthlyAutomation={data.monthly_auto}
  projectedLongTerm={data.projected_15yr}
/>

        <ChartCard icon={TrendingUp} title="Long-Term Compound Projection">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={compoundData}
              margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="compoundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
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
                tickFormatter={(v: number) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`
                }
              />

              <Tooltip content={<CompoundTooltip />} />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#compoundGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ROUNDUPS */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Recent Round-ups
        </h3>

        <div className="flex flex-col gap-2">
          {recentRoundups.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.merchant}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${item.amount.toFixed(2)} purchase
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-success">
                  {`+$${Number(item.roundup || 0).toFixed(2)}`}
                </p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}