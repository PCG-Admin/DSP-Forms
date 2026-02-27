export const runtime = "nodejs"

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PDFDocument, StandardFonts } from 'pdf-lib'

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
// PDF Generator – now includes all inspection data with error recovery & validation
// ============================================================================
async function generatePdf(
  formType: string,
  data: any,
  documentNo: string
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = 800
  const margin = 50
  const lineHeight = 14

  const drawText = (text: string, size = 10, x = margin, isBold = false) => {
    try {
      page.drawText(text, { x, y, size, font: isBold ? bold : font })
    } catch (e) {
      console.error('Error drawing text:', text, e)
    }
    y -= size + 4
  }

  // Header
  drawText(formType.replace(/-/g, ' ') + ' Checklist', 16, margin, true)
  y -= 5
  drawText(`Document No: ${documentNo}`, 10, margin)
  drawText(`Date: ${data.date || new Date().toLocaleDateString()}`, 10, margin)
  y -= 10

  // Operator Information (two columns)
  drawText('Operator Information', 12, margin, true)
  y -= 5

  const fields = [
    ['Operator Name', data.operatorName || data.driverName || data.userName || ''],
    ['Shift', data.shift || ''],
    ['Unit Number', data.unitNumber || ''],
    ['Hour Meter Start', data.hourMeterStart || ''],
    ['Hour Meter Stop', data.hourMeterStop || ''],
    ['Valid Training Card', data.validTrainingCard || ''],
    ['Defects', data.defectDetails || 'None'],
  ]

  const col1X = margin
  const col2X = 300

  for (let i = 0; i < fields.length; i += 2) {
    const [label1, value1] = fields[i]
    const [label2, value2] = fields[i + 1] || ['', '']
    page.drawText(`${label1}: ${value1}`, { x: col1X, y, size: 10, font })
    if (label2) page.drawText(`${label2}: ${value2}`, { x: col2X, y, size: 10, font })
    y -= lineHeight
  }
  y -= 10

  // Inspection Items (table)
  drawText('Inspection Items', 12, margin, true)
  y -= 5
  page.drawText('Item', { x: margin, y, size: 10, font: bold })
  page.drawText('Status', { x: 400, y, size: 10, font: bold })
  y -= lineHeight

  if (data.items && Object.keys(data.items).length > 0) {
    for (const [key, value] of Object.entries(data.items)) {
      if (y < 100) {
        page = pdfDoc.addPage([595, 842])
        y = 800
      }
      page.drawText(key, { x: margin, y, size: 9, font })
      page.drawText(String(value), { x: 400, y, size: 9, font })
      y -= lineHeight - 2
    }
  } else {
    page.drawText('No inspection items', { x: margin, y, size: 10, font })
    y -= lineHeight
  }
  y -= 10

  // Signature – with error recovery
  if (data.signature) {
    try {
      const base64Data = data.signature.split(',')[1]
      if (!base64Data) throw new Error('Invalid base64 signature')
      const signatureImage = await pdfDoc.embedPng(Buffer.from(base64Data, 'base64'))
      drawText('Signature:', 12, margin, true)
      y -= 5
      page.drawImage(signatureImage, { x: margin, y: y - 60, width: 200, height: 60 })
    } catch (e) {
      console.error('❌ Signature embedding failed – continuing without signature:', e)
      drawText('Signature: (failed to embed)', 10, margin)
    }
  }

  // --- Save and validate the PDF ---
  const pdfBytes = await pdfDoc.save()
  console.log('✅ Raw PDF length:', pdfBytes.length)

  try {
    await PDFDocument.load(pdfBytes)
    console.log('✅ PDF validation passed – file is structurally sound')
  } catch (validateErr) {
    console.error('❌ PDF validation FAILED – generated file is corrupt:', validateErr)
    // Fallback: return a minimal valid PDF
    const fallbackDoc = await PDFDocument.create()
    const fallbackPage = fallbackDoc.addPage([595, 842])
    fallbackPage.drawText('Error generating complete PDF. Please contact support.', {
      x: 50,
      y: 400,
      size: 12,
      font: await fallbackDoc.embedFont(StandardFonts.Helvetica),
    })
    const fallbackBytes = await fallbackDoc.save()
    return Buffer.from(fallbackBytes)
  }

  return Buffer.from(pdfBytes)
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
  return NextResponse.json(data)
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
    const pdfBuffer = await generatePdf(body.formType, body.data, documentNo)
    const hexString = pdfBuffer.toString('hex')

    const mergedPdf = {
      name: 'merged-documents.pdf',
      mime: 'application/pdf',
      data: `IMTBuffer(${pdfBuffer.length}, binary, ${hexString.slice(0, 32)}): ${hexString}`
    }

    // ===============================
    // Send to Make
    // ===============================
    const makeWebhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
    console.log("🔗 Webhook URL:", makeWebhookUrl)

    if (!makeWebhookUrl) {
      console.error("❌ MAKE WEBHOOK URL NOT SET")
    } else {
      try {
        const payload = {
          documentNo,
          formTitle: body.formTitle,
          brand,
          submittedBy: body.submittedBy,
          submittedAt: new Date().toISOString(),
          mergedPdf
        }

        console.log("📤 Sending to Make...")

        const makeResponse = await fetch(makeWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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