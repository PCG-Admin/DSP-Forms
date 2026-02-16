import { BellTimberTruckForm } from "@/components/forms/bell-timber-truck-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Bell Timber Truck Pre-Shift Checklist | Ringomode HSE",
  description: "Complete pre-shift inspection for Bell timber trucks.",
}

export default function BellTimberTruckPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <BellTimberTruckForm />
    </div>
  )
}