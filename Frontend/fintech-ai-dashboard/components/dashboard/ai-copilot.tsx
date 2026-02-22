"use client"

import { Sparkles, ArrowRight } from "lucide-react"

interface AiCopilotProps {
  aiInsights?: Array<{
    id: string
    text: string
    type: "warning" | "suggestion" | "positive"
  }>
}

const defaultInsights = [
  {
    id: "1",
    text: "At your current savings rate, you face a moderate retirement shortfall. Increasing contributions by 6% could close the gap.",
    type: "warning" as const,
  },
  {
    id: "2",
    text: "Your discretionary spending dropped 8% this month. Redirecting the surplus to your index fund would yield $12K over 5 years.",
    type: "suggestion" as const,
  },
  {
    id: "3",
    text: "Emergency fund reached 4.2 months of coverage, exceeding the recommended 3-month buffer.",
    type: "positive" as const,
  },
]

const typeStyles = {
  warning: "border-l-warning/60",
  suggestion: "border-l-primary/60",
  positive: "border-l-success/60",
}

export function AiCopilot({ aiInsights }: AiCopilotProps) {
  const insights = aiInsights || defaultInsights

  return (
    <div
      className="glass-card-elevated relative overflow-hidden rounded-2xl p-6 animate-slide-up"
      style={{ animationDelay: "0.5s" }}
    >
      {/* Subtle gradient border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))",
      }} />
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/10" />

      <div className="relative">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">
            AI Financial Copilot
          </h3>
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            3 insights
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-lg border-l-2 bg-secondary/30 px-4 py-3 ${typeStyles[insight.type]}`}
            >
              <p className="text-sm leading-relaxed text-foreground/90">
                {insight.text}
              </p>
            </div>
          ))}
        </div>

        <button className="mt-4 flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80">
          View all insights
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
