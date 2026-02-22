"use client"

import type { LucideIcon } from "lucide-react"

interface ScoreCardProps {
  icon: LucideIcon
  label: string
  value: string
  subtext?: string
  trend?: { value: string; positive: boolean }
}

export function ScoreCard({ icon: Icon, label, value, subtext, trend }: ScoreCardProps) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.positive ? "text-success" : "text-destructive"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
