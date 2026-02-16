import { DezziTimberTruckForm } from "@/components/forms/dezzi-timber-truck-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Dezzi Timber Truck Pre-Shift Checklist | Ringomode HSE",
  description: "Complete pre-shift inspection for Dezzi timber trucks.",
}

export default function DezziTimberTruckPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <DezziTimberTruckForm />
    </div>
  )
}