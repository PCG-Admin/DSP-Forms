import { ServiceDieselTruckForm } from "@/components/forms/service-diesel-truck-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Service/Diesel Truck Pre-Shift Inspection Checklist | Ringomode HSE",
  description: "Complete your pre-shift inspection for the service/diesel truck.",
}

export default function ServiceDieselTruckPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <ServiceDieselTruckForm />
    </div>
  )
}