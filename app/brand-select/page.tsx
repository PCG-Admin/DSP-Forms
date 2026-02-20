import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BrandSelectClient from './BrandSelectClient'

export default async function BrandSelectPage() {
  const supabase = createClient()

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch user data (role and brand)
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('role, brand')
    .eq('id', user.id)
    .single()

  if (dbError || !userData) {
    // If user record doesn't exist, something's wrong – redirect to login
    console.error('No user record found:', dbError)
    redirect('/login')
  }

  // If the user is an admin, send them to admin dashboard
  if (userData.role === 'admin') {
    redirect('/admin')
  }

  // If the user already has a brand, they shouldn't be here – redirect to home
  if (userData.brand) {
    redirect('/')
  }

  // Otherwise render the client component for brand selection
  return <BrandSelectClient />
}