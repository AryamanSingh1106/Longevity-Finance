"use client"

import { Bell, Search } from "lucide-react"

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      {/* Left: Title + AI Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-1.5">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Longevity
          </h1>
          <span className="text-lg font-medium tracking-tight text-muted-foreground">
            Finance
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/5 px-2.5 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-xs font-medium text-success">AI Active</span>
        </div>
      </div>

      {/* Right: Search, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        <div
          role="button"
          tabIndex={0}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </div>
        <div
          role="button"
          tabIndex={0}
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </div>
        <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
          JD
        </div>
      </div>
    </header>
  )
}
