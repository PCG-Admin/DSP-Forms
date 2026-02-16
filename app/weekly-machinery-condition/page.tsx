import { WeeklyMachineryConditionForm } from "@/components/forms/weekly-machinery-condition-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Weekly Machinery Condition Assessment | Ringomode HSE",
  description: "Complete weekly condition assessment for machinery and equipment.",
}

export default function WeeklyMachineryConditionPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <WeeklyMachineryConditionForm />
    </div>
  )
}