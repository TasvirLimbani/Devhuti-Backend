import type { ReactNode } from "react"
import { Header } from "@/components/dashboard/header"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <Header />
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}
