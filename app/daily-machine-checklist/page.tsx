import { DailyMachineChecklistForm } from "@/components/forms/daily-machine-checklist-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Daily Machine Checklist | Ringomode HSE",
  description: "Daily inspection checklist for machines covering engine, chassis, hydraulics, and attachments.",
}

export default function DailyMachineChecklistPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <DailyMachineChecklistForm />
    </div>
  )
}