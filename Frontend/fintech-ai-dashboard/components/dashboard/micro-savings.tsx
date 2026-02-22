"use client"

import { useEffect, useState } from "react"
import { Wallet, ArrowUpRight } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface MicroSavingsProps {
  spareChangeSaved?: number
  monthlyAutomation?: number
  projectedLongTerm?: number
}

const trendData = [
  { value: 120 },
  { value: 180 },
  { value: 160 },
  { value: 220 },
  { value: 280 },
  { value: 260 },
  { value: 340 },
  { value: 380 },
  { value: 420 },
  { value: 460 },
  { value: 520 },
  { value: 580 },
]

export function MicroSavings({
  spareChangeSaved = 0,
  monthlyAutomation = 0,
  projectedLongTerm = 0,
}: MicroSavingsProps) {
  const [displaySaved, setDisplaySaved] = useState(0)

  /* ======================
     ANIMATED COUNTER
  ====================== */
  useEffect(() => {
    let current = 0
    const target = Number(spareChangeSaved) || 0
    const step = Math.max(1, Math.ceil(target / 60))

    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      setDisplaySaved(current)
    }, 16)

    return () => clearInterval(interval)
  }, [spareChangeSaved])

  /* ======================
     DYNAMIC GROWTH %
  ====================== */
  const growthPercent =
    spareChangeSaved > 0
      ? (((projectedLongTerm - spareChangeSaved) / spareChangeSaved) * 100).toFixed(1)
      : "0"

  return (
    <div
      className="glass-card rounded-2xl p-6 animate-slide-up"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="mb-5 flex items-center gap-2">
        <Wallet className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">
          Autonomous Micro-Savings
        </h3>
      </div>

      {/* Metrics Grid */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Spare Change
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            ${displaySaved.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Monthly Auto
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            ${Number(monthlyAutomation).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Long-Term
          </p>
          <p className="mt-1 text-xl font-bold text-success">
            ${(Number(projectedLongTerm) / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mb-3">
        <ResponsiveContainer width="100%" height={64}>
          <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#savingsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs italic text-muted-foreground">
          Save spare change today. Retire years earlier tomorrow.
        </p>

        <div className="flex items-center gap-1 text-xs font-medium text-success">
          <ArrowUpRight className="h-3 w-3" />
          AI projected growth
        </div>
      </div>
    </div>
  )
}