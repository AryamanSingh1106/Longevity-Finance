"use client"

import type { LucideIcon } from "lucide-react"

interface ChartCardProps {
  icon: LucideIcon
  title: string
  badge?: React.ReactNode
  children: React.ReactNode
  className?: string
  elevated?: boolean
}

export function ChartCard({
  icon: Icon,
  title,
  badge,
  children,
  className = "",
  elevated = false,
}: ChartCardProps) {
  return (
    <div
      className={`${
        elevated ? "glass-card-elevated glow-border-blue" : "glass-card"
      } rounded-2xl p-6 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {badge}
      </div>
      {children}
    </div>
  )
}
