"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, AlertCircle, TrendingUp, Lightbulb, X } from "lucide-react"

interface Message {
  text: string
  icon: React.ReactNode
  type: "warning" | "insight" | "opportunity"
}

const messages: Message[] = [
  {
    text: "Your dining expenses are up 32% this month.",
    icon: <AlertCircle className="h-4 w-4" />,
    type: "warning",
  },
  {
    text: "Investing $200/month earlier could add $180K to retirement.",
    icon: <TrendingUp className="h-4 w-4" />,
    type: "insight",
  },
  {
    text: "Micro-savings increased your annual investment capacity by 14%.",
    icon: <Lightbulb className="h-4 w-4" />,
    type: "opportunity",
  },
]

export function FloatingAiCard() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState<boolean | null>(null)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    // Load dismissed state from localStorage on mount
    const isDismissed = localStorage.getItem("ai-copilot-dismissed") === "true"
    setIsVisible(!isDismissed)
  }, [])

  useEffect(() => {
    if (isVisible === false) {
      // Persist dismissal to localStorage
      localStorage.setItem("ai-copilot-dismissed", "true")
    } else if (isVisible === true) {
      localStorage.removeItem("ai-copilot-dismissed")
    }
  }, [isVisible])

  useEffect(() => {
    if (isVisible !== true) return

    const interval = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        setFadeIn(true)
      }, 300)
    }, 6000)

    return () => clearInterval(interval)
  }, [isVisible])

  // Don't render anything until we've checked localStorage to prevent flash
  if (isVisible === null) {
    return null
  }

  if (isVisible === false) {
    return null
  }

  const currentMessage = messages[currentMessageIndex]
  const typeColors = {
    warning: "text-warning/80",
    insight: "text-primary/80",
    opportunity: "text-success/80",
  }

  return (
    <div
      className="fixed right-6 top-24 z-50 w-96 transition-opacity duration-300"
      style={{ opacity: fadeIn ? 1 : 0 }}
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500"
        style={{
          background:
            currentMessage.type === "warning"
              ? "rgba(59, 130, 246, 0.1)"
              : currentMessage.type === "insight"
                ? "rgba(99, 102, 241, 0.1)"
                : "rgba(16, 185, 129, 0.1)",
        }}
      />

      {/* Card */}
      <div
        className="glass-card-elevated glow-border-blue relative rounded-2xl p-5"
        style={{
          boxShadow:
            currentMessage.type === "warning"
              ? "0 0 32px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(59, 130, 246, 0.15)"
              : currentMessage.type === "insight"
                ? "0 0 32px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(99, 102, 241, 0.15)"
                : "0 0 32px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(16, 185, 129, 0.15)",
        }}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              AI Copilot
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Message */}
        <div className="mb-4 flex gap-3">
          <div className={`mt-0.5 shrink-0 ${typeColors[currentMessage.type]}`}>
            {currentMessage.icon}
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {currentMessage.text}
          </p>
        </div>

        {/* Footer - Expand Link */}
        <Link
          href="/insights#ai-insights"
          className="group inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/10 hover:text-primary/90"
        >
          View insights
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Message Indicator Dots */}
        <div className="mt-3 flex gap-1">
          {messages.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === currentMessageIndex ? "24px" : "6px",
                backgroundColor:
                  i === currentMessageIndex
                    ? "rgba(59, 130, 246, 0.6)"
                    : "rgba(59, 130, 246, 0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
