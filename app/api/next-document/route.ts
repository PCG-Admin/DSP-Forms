import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const formType = searchParams.get('formType')
  if (!formType) {
    return NextResponse.json({ error: 'formType is required' }, { status: 400 })
  }

  const supabase = createClient()

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const { data, error } = await supabase
    .from('document_sequences')
    .select('last_number')
    .eq('form_type', formType)
    .eq('date', today)
    .maybeSingle()

  if (error) {
    console.error('Error fetching next document number:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  const nextNumber = data ? data.last_number + 1 : 100

  return NextResponse.json({ nextNumber })
}