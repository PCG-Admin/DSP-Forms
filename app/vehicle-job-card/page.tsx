import { VehicleJobCardForm } from "@/components/forms/vehicle-job-card-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Motorised Equipment/Vehicle Job Card | Ringomode HSE",
  description: "Complete job card for motorised equipment and vehicles.",
}

export default function VehicleJobCardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <VehicleJobCardForm />
    </div>
  )
}