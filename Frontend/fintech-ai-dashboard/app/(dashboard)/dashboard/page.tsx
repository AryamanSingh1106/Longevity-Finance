"use client"

import { useEffect, useState } from "react"

import { PageWrapper } from "@/components/dashboard/page-wrapper"
import { RetirementScore } from "@/components/dashboard/retirement-score"
import { WealthProjection } from "@/components/dashboard/wealth-projection"
import { ScoreCard } from "@/components/dashboard/score-card"
import { InsightCard } from "@/components/dashboard/insight-card"

import { Shield, Wallet, TrendingUp, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/dashboard")
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      }
    }

    fetchDashboard()
  }, [])

  // ---------------------------
  // LOADING STATE
  // ---------------------------
  if (!data) {
    return (
      <PageWrapper title="Financial Overview" subtitle="Loading...">
        Loading AI data...
      </PageWrapper>
    )
  }

  // ---------------------------
  // READINESS STATUS
  // ---------------------------
  const readinessStatus =
    data.risk_level === "secure"
      ? "secure"
      : data.risk_level === "moderate"
      ? "moderate"
      : "at-risk"

  // ---------------------------
  // DYNAMIC INSIGHTS
  // ---------------------------
  const insights =
    data.priority_insights?.length > 0
      ? data.priority_insights
      : [
          {
            text: "Financial signals detected.",
            type: "warning",
          },
        ]

  return (
    <PageWrapper
      title="Financial Overview"
      subtitle="Real-time intelligence across your financial life."
    >
      {/* Retirement Gap */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-warning/20 bg-warning/[0.04] px-5 py-3">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <p className="text-sm">
          <span className="font-medium text-warning">
            Projected Retirement Gap:
          </span>{" "}
          <span className="font-semibold">
            ${data.retirement_gap ?? 0}
          </span>
        </p>
      </div>

      {/* KPI ROW */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          icon={Shield}
          label="Risk Level"
          value={data.risk_level ?? "unknown"}
          subtext="AI evaluated"
        />

        <ScoreCard
          icon={Wallet}
          label="Monthly Savings"
          value={`$${data.monthly_savings ?? 0}`}
          subtext="Auto + manual"
        />

        <ScoreCard
          icon={TrendingUp}
          label="Delay Cost"
          value={`$${data.delay_cost ?? 0}`}
          subtext="If investment delayed"
        />

        <ScoreCard
          icon={AlertTriangle}
          label="Action Items"
          value={data.action_items ?? 0}
          subtext="AI recommendations"
        />
      </div>

      {/* HERO SECTION */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RetirementScore
          retirementScore={data.retirement_score ?? 0}
          readinessStatus={readinessStatus}
          monthlyTarget={data.monthly_target ?? 0}
          retirementAge={data.projected_retirement_age ?? 67}
        />

        <WealthProjection data={data.projection ?? []} />
      </div>

      {/* PRIORITY INSIGHTS (DYNAMIC) */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Priority Insights
        </h3>

        <div className="flex flex-col gap-3">
          {insights.map((insight: any, i: number) => (
            <InsightCard
              key={i}
              text={insight.text}
              type={insight.type || "warning"}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}