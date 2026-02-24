import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Clear the brand so they have to select it again next time
    await supabase.from('users').update({ brand: null }).eq('id', user.id)
  }

  // Sign out
  await supabase.auth.signOut()

  return NextResponse.json({ success: true })
}