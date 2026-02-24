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
import { BrandLogo } from "@/components/brand-logo"
// NameSelector imported but not used in this form (no person name field)
import { NameSelector } from "@/components/name-selector"

// ============================================================================
// INSPECTION ITEMS – flat list of all items from the PDF
// ============================================================================
const ALL_INSPECTION_ITEMS: string[] = [
  // A. Engine
  "A1. Conditions/cleanliness",
  "A2. Leaks (water, oil, or fuel)",
  "A3. Fluid levels",
  "A4. Starter function",
  "A5. Engine guards",
  "A6. Belts",
  "A7. Radiator hoses and cap",

  // B. Chassis / Frame / Cab
  "B1. Condition and cleanliness",
  "B2. Seats",
  "B3. Doors and locks",
  "B4. Windscreen / Windows",
  "B5. Mirrors",
  "B6. Chassis cracks",
  "B7. FOPS / ROPS",
  "B8. Headboards / Uprights",
  "B9. Jockey wheel / Load stand (trailer)",
  "B10. Tow bar and eye and tow hook",

  // C. Transmission (Drive Train)
  "C1. Clutch operations and hydraulics",
  "C2. Propshaft, U and CV joints",
  "C3. Diff and final drives (guards)",
  "C4. Oil leaks",
  "C5. Oscillation",
  "C6. Bogey greasing",

  // D. Electrics
  "D1. Lights",
  "D2. Hooter",
  "D3. Wiper",
  "D4. Battery - secure",
  "D5. Rotating light",
  "D6. Two way radio",

  // E. Brakes
  "E1. Hydraulic leaks / levels",
  "E2. Brake lines / hoses / levers",
  "E3. Exhaust brake",
  "E4. Service brake",
  "E5. Handbrake",
  "E6. Retarder emergency stop",
  "E7. Air pressure gauges",

  // F. Wheels
  "F1. Tyres, rims and spares",
  "F2. Tyre air pressure",
  "F3. Studs and nuts",
  "F4. Tracks / rollers / sprockets",
  "F5. Wheel bearings",
  "F6. Steering - free play",

  // G. Exhaust
  "G1. Leaks",
  "G2. Brackets",
  "G3. Soot",

  // H. Hydraulics
  "H1. No cracks on pipes and fittings",
  "H2. Hydraulic pipes and fittings secure",
  "H3. Hydraulic brackets",
  "H4. Oil leaks",
  "H5. Cylinders",
  "H6. Pins / bushes",

  // I. Safety & Emergency
  "I1. Safety belt",
  "I2. Reverse alarm",
  "I3. Fire extinguisher / suppression",
  "I4. Chocks x 2",
  "I5. Emergency triangles x 2",

  // J. Attachments (Grab)
  "J1. Hangar link / spacers",
  "J2. Greasing adequate",
  "J3. Rotator",
  "J4. Oil leaks",
  "J5. Cracks / wear",
  "J6. Pins / bushes",
  "J7. Grab tines",

  // K. Attachments (Head)
  "K1. Hangar link / spacers",
  "K2. All grease nipples functional / greasing adequate",
  "K3. Rotator",
  "K4. Oil leaks",
  "K5. Cracks / wear",
  "K6. Pins / bushes",
  "K7. Knives and rollers sharp",
  "K8. Rollers / motors / bypass",
  "K9. Saw motor / chain guard and cutter bar pump",
  "K10. Covers secure",

  // L. Attachments (Winch)
  "L1. Mountings",
  "L2. Greasing adequate",
  "L3. Oil leaks",
  "L4. Condition",
  "L5. Cables and chains",
  "L6. Roller guides",

  // M. Crane / Boom
  "M1. Greasing adequate",
  "M2. Cracks",
  "M3. Pins / bushes",
  "M4. Nose cone",
  "M5. Main pin",
]

