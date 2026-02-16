import { DieselCartTrailerForm } from "@/components/forms/diesel-cart-trailer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Diesel Cart Trailer Inspection Checklist | Ringomode HSE",
  description: "Complete inspection checklist for diesel cart trailers.",
}

export default function DieselCartTrailerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <DieselCartTrailerForm />
    </div>
  )
}