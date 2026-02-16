import { WaterCartTrailerForm } from "@/components/forms/water-cart-trailer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Water Cart Trailer & Pressure Washer Checklist | Ringomode HSE",
  description: "Complete inspection checklist for water cart trailer and pressure washer.",
}

export default function WaterCartTrailerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <WaterCartTrailerForm />
    </div>
  )
}