// ============================================================================
// PER‑ITEM ICON MAPPING – reuse existing icons as much as possible
// ============================================================================
const itemIconMap: Record<string, string> = {
  // A
  "A1. Conditions/cleanliness": "wipes.png",
  "A2. Leaks (water, oil, or fuel)": "fuel-leaks.png",
  "A3. Fluid levels": "oil-fluid-air-level.png",
  "A4. Starter function": "battery.png",
  "A5. Engine guards": "protective-structure.png",
  "A6. Belts": "fan-belt.png",
  "A7. Radiator hoses and cap": "radiator.png",

  // B
  "B1. Condition and cleanliness": "wipes.png",
  "B2. Seats": "seats.png",
  "B3. Doors and locks": "cabs.png",
  "B4. Windscreen / Windows": "wipes.png",
  "B5. Mirrors": "mirrors2.png",
  "B6. Chassis cracks": "boom-structure.png",
  "B7. FOPS / ROPS": "protective-structure.png",
  "B8. Headboards / Uprights": "boom-structure.png",
  "B9. Jockey wheel / Load stand (trailer)": "wheel-nut.png",
  "B10. Tow bar and eye and tow hook": "tow-hitch.png",

  // C
  "C1. Clutch operations and hydraulics": "clutch.png",
  "C2. Propshaft, U and CV joints": "differentials.png",
  "C3. Diff and final drives (guards)": "differentials.png",
  "C4. Oil leaks": "fuel-leaks.png",
  "C5. Oscillation": "boom-structure.png",
  "C6. Bogey greasing": "grease.png",

  // D
  "D1. Lights": "led.png",
  "D2. Hooter": "hooters.png",
  "D3. Wiper": "wipes.png",
  "D4. Battery - secure": "battery.png",
  "D5. Rotating light": "rotating-light.png",
  "D6. Two way radio": "communication.png",

  // E
  "E1. Hydraulic leaks / levels": "fuel-leaks.png",
  "E2. Brake lines / hoses / levers": "foot-brake.png",
  "E3. Exhaust brake": "exhaust.png",
  "E4. Service brake": "foot-brake.png",
  "E5. Handbrake": "hand-brake.png",
  "E6. Retarder emergency stop": "hand-brake.png",
  "E7. Air pressure gauges": "gauges.png",

  // F
  "F1. Tyres, rims and spares": "types-spares.png",
  "F2. Tyre air pressure": "types-spares.png",
  "F3. Studs and nuts": "wheel-nut.png",
  "F4. Tracks / rollers / sprockets": "tracks-sprockets.png",
  "F5. Wheel bearings": "wheel-nut.png",
  "F6. Steering - free play": "steering-column.png",

  // G
  "G1. Leaks": "fuel-leaks.png",
  "G2. Brackets": "boom-structure.png",
  "G3. Soot": "exhaust.png",

  // H
  "H1. No cracks on pipes and fittings": "hydraulic-hoses.png",
  "H2. Hydraulic pipes and fittings secure": "hydraulic-hoses.png",
  "H3. Hydraulic brackets": "hydraulic-controls.png",
  "H4. Oil leaks": "fuel-leaks.png",
  "H5. Cylinders": "hydraulic-cylinders.png",
  "H6. Pins / bushes": "boom-structure.png",

  // I
  "I1. Safety belt": "safety-belt.png",
  "I2. Reverse alarm": "hooters.png",
  "I3. Fire extinguisher / suppression": "fire-extinguisher.png",
  "I4. Chocks x 2": "wheel-nut.png",
  "I5. Emergency triangles x 2": "emergency-triangle.png",

  // J
  "J1. Hangar link / spacers": "boom-structure.png",
  "J2. Greasing adequate": "grease.png",
  "J3. Rotator": "hydraulic-controls.png",
  "J4. Oil leaks": "fuel-leaks.png",
  "J5. Cracks / wear": "boom-structure.png",
  "J6. Pins / bushes": "boom-structure.png",
  "J7. Grab tines": "boom-structure.png",

  // K
  "K1. Hangar link / spacers": "boom-structure.png",
  "K2. All grease nipples functional / greasing adequate": "grease.png",
  "K3. Rotator": "hydraulic-controls.png",
  "K4. Oil leaks": "fuel-leaks.png",
  "K5. Cracks / wear": "boom-structure.png",
  "K6. Pins / bushes": "boom-structure.png",
  "K7. Knives and rollers sharp": "cutting-bar.png",
  "K8. Rollers / motors / bypass": "hydraulic-cylinders.png",
  "K9. Saw motor / chain guard and cutter bar pump": "cutting-bar.png",
  "K10. Covers secure": "protective-structure.png",

  // L
  "L1. Mountings": "boom-structure.png",
  "L2. Greasing adequate": "grease.png",
  "L3. Oil leaks": "fuel-leaks.png",
  "L4. Condition": "wipes.png",
  "L5. Cables and chains": "winch.png",
  "L6. Roller guides": "tracks-sprockets.png",

  // M
  "M1. Greasing adequate": "grease.png",
  "M2. Cracks": "boom-structure.png",
  "M3. Pins / bushes": "boom-structure.png",
  "M4. Nose cone": "boom-structure.png",
  "M5. Main pin": "boom-structure.png",
}

