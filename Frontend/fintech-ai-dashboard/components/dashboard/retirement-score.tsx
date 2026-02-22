"use client"

import { useEffect, useState } from "react"
import { Shield } from "lucide-react"

interface RetirementScoreProps {
  retirementScore?: number
  readinessStatus?: "secure" | "moderate" | "at-risk"
  monthlyTarget?: number
  retirementAge?: number
}

const statusConfig = {
  secure: {
    label: "Secure",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    dot: "bg-success",
  },
  moderate: {
    label: "Moderate",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    dot: "bg-warning",
  },
  "at-risk": {
    label: "At Risk",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    dot: "bg-destructive",
  },
}

export function RetirementScore({
  retirementScore = 72,
  readinessStatus = "moderate",
  monthlyTarget = 2450,
  retirementAge = 67,
}: RetirementScoreProps) {
  const [displayScore, setDisplayScore] = useState(0)

  const status = statusConfig[readinessStatus]
  const circumference = 2 * Math.PI * 64
  const progress = (displayScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const interval = setInterval(() => {
        current += 1
        setDisplayScore(current)
        if (current >= retirementScore) clearInterval(interval)
      }, 18)

      return () => clearInterval(interval)
    }, 300)

    return () => clearTimeout(timer)
  }, [retirementScore])

  return (
    <div
      className="glass-card-elevated glow-border-blue rounded-2xl p-7 animate-slide-up"
      style={{
        boxShadow:
          "0 0 32px rgba(59,130,246,0.12), 0 0 64px rgba(59,130,246,0.06), inset 0 1px 0 rgba(59,130,246,0.1)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Retirement Readiness Score
          </h3>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-full border ${status.border} ${status.bg} px-2.5 py-0.5`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          <span className={`text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg width="156" height="156" viewBox="0 0 156 156" className="-rotate-90">
            <circle
              cx="78"
              cy="78"
              r="64"
              fill="none"
              stroke="rgba(51,65,85,0.3)"
              strokeWidth="9"
            />
            <circle
              cx="78"
              cy="78"
              r="64"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              className="transition-all duration-100 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tracking-tight text-foreground">
              {displayScore}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>

        {/* DETAILS (🔥 NOW DYNAMIC) */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Projected Retirement Age
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {retirementAge}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Monthly Target
            </p>
            <p className="text-2xl font-semibold text-foreground">
             ${monthlyTarget}
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Computed using behavioral signals and long-term financial projections.
          </p>
        </div>
      </div>
    </div>
  )
}