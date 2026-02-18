"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type CheckStatus } from "@/lib/types"
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BrandLogo } from '@/components/brand-logo';

// ============================================================================
// INSPECTION ITEMS – flat list from the PDF
// ============================================================================
const ALL_INSPECTION_ITEMS: string[] = [
  // A. Attachments (Head)
  "A1. Hangar link / spacers (Figure 8).",
  "A2. Check all grease nipples functional / greasing adequate.",
  "A3. Check harvester head frame / tilt frame for cracks and wear.",
  "A4. Check H frame bushing.",
  "A5. Check all pins / bushes secure.",
  "A6. Knife and roller edges sharp.",
  "A7. Check delimbing knife condition",
  "A8. Check knife stoppers.",
  "A9. Roller motor bypass.",
  "A10. Fasten and tighten feed motor and feed rollers.",
  "A11. Check feed roller condition.",
  "A12. Check feed roller stoppers.",
  "A13. All covers secure.",
  "A14. Check for hydraulic oil leaks.",
  "A15. Tighten all shaft and pin locks.",
  "A16. Check measurement sensor and chain.",
  "A17. Check saw bar movement limits.",
  "A18. Check chain tensioner condition.",
  "A19. Check cutter bar tank secure.",
  "A20. Check all cylinders / bearing condition.",
  "A21. Check rotator bolts.",
  // B. Attachments (Grab)
  "B1. Hangar link / spacers (Figure 8).",
  "B2. Check all grease nipples functional / greasing adequate.",
  "B3. Check rotator bolts and tighten.",
  "B4. Check for hydraulic oil leaks.",
  "B5. Check grapple frame and tynes for cracks and wear.",
  "B6. Grab tynes functional.",
  "B7. Tynes stoppers.",
  "B8. Check all pins / bushes secure.",
  "B9. Check all pin locks.",
  "B10. Check pipe condition for chaffing and routing.",
  "B11. Grease nipples functional.",
  // C. Attachments (Winch)
  "C1. Mountings.",
  "C2. Greasing adequate.",
  "C3. Oil leaks.",
  "C4. Condition.",
  "C5. Cables and chains.",
  "C6. Roller guides.",
  "C7. Cab controls condition.",
]

interface SimpleItemRowProps {
  item: string
  value: CheckStatus
  onChange: (value: CheckStatus) => void
}

function SimpleItemRow({ item, value, onChange }: SimpleItemRowProps) {
  const isSelected = (status: CheckStatus) => value === status
  return (
    <div className="grid grid-cols-[1fr_auto] items-center border-b border-gray-200 last:border-0">
      <div className="py-3 pr-4">
        <span className="text-sm font-medium text-foreground">{item}</span>
      </div>
      <div className="py-3 pl-4 flex items-center gap-2">
        <Button
          type="button"
          variant={isSelected("ok") ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(isSelected("ok") ? null : "ok")}
          className={`w-16 ${isSelected("ok") ? "bg-green-600 hover:bg-green-700" : ""}`}
        >
          OK
        </Button>
        <Button
          type="button"
          variant={isSelected("def") ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(isSelected("def") ? null : "def")}
          className={`w-16 ${isSelected("def") ? "bg-red-600 hover:bg-red-700" : ""}`}
        >
          DEF
        </Button>
        <Button
          type="button"
          variant={isSelected("na") ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(isSelected("na") ? null : "na")}
          className={`w-16 ${isSelected("na") ? "bg-gray-600 hover:bg-gray-700" : ""}`}
        >
          N/A
        </Button>
      </div>
    </div>
  )
}

export function DailyAttachmentChecklistForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    mechanicsName: "",
    harvesterNumber: "",
    harvesterHours: "",
    date: new Date().toISOString().split("T")[0],
  })

  const documentNo = useMemo(() => {
    const d = new Date()
    return `DA-${d.getFullYear().toString().slice(-2)}${(d.getMonth()+1).toString().padStart(2,"0")}${d.getDate().toString().padStart(2,"0")}-${Math.floor(Math.random()*1000).toString().padStart(3,"0")}`
  }, [])

  const [items, setItems] = useState<Record<string, CheckStatus>>(
    Object.fromEntries(ALL_INSPECTION_ITEMS.map(item => [item, null]))
  )
  const [defectDetails, setDefectDetails] = useState("")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureImage, setSignatureImage] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const width = 400, height = 120
    canvas.width = width; canvas.height = height
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#000000"
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, width - 1, height - 1)
  }, [])

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ("touches" in e) {
      const touch = e.touches[0]
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY }
    } else {
      return { x: e.nativeEvent.offsetX * scaleX, y: e.nativeEvent.offsetY * scaleY }
    }
  }

  const startDrawing = (e: any) => { e.preventDefault(); setIsDrawing(true); const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return; ctx.beginPath(); const { x, y } = getCanvasCoordinates(e); ctx.moveTo(x, y) }
  const draw = (e: any) => { e.preventDefault(); if (!isDrawing) return; const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return; const { x, y } = getCanvasCoordinates(e); ctx.lineTo(x, y); ctx.stroke() }
  const stopDrawing = () => { setIsDrawing(false); if (canvasRef.current) setSignatureImage(canvasRef.current.toDataURL("image/png")) }
  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1)
    setSignatureImage(null)
  }

  const hasDefects = useMemo(() => Object.values(items).some(s => s === "def"), [items])
  const allItemsChecked = useMemo(() => Object.values(items).every(s => s !== null), [items])
  const checkedCount = useMemo(() => Object.values(items).filter(s => s !== null).length, [items])
  const handleItemChange = (label: string, value: CheckStatus) => setItems(prev => ({ ...prev, [label]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.mechanicsName || !formData.harvesterNumber) {
      toast.error("Please fill in all required fields")
      return
    }
    if (!allItemsChecked) {
      toast.error("Please check all inspection items")
      return
    }
    if (!signatureImage) {
      toast.error("Please provide your signature")
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/submissions", {
        method: "POST", headers: { "Content-Type": "application/json" },
         credentials: "include", 
        body: JSON.stringify({
          formType: "daily-attachment-checklist",
          formTitle: "Daily Attachment Checklist",
          submittedBy: formData.mechanicsName,
          hasDefects,
          data: { ...formData, documentNo, items, hasDefects, defectDetails, signature: signatureImage }
        })
      })
      if (response.ok) { toast.success("Checklist submitted successfully!"); router.push("/") }
      else toast.error("Failed to submit checklist")
    } catch { toast.error("An error occurred. Please try again.") } finally { setIsSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 p-4 pb-12 lg:p-8 lg:pb-16">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3">
            <BrandLogo width={160} height={50} />
          </div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">HSE Management System</div>
          <CardTitle className="text-xl text-foreground">Daily Attachment Checklist</CardTitle>
          <CardDescription>Document Ref: HSEMS/8.1.19/REG/012 | Rev. 10 | 03.07.2024</CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-amber-600" /><CardTitle className="text-sm font-semibold text-amber-800">General Instructions for Checklist:</CardTitle></div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700">The mechanic is to conduct a daily inspection of the attachments and assess their condition.</p>
          <p className="mt-2 text-sm text-amber-700">Outcome to be detailed with an "Ok" if in order and a "Def" if defective. Defective outcomes to be documented below.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base text-foreground">Mechanic Information</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="mechanicsName">Mechanics name <span className="text-destructive">*</span></Label><Input id="mechanicsName" value={formData.mechanicsName} onChange={e => setFormData(p=>({...p, mechanicsName:e.target.value}))} placeholder="Enter mechanic name" required /></div>
          <div className="space-y-2"><Label htmlFor="documentNo">Document No.</Label><Input id="documentNo" value={documentNo} readOnly className="bg-muted" /></div>
          <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" value={formData.date} onChange={e => setFormData(p=>({...p, date:e.target.value}))} /></div>
          <div className="space-y-2"><Label htmlFor="harvesterNumber">Harvester number <span className="text-destructive">*</span></Label><Input id="harvesterNumber" value={formData.harvesterNumber} onChange={e => setFormData(p=>({...p, harvesterNumber:e.target.value}))} placeholder="e.g. H-001" required /></div>
          <div className="space-y-2"><Label htmlFor="harvesterHours">Harvester hours</Label><Input id="harvesterHours" value={formData.harvesterHours} onChange={e => setFormData(p=>({...p, harvesterHours:e.target.value}))} placeholder="e.g. 1250" /></div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <h3 className="mb-2 text-sm font-semibold text-foreground">Quick Reference:</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md bg-green-100 p-2 text-green-700">OK - In order</div>
            <div className="rounded-md bg-red-100 p-2 text-red-700">DEF - Defective</div>
            <div className="rounded-md bg-gray-100 p-2 text-gray-700">N/A - Not applicable</div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress: {checkedCount} / {ALL_INSPECTION_ITEMS.length} items checked</span>
        {allItemsChecked && <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-4 w-4" /> All items checked</span>}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(checkedCount / ALL_INSPECTION_ITEMS.length) * 100}%` }} /></div>

      <Card>
        <CardHeader><CardTitle className="text-base text-foreground">Inspection Items</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {ALL_INSPECTION_ITEMS.map(item => (
            <SimpleItemRow
              key={item}
              item={item}
              value={items[item]}
              onChange={val => handleItemChange(item, val)}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-5 w-5 text-amber-600" /> Are There Any Defects Selected</CardTitle>
          <CardDescription>If "Def" is selected, please specify defects here.</CardDescription>
        </CardHeader>
        <CardContent><Textarea value={defectDetails} onChange={e => setDefectDetails(e.target.value)} placeholder="Details of defect ..." rows={4} className="resize-none" /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base text-foreground">Signature</CardTitle><CardDescription>Draw your signature using your mouse or touchpad</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center">
            <canvas ref={canvasRef} className="w-full max-w-[400px] h-[120px] border rounded-md touch-none cursor-crosshair"
              onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
              onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} onTouchCancel={stopDrawing} />
            <div className="flex gap-2 mt-3 self-start"><Button type="button" variant="outline" size="sm" onClick={clearSignature} className="gap-2"><Eraser className="h-4 w-4" /> Clear</Button></div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground border-t pt-4">
        <div><span className="font-semibold">Document Reference No.</span><br />HSEMS / 8.1.19 / REG / 012</div>
        <div><span className="font-semibold">Author</span><br />HSE Manager</div>
        <div><span className="font-semibold">Revision</span><br />10</div>
        <div><span className="font-semibold">Creation Date</span><br />03.07.2024</div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" asChild><Link href="/">Cancel</Link></Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Send className="h-4 w-4" />{isSubmitting ? "Submitting..." : "Submit Checklist"}</Button>
      </div>
    </form>
  )
}