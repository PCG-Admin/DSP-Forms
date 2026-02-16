import { TimberTruckTrailerForm } from "@/components/forms/timber-truck-trailer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Timber Truck And Trailer Checklist | Ringomode HSE",
  description: "Complete your timber truck and trailer inspection checklist.",
}

export default function TimberTruckTrailerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <TimberTruckTrailerForm />
    </div>
  )
}