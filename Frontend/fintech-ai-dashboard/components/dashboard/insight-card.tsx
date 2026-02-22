"use client"

interface InsightCardProps {
  text: string
  type: "warning" | "suggestion" | "positive"
}

const typeStyles = {
  warning: "border-l-warning/60",
  suggestion: "border-l-primary/60",
  positive: "border-l-success/60",
}

export function InsightCard({ text, type }: InsightCardProps) {
  return (
    <div
      className={`rounded-lg border-l-2 bg-secondary/30 px-4 py-3 ${typeStyles[type]}`}
    >
      <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
    </div>
  )
}
