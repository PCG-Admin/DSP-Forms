import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin-dashboard'
import { SiteHeader } from '@/components/site-header'
import type { Submission } from '@/lib/types'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Review and manage HSE inspection submissions.',
}

export default async function AdminPage() {
  const supabase = createClient()

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch user role and brand from database
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('role, brand')
    .eq('id', user.id)
    .single()

  if (dbError || !userData) {
    // If no user record, redirect to brand selection
    redirect('/brand-select')
  }

  // If not admin, redirect to home
  if (userData.role !== 'admin') {
    redirect('/')
  }

  // Get the user's brand (all admins may have a brand? but we'll use it for filtering)
  const brand = userData.brand || 'ringomode'

  // Fetch submissions from Supabase
  const { data: submissionsData, error: submissionsError } = await supabase
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (submissionsError) {
    console.error('Failed to fetch submissions:', submissionsError)
  }

  // Transform to camelCase to match Submission type
  const submissions: Submission[] = (submissionsData || []).map((s: any) => ({
    id: s.id,
    formType: s.form_type,
    formTitle: s.form_title,
    submittedBy: s.submitted_by,
    submittedAt: s.submitted_at,
    data: s.data,
    hasDefects: s.has_defects,
    brand: s.brand,
    isRead: s.is_read,
  }))

  // Filter submissions by brand.
  // For backward compatibility, submissions without a brand field are treated as 'ringomode'.
  const filteredSubmissions = submissions.filter(s => {
    if (!s.brand) {
      return brand === 'ringomode'
    }
    return s.brand === brand
  })

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="admin" />
      <AdminDashboard initialSubmissions={filteredSubmissions} />
    </div>
  )
}