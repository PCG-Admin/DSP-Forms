export const runtime = "nodejs"

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { rateLimit, STRICT_LIMIT, getClientIp } from '@/lib/rate-limit'
import { logSecurityEvent } from '@/lib/security-logger'
import { logAuditEvent } from '@/lib/audit-logger'

const ALLOWED_BRANDS = ['ringomode', 'cintasign'] as const
const ALLOWED_ROLES  = ['admin', 'user'] as const

/** Enforce password complexity: min 8 chars, upper, lower, digit */
function validatePassword(password: string): string | null {
  if (password.length < 8)         return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password))     return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(password))     return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(password))     return 'Password must contain at least one number'
  return null
}

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

  try {
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
  } catch (err: any) {
    console.error('[GET /api/users] Unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch users' }, { status: 500 })
  }
}

// ─── POST /api/users ──────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rl = rateLimit(`users:create:${ip}`, STRICT_LIMIT)
  if (!rl.allowed) {
    logSecurityEvent({ event: 'RATE_LIMIT_HIT', ip, path: '/api/users', details: 'POST user creation' })
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const adminUser = await requireAdmin()
  if (!adminUser) {
    logSecurityEvent({ event: 'UNAUTHORIZED_ACCESS', ip, path: '/api/users', details: 'POST without admin role' })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { email, password, role, brand } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    logSecurityEvent({ event: 'INVALID_INPUT', ip, path: '/api/users', details: 'Invalid email format' })
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Enforce password policy
  const passwordError = validatePassword(password)
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 })
  }

  if (role && !ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }
  if (brand && !ALLOWED_BRANDS.includes(brand)) {
    return NextResponse.json({ error: 'Invalid brand' }, { status: 400 })
  }

  try {
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

    logSecurityEvent({ event: 'USER_CREATED', ip, userId: adminUser.id, details: `Created user ${email} with role ${role ?? 'user'}` })
    await logAuditEvent({ adminId: adminUser.id, adminEmail: adminUser.email, action: 'CREATE_USER', targetId: userId, targetEmail: email, details: { role: role ?? 'user', brand: brand ?? null } })
    return NextResponse.json({ success: true, id: userId }, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/users] Unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 })
  }
}

// ─── PATCH /api/users ─────────────────────────────────────────────────────────
export async function PATCH(request: Request) {
  const adminUser = await requireAdmin()
  if (!adminUser) {
    logSecurityEvent({ event: 'UNAUTHORIZED_ACCESS', ip: 'unknown', path: '/api/users', details: 'PATCH without admin role' })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, role, brand, password } = body

  if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 })
  if (role && !ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }
  if (brand && !ALLOWED_BRANDS.includes(brand)) {
    return NextResponse.json({ error: 'Invalid brand' }, { status: 400 })
  }
  if (password) {
    const passwordError = validatePassword(password)
    if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 })
  }

  const admin = adminClient()

  // Update password via auth admin if provided
  if (password) {
    const { error: authError } = await admin.auth.admin.updateUserById(id, { password })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
    await logAuditEvent({ adminId: adminUser?.id, adminEmail: adminUser?.email, action: 'CHANGE_PASSWORD', targetId: id })
    if (!role && !brand) return NextResponse.json({ success: true })
  }

  const profileUpdates: Record<string, string> = {}
  if (role)  profileUpdates.role  = role
  if (brand) profileUpdates.brand = brand

  if (Object.keys(profileUpdates).length > 0) {
    const { error } = await admin.from('users').update(profileUpdates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (role)  await logAuditEvent({ adminId: adminUser?.id, adminEmail: adminUser?.email, action: 'CHANGE_ROLE',  targetId: id, details: { newRole: role } })
    if (brand) await logAuditEvent({ adminId: adminUser?.id, adminEmail: adminUser?.email, action: 'CHANGE_BRAND', targetId: id, details: { newBrand: brand } })
  }

  return NextResponse.json({ success: true })
}

// ─── DELETE /api/users?id=xxx ─────────────────────────────────────────────────
export async function DELETE(request: Request) {
  const ip = getClientIp(request)
  const adminUser = await requireAdmin()
  if (!adminUser) {
    logSecurityEvent({ event: 'UNAUTHORIZED_ACCESS', ip, path: '/api/users', details: 'DELETE without admin role' })
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

  logSecurityEvent({ event: 'USER_DELETED', ip, userId: adminUser.id, details: `Deleted user id=${id}` })
  await logAuditEvent({ adminId: adminUser.id, adminEmail: adminUser.email, action: 'DELETE_USER', targetId: id })
  return NextResponse.json({ success: true })
}
