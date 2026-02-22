"use client"

import { useEffect, useState } from "react"

import { PageWrapper } from "@/components/dashboard/page-wrapper"
import { InsightCard } from "@/components/dashboard/insight-card"

import {
  Sparkles,
  Shield,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"

type InsightType = "warning" | "suggestion" | "positive"

type Insight = {
  text: string
  type: InsightType
}

// Backend response structure
type BackendInsightsResponse = {
  ai_insights?: string[]
  behavioral_signals?: string[]
  optimization_opportunities?: string[]
}

function InsightSection({
  icon: Icon,
  title,
  insights,
}: {
  icon: any
  title: string
  insights: Insight[]
}) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">
            {title}
          </h3>
        </div>

        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          {insights.length} signals
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {insights.length === 0 ? (
          <p className="text-xs text-muted-foreground">No signals yet</p>
        ) : (
          insights.map((insight, i) => (
            <InsightCard key={i} text={insight.text} type={insight.type} />
          ))
        )}
      </div>
    </div>
  )
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/insights")
        const data: BackendInsightsResponse = await res.json()

        // 🔥 Convert backend format → frontend format
        const formattedInsights: Insight[] = [
          ...(data.ai_insights || []).map((text) => ({
            text,
            type: "warning" as InsightType,
          })),

          ...(data.behavioral_signals || []).map((text) => ({
            text,
            type: "suggestion" as InsightType,
          })),

          ...(data.optimization_opportunities || []).map((text) => ({
            text,
            type: "positive" as InsightType,
          })),
        ]

        setInsights(formattedInsights)
      } catch (err) {
        console.error("Insights fetch error:", err)
        setInsights([])
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()

    // auto refresh every 10 sec
    const interval = setInterval(fetchInsights, 10000)

    return () => clearInterval(interval)
  }, [])

  // grouping
  const warnings = insights.filter(i => i.type === "warning")
  const suggestions = insights.filter(i => i.type === "suggestion")
  const positives = insights.filter(i => i.type === "positive")

  if (loading) {
    return (
      <PageWrapper
        title="AI Insights"
        subtitle="Intelligent financial guidance powered by behavioral analysis."
      >
        <p className="text-muted-foreground">Loading insights...</p>
      </PageWrapper>
    )
  }

  return (
    <div id="ai-insights">
      <PageWrapper
        title="AI Insights"
        subtitle="Intelligent financial guidance powered by behavioral analysis."
      >
        {/* AI Status */}
        <div className="mb-6 glass-card-elevated glow-border-accent rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  AI Financial Copilot
                </h3>
                <p className="text-xs text-muted-foreground">
                  Live insights generated from backend ML engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/5 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs font-medium text-success">
                {insights.length} insights generated
              </span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-6">

          <InsightSection
            icon={Shield}
            title="AI Generated Insights"
            insights={insights}
          />

          <InsightSection
            icon={AlertTriangle}
            title="Behavioral Signals"
            insights={warnings}
          />

          <InsightSection
            icon={TrendingUp}
            title="Optimization Opportunities"
            insights={[...suggestions, ...positives]}
          />

        </div>
      </PageWrapper>
    </div>
  )
}