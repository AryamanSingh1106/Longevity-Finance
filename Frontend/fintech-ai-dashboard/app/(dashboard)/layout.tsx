import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { FloatingAiCard } from "@/components/dashboard/floating-ai-card"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="ml-56 flex flex-1 flex-col">
        <TopNav />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
      <FloatingAiCard />
    </div>
  )
}