interface ItemRowProps {
  item: string
  value: CheckStatus
  onChange: (value: CheckStatus) => void
  iconSrc: string
}

function ItemRow({ item, value, onChange, iconSrc }: ItemRowProps) {
  const isSelected = (status: CheckStatus) => value === status
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center border-b border-gray-200 last:border-0">
      <div className="py-3 pr-4 border-r border-gray-200">
        <span className="text-sm font-medium text-foreground">{item}</span>
      </div>
      <div className="py-3 px-4 border-r border-gray-200 bg-gray-50 flex justify-center w-[150px]">
        <Image src={iconSrc} alt={item} width={150} height={150} className="object-contain" />
      </div>
      <div className="py-3 pl-4 flex items-center gap-2">
        <Button type="button" variant={isSelected("ok") ? "default" : "outline"} size="sm"
          onClick={() => onChange(isSelected("ok") ? null : "ok")}
          className={`w-16 ${isSelected("ok") ? "bg-green-600 hover:bg-green-700" : ""}`}>OK</Button>
        <Button type="button" variant={isSelected("def") ? "default" : "outline"} size="sm"
          onClick={() => onChange(isSelected("def") ? null : "def")}
          className={`w-16 ${isSelected("def") ? "bg-red-600 hover:bg-red-700" : ""}`}>DEF</Button>
        <Button type="button" variant={isSelected("na") ? "default" : "outline"} size="sm"
          onClick={() => onChange(isSelected("na") ? null : "na")}
          className={`w-16 ${isSelected("na") ? "bg-gray-600 hover:bg-gray-700" : ""}`}>N/A</Button>
      </div>
    </div>
  )
}

// ============================================================================
// PROPS INTERFACE
// ============================================================================
interface WeeklyMachineryConditionFormProps {
  brand: 'ringomode' | 'cintasign'
}

export function WeeklyMachineryConditionForm({ brand }: WeeklyMachineryConditionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    vehicleEquipment: "",
    registrationNumber: "",
    week: "",
    date: new Date().toISOString().split("T")[0],
    kmsHrs: "",
  })

  // State for the next document number fetched from server
  const [nextNumber, setNextNumber] = useState<number | null>(null)

  // Fetch next document number on mount
  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        const res = await fetch('/api/next-document?formType=weekly-machinery-condition')
        if (res.ok) {
          const data = await res.json()
          setNextNumber(data.nextNumber)
        } else {
          console.error('Failed to fetch next document number')
        }
      } catch (error) {
        console.error('Error fetching next document number:', error)
      }
    }
    fetchNextNumber()
  }, [])

  // Compute the document number using the fetched next number, falling back to 100 if not yet loaded
  const documentNo = useMemo(() => {
    const d = new Date()
    const yymmdd = `${d.getFullYear().toString().slice(-2)}${(d.getMonth()+1).toString().padStart(2,"0")}${d.getDate().toString().padStart(2,"0")}`
    const num = nextNumber !== null ? nextNumber : 100
    return `${yymmdd}-${num}`
  }, [nextNumber])

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
    if (!formData.vehicleEquipment) { toast.error("Please fill in all required fields"); return }
    if (!allItemsChecked) { toast.error("Please check all inspection items"); return }
    if (!signatureImage) { toast.error("Please provide your signature"); return }
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/submissions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          formType: "weekly-machinery-condition",
          formTitle: "Weekly Machinery Condition Assessment",
          submittedBy: formData.vehicleEquipment,
          hasDefects,
          brand: brand,
          data: { ...formData, items, hasDefects, defectDetails, signature: signatureImage } // documentNo NOT included
        })
      })
      if (response.ok) {
        // Fire‑and‑forget webhook call to Make (DocuWare integration)
        const makeWebhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
        if (makeWebhookUrl) {
          fetch(makeWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              formTitle: "Weekly Machinery Condition Assessment",
              documentNo,
              brand,
              submittedBy: formData.vehicleEquipment,
              submittedAt: new Date().toISOString(),
              hasDefects,
              defectDetails,
              inspectionData: items, // object mapping each item to its status
            }),
          }).catch(err => console.error('Webhook error:', err))
        }
        toast.success("Assessment submitted successfully!")
        router.push("/")
      } else toast.error("Failed to submit assessment")
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
            <BrandLogo brand={brand} width={160} height={50} />
          </div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">HSE Management System</div>
          <CardTitle className="text-xl text-foreground">Weekly Machinery Condition Assessment</CardTitle>
          <CardDescription>Document Ref: HSEMS/8.1.19/DOC/011 | Rev. 10 | 01.05.2023</CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-amber-600" /><CardTitle className="text-sm font-semibold text-amber-800">General Instructions for Checklist:</CardTitle></div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700">The operator is to conduct a thorough weekly assessment of the machinery and document any defects.</p>
          <p className="mt-2 text-sm text-amber-700">Outcome to be detailed with an "Ok" if in order and a "Def" if defective. Defective outcomes to be documented below.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base text-foreground">Equipment Information</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="vehicleEquipment">Vehicle / Equipment <span className="text-destructive">*</span></Label><Input id="vehicleEquipment" value={formData.vehicleEquipment} onChange={e => setFormData(p=>({...p, vehicleEquipment:e.target.value}))} placeholder="e.g. Excavator, Truck" required /></div>

          {/* Document number field – read‑only, now shows actual next number */}
          <div className="space-y-2">
            <Label htmlFor="documentNo">Document No.</Label>
            <Input id="documentNo" value={documentNo} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2"><Label htmlFor="registrationNumber">Registration / Machine number</Label><Input id="registrationNumber" value={formData.registrationNumber} onChange={e => setFormData(p=>({...p, registrationNumber:e.target.value}))} placeholder="e.g. ABC123" /></div>
          <div className="space-y-2"><Label htmlFor="week">Week</Label><Input id="week" value={formData.week} onChange={e => setFormData(p=>({...p, week:e.target.value}))} placeholder="e.g. 12" /></div>
          <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" value={formData.date} onChange={e => setFormData(p=>({...p, date:e.target.value}))} /></div>
          <div className="space-y-2"><Label htmlFor="kmsHrs">Kms / Hrs</Label><Input id="kmsHrs" value={formData.kmsHrs} onChange={e => setFormData(p=>({...p, kmsHrs:e.target.value}))} placeholder="e.g. 1250" /></div>
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
          {ALL_INSPECTION_ITEMS.map(item => {
            const iconFile = itemIconMap[item]
            if (!iconFile) { console.warn(`No icon for ${item}`); return null }
            return <ItemRow key={item} item={item} value={items[item]} onChange={val => handleItemChange(item, val)} iconSrc={`/images/${iconFile}`} />
          })}
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
        <div><span className="font-semibold">Document Reference No.</span><br />HSEMS / 8.1.19 / DOC / 011</div>
        <div><span className="font-semibold">Author</span><br />HSE Manager</div>
        <div><span className="font-semibold">Revision</span><br />10</div>
        <div><span className="font-semibold">Creation Date</span><br />01.05.2023</div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" asChild><Link href="/">Cancel</Link></Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Send className="h-4 w-4" />{isSubmitting ? "Submitting..." : "Submit Assessment"}</Button>
      </div>
    </form>
  )
}