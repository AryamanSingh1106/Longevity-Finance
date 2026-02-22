"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ParticleBackground from "@/components/ui/particle-background"

export default function LoginPage() {
  const router = useRouter()
  const [plaidReady, setPlaidReady] = useState(false)
  const [loading, setLoading] = useState(false)

  // ---------------------------------------------------
  // LOAD PLAID SCRIPT
  // ---------------------------------------------------
  useEffect(() => {
    const script = document.createElement("script")
    script.src =
      "https://cdn.plaid.com/link/v2/stable/link-initialize.js"
    script.async = true

    script.onload = () => {
      console.log("Plaid loaded")
      setPlaidReady(true)
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // ---------------------------------------------------
  // CONNECT BANK
  // ---------------------------------------------------
  const connectBank = async () => {
    if (!plaidReady) {
      alert("Plaid not ready yet")
      return
    }

    try {
      setLoading(true)

      // STEP 1 — get link token
      const response = await fetch(
        "http://127.0.0.1:5000/api/create_link_token"
      )
      const data = await response.json()

      // @ts-ignore
      const handler = window.Plaid.create({
        token: data.link_token,

        onSuccess: async (public_token: string) => {
          console.log("Public token:", public_token)

          // STEP 2 — exchange token
          await fetch(
            "http://127.0.0.1:5000/api/exchange_public_token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                public_token,
              }),
            }
          )

          alert("Bank connected successfully 🚀")

          // REDIRECT TO DASHBOARD
          router.push("/dashboard")
        },
      })

      handler.open()
    } catch (err) {
      console.error("Plaid error:", err)
    } finally {
      setLoading(false)
    }
  }

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      <ParticleBackground />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
        <div className="glass-card w-[420px] rounded-2xl p-10 text-center">

        <h1 className="mb-3 text-2xl font-bold">
          Connect Your Bank
        </h1>

        <p className="mb-6 text-sm text-muted-foreground">
          Securely connect your bank to start AI financial analysis.
        </p>

        <button
          onClick={connectBank}
          disabled={!plaidReady || loading}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Connect Bank"}
        </button>

        </div>
      </div>
    </div>
  )
}