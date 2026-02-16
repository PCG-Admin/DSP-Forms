import { PersonalLabourCarrierForm } from "@/components/forms/personal-labour-carrier-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Personal / Labour Carrier Inspection Checklist | Ringomode HSE",
  description: "Complete your daily personal / labour carrier inspection checklist.",
}

export default function PersonalLabourCarrierPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <PersonalLabourCarrierForm />
    </div>
  )
}