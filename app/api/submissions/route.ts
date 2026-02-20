import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Submission } from '@/lib/types'

const ALLOWED_BRANDS = ['ringomode', 'cintasign'] as const

export async function GET() {
  try {
    const supabase = createClient()
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Supabase GET error:', error)
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
    }

    // Transform to camelCase to match Submission type
    const transformed = submissions?.map((s: any) => ({
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

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('GET /api/submissions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions', details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('[API] No authenticated user:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's brand from the users table
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('brand')
      .eq('id', user.id)
      .single()

    if (dbError) {
      console.error('[API] Error fetching user brand:', dbError)
      return NextResponse.json({ error: 'Failed to get user profile' }, { status: 500 })
    }

    // Determine brand: from user record, or fallback
    let brand = userData?.brand
    if (!brand) {
      console.warn('[API] User has no brand set, defaulting to ringomode')
      brand = 'ringomode'
    } else if (!ALLOWED_BRANDS.includes(brand as any)) {
      console.warn('[API] Invalid brand, defaulting to ringomode')
      brand = 'ringomode'
    }

    // Validate required fields
    if (!body.formType || !body.formTitle || !body.submittedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const submission = {
      form_type: body.formType,
      form_title: body.formTitle,
      submitted_by: body.submittedBy,
      submitted_at: new Date().toISOString(),
      data: body.data || {},
      has_defects: body.hasDefects || false,
      brand: brand,
      is_read: false,
      user_id: user.id,
    }

    const { data: inserted, error } = await supabase
      .from('submissions')
      .insert([submission])
      .select()
      .single()

    if (error) {
      console.error('[API] Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: inserted.id }, { status: 201 })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form', details: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient()
    const { id } = await params

    // Check if user is admin before allowing delete
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase DELETE error:', error)
      return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/submissions/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    )
  }
}