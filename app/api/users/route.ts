export const runtime = "nodejs"

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const ALLOWED_BRANDS = ['ringomode', 'cintasign'] as const
const ALLOWED_ROLES  = ['admin', 'user'] as const

/** Service-role client – can call auth.admin.* */
function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** Verify the calling user is an admin. Returns the supabase user or null. */
async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (data?.role !== 'admin') return null
  return user
}

// ─── GET /api/users ───────────────────────────────────────────────────────────
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = adminClient()

  // Fetch all auth users
  const { data: authData, error: authError } = await admin.auth.admin.listUsers()
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  // Fetch all profile rows
  const { data: profiles } = await admin.from('users').select('id, role, brand')
  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]))

  const users = authData.users.map((u: any) => {
    const profile = profileMap.get(u.id)
    return {
      id: u.id,
      email: u.email,
      role: profile?.role ?? 'user',
      brand: profile?.brand ?? null,
      createdAt: u.created_at,
    }
  })

  return NextResponse.json(users)
}

// ─── POST /api/users ──────────────────────────────────────────────────────────
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { email, password, role, brand } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }
  if (role && !ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }
  if (brand && !ALLOWED_BRANDS.includes(brand)) {
    return NextResponse.json({ error: 'Invalid brand' }, { status: 400 })
  }

  const admin = adminClient()

  // Create auth user (auto-confirm so they can log in immediately)
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id

  // Upsert profile row
  const username = email.split('@')[0]
  const { error: profileError } = await admin.from('users').upsert({
    id: userId,
    username,
    role: role ?? 'user',
    brand: brand ?? null,
  })
  if (profileError) {
    // Rollback auth user to avoid orphans
    await admin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: userId }, { status: 201 })
}

// ─── PATCH /api/users ─────────────────────────────────────────────────────────
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, role, brand } = body

  if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 })
  if (role && !ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }
  if (brand && !ALLOWED_BRANDS.includes(brand)) {
    return NextResponse.json({ error: 'Invalid brand' }, { status: 400 })
  }

  const admin = adminClient()
  const updates: Record<string, string> = {}
  if (role)  updates.role  = role
  if (brand) updates.brand = brand

  const { error } = await admin.from('users').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

// ─── DELETE /api/users?id=xxx ─────────────────────────────────────────────────
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 })

  const admin = adminClient()

  // Delete profile first, then auth user
  await admin.from('users').delete().eq('id', id)
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
