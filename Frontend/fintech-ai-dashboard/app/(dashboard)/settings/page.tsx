"use client"

import { PageWrapper } from "@/components/dashboard/page-wrapper"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Check, Link2, RotateCcw } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailDigest, setEmailDigest] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetMessage, setResetMessage] = useState("")

  const handleReset = () => {
    setResetMessage("Demo data reset successfully!")
    setTimeout(() => setResetMessage(""), 3000)
    setShowResetConfirm(false)
  }

  // 🔥 REAL REFRESH FUNCTION
  const handleRefresh = () => {
    // trigger dashboard re-fetch
    localStorage.setItem("refresh_dashboard", Date.now().toString())

    setResetMessage("Data refreshed successfully!")
    setTimeout(() => setResetMessage(""), 3000)
  }

  return (
    <PageWrapper
      title="Settings"
      subtitle="Manage your account preferences and application settings."
    >
      <div className="space-y-6">

        {/* Profile Section */}
        <Card className="glass-card-elevated rounded-xl border-border p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Profile</h3>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              JD
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-sm text-muted-foreground">
              Profile information is read-only for security.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  defaultValue="John"
                  readOnly
                  disabled
                  className="glass-card border-border bg-input/50 cursor-not-allowed opacity-60"
                />
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  defaultValue="Doe"
                  readOnly
                  disabled
                  className="glass-card border-border bg-input/50 cursor-not-allowed opacity-60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                defaultValue="john.doe@example.com"
                readOnly
                disabled
                className="glass-card border-border bg-input/50 cursor-not-allowed opacity-60"
              />
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="glass-card-elevated rounded-xl border-border p-6">
          <h3 className="mb-6 text-lg font-semibold text-foreground">
            Appearance
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">
                Choose between light and dark mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        {/* Notifications */}
        <Card className="glass-card-elevated rounded-xl border-border p-6">
          <h3 className="mb-6 text-lg font-semibold text-foreground">
            Notifications
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div>
                <p className="font-medium text-foreground">Daily Email Digest</p>
              </div>
              <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
            </div>
          </div>
        </Card>

        {/* Connected Accounts */}
        <Card className="glass-card-elevated rounded-xl border-border p-6">
          <h3 className="mb-6 text-lg font-semibold text-foreground">
            Connected Accounts
          </h3>

          <div className="flex items-center justify-between rounded-lg border border-success/20 bg-success/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20">
                <Link2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium text-success">Plaid Sandbox</p>
                <p className="text-xs text-success/80">
                  Connected • Demo account active
                </p>
              </div>
            </div>
            <Check className="h-4 w-4 text-success" />
          </div>
        </Card>

        {/* Data & Sync */}
        <Card className="glass-card-elevated rounded-xl border-border p-6">
          <h3 className="mb-6 text-lg font-semibold text-foreground">
            Data & Sync
          </h3>

          <Button
            variant="outline"
            className="w-full border-border"
            onClick={handleRefresh}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>

          {resetMessage && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3 text-sm text-success">
              <Check className="h-4 w-4" />
              {resetMessage}
            </div>
          )}
        </Card>

        {/* Danger Zone */}
        <Card className="glass-card-elevated rounded-xl border-destructive/20 bg-destructive/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-semibold text-destructive">
              Danger Zone
            </h3>
          </div>

          {!showResetConfirm ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowResetConfirm(true)}
            >
              Reset Demo Data
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-foreground">
                Are you sure you want to reset all demo data?
              </p>
              <div className="flex gap-3">
                <Button variant="destructive" className="flex-1" onClick={handleReset}>
                  Confirm Reset
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  )
}