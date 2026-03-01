export const runtime = "nodejs"

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { exportSubmissionToPDF } from '@/lib/export-utils'

const ALLOWED_BRANDS = ['ringomode', 'cintasign'] as const

async function getNextDocumentNumber(
  supabase: any,
  formType: string,
  date: Date
): Promise<string> {
  const dateStr = date.toISOString().split('T')[0]
  const yymmdd = dateStr.slice(2).replace(/-/g, '')

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: seq } = await supabase
      .from('document_sequences')
      .select('last_number')
      .eq('form_type', formType)
      .eq('date', dateStr)
      .maybeSingle()

    let nextNumber = 100
    if (seq) nextNumber = seq.last_number + 1

    const { error: upsertError } = await supabase
      .from('document_sequences')
      .upsert(
        { form_type: formType, date: dateStr, last_number: nextNumber },
        { onConflict: 'form_type, date' }
      )

    if (!upsertError) return `${yymmdd}-${nextNumber}`
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  throw new Error('Failed to generate document number')
}


// ============================================================================
// GET handler
// ============================================================================
export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }

  // Transform snake_case to camelCase
  const transformed = data?.map((item: any) => ({
    id: item.id,
    formType: item.form_type,
    formTitle: item.form_title,
    submittedBy: item.submitted_by,
    submittedAt: item.submitted_at,
    data: item.data,
    hasDefects: item.has_defects,
    brand: item.brand,
    isRead: item.is_read,
    documentNo: item.document_no,
  })) || [];

  return NextResponse.json(transformed)
}

// ============================================================================
// POST handler – your working version with full PDF
// ============================================================================
export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    console.log("🚀 Submission started")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('brand')
      .eq('id', user.id)
      .single()

    let brand = userData?.brand || 'ringomode'
    if (!ALLOWED_BRANDS.includes(brand as any)) brand = 'ringomode'

    const documentNo = await getNextDocumentNumber(
      supabase,
      body.formType,
      new Date()
    )

    const { data: inserted, error } = await supabase
      .from('submissions')
      .insert([{
        form_type: body.formType,
        form_title: body.formTitle,
        submitted_by: body.submittedBy,
        submitted_at: new Date().toISOString(),
        data: body.data || {},
        has_defects: body.hasDefects || false,
        brand,
        is_read: false,
        user_id: user.id,
        document_no: documentNo,
      }])
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase insert error:", error)
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
    }

    // ===============================
    // Generate full PDF
    // ===============================
    const submission = {
      id: inserted.id,
      formType: inserted.form_type,
      formTitle: inserted.form_title,
      submittedBy: inserted.submitted_by,
      submittedAt: inserted.submitted_at,
      data: inserted.data,
      hasDefects: inserted.has_defects,
      brand: inserted.brand,
      isRead: inserted.is_read,
      userId: inserted.user_id,
      documentNo: inserted.document_no,
    }
    const pdfBuffer = await exportSubmissionToPDF(submission as any, true) as Buffer

    // ===============================
    // Send to Make
    // ===============================
    const makeWebhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
    console.log("🔗 Webhook URL:", makeWebhookUrl)

    if (!makeWebhookUrl) {
      console.error("❌ MAKE WEBHOOK URL NOT SET")
    } else {
      try {
        const formData = new FormData()
        formData.append('documentNo', documentNo)
        formData.append('formTitle', body.formTitle)
        formData.append('brand', brand)
        formData.append('submittedBy', body.submittedBy)
        formData.append('submittedAt', new Date().toISOString())
        formData.append('hasDefects', body.hasDefects ? 'true' : 'false')
        formData.append('defectDetails', body.hasDefects && body.data?.defectDetails ? body.data.defectDetails : '')
        formData.append('mergedPdf[name]', 'merged-documents.pdf')
        formData.append('mergedPdf[mime]', 'application/pdf')
        formData.append(
          'mergedPdf[data]',
          new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' }),
          'merged-documents.pdf'
        )

        console.log("📤 Sending to Make...")

        const makeResponse = await fetch(makeWebhookUrl, {
          method: "POST",
          body: formData,
        })

        console.log("📡 Make status:", makeResponse.status)
        const responseText = await makeResponse.text()
        console.log("📨 Make response:", responseText)

      } catch (err) {
        console.error("❌ FETCH FAILED:", err)
      }
    }

    return NextResponse.json({ success: true, id: inserted.id }, { status: 201 })

  } catch (error) {
    console.error("❌ Unexpected error:", error)
    return NextResponse.json(
      { error: 'Failed to submit form', details: String(error) },
      { status: 500 }
    )
  }
}