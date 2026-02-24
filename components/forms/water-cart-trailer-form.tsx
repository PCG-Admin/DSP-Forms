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
import { NameSelector } from "@/components/name-selector"

const ALL_INSPECTION_ITEMS: string[] = [
  "License and Phepha",
  "Number Plate",
  "Trailer Body",
  "Water Tank",
  "Hose Pipe & Nozzle",
  "Chevron, Reflectors and Tape",
  "Working Lights",
  "Trailer Plug & Electric Wiring",
  "U-Bolts",
  "Straps & Ratchets",
  "Safety Chain",
  "Tyres",
  "Wheel Rims",
  "Wheel Nuts",
  "Mud Flaps",
  "General Condition",
  "On/Off Switch",
  "Pull Start Rope",
  "Fuel Tank",
  "Fuel levels",
  "Engine Oil",
  "Air Filter",
  "Guards",
  "Pressure Hose",
  "Hose Couplings / Quick Coupler",
  "Pressure Gun",
  "Lance (Wand)"
]

const itemIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Number Plate": "license2.png",
  "Trailer Body": "cabs.png",
  "Water Tank": "cabs.png",
  "Hose Pipe & Nozzle": "hydraulic-hoses.png",
  "Chevron, Reflectors and Tape": "led.png",
  "Working Lights": "led.png",
  "Trailer Plug & Electric Wiring": "wiring.png",
  "U-Bolts": "wheel-nut.png",
  "Straps & Ratchets": "tie-down.png",
  "Safety Chain": "tow-hitch.png",
  "Tyres": "types-spares.png",
  "Wheel Rims": "wheel-nut.png",
  "Wheel Nuts": "wheel-nut.png",
  "Mud Flaps": "mud-flap.png",
  "General Condition": "wipes.png",
  "On/Off Switch": "wiring.png",
  "Pull Start Rope": "fan-belt.png",
  "Fuel Tank": "fuel-oil-levels.png",
  "Fuel levels": "fuel-oil-levels.png",
  "Engine Oil": "oil-fluid-air-level.png",
  "Air Filter": "air-pre-cleaner.png",
  "Guards": "protective-structure.png",
  "Pressure Hose": "hydraulic-hoses.png",
  "Hose Couplings / Quick Coupler": "hydraulic-hoses.png",
  "Pressure Gun": "hydraulic-controls.png",
  "Lance (Wand)": "boom-structure.png"
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
interface WaterCartTrailerFormProps {
  brand: 'ringomode' | 'cintasign'
}

export function WaterCartTrailerForm({ brand }: WaterCartTrailerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    userName: "",
    registrationNumber: "",
    date: new Date().toISOString().split("T")[0],
  })

  // State for the next document number fetched from server
  const [nextNumber, setNextNumber] = useState<number | null>(null)

  // Fetch next document number on mount
  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        const res = await fetch('/api/next-document?formType=water-cart-trailer')
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
    if (!formData.userName || !formData.registrationNumber) { toast.error("Please fill in all required fields"); return }
    if (!allItemsChecked) { toast.error("Please check all inspection items"); return }
    if (!signatureImage) { toast.error("Please provide your signature"); return }
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/submissions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          formType: "water-cart-trailer",
          formTitle: "Water Cart Trailer & Pressure Washer Checklist",
          submittedBy: formData.userName,
          hasDefects,
          brand: brand,
          data: { ...formData, items, hasDefects, defectDetails, signature: signatureImage } // documentNo NOT included
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
            <BrandLogo brand={brand} width={160} height={50} />
          </div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">HSE Management System</div>
          <CardTitle className="text-xl text-foreground">Water Cart Trailer & Pressure Washer Checklist</CardTitle>
          <CardDescription>Document Ref: HSEMS/8.1.19/REG/015 | Rev. 2 | 23.03.2020</CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-amber-600" /><CardTitle className="text-sm font-semibold text-amber-800">General Instructions for Checklist:</CardTitle></div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700">The driver is to conduct a 10 minute physical walkabout of the vehicle on a daily basis and assess the condition of the vehicle.</p>
          <p className="mt-2 text-sm text-amber-700">Outcome to be detailed with an "Ok" if in order and a "Def" if defective. Defective outcomes to be documented below.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base text-foreground">User Information</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {/* User name dropdown */}
          <NameSelector
            brand={brand}
            value={formData.userName}
            onChange={(val) => setFormData(p => ({ ...p, userName: val }))}
            label="Users name"
            required
            placeholder="Select user name"
          />

          {/* Document number field – read‑only, now shows actual next number */}
          <div className="space-y-2">
            <Label htmlFor="documentNo">Document No.</Label>
            <Input id="documentNo" value={documentNo} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration number <span className="text-destructive">*</span></Label>
            <Input id="registrationNumber" value={formData.registrationNumber} onChange={e => setFormData(p => ({ ...p, registrationNumber: e.target.value }))} placeholder="e.g. TRL-001" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} />
          </div>
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
        <div><span className="font-semibold">Document Reference No.</span><br />HSEMS / 8.1.19 / REG / 015</div>
        <div><span className="font-semibold">Author</span><br />HSE Manager</div>
        <div><span className="font-semibold">Revision</span><br />2</div>
        <div><span className="font-semibold">Creation Date</span><br />23.03.2020</div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" asChild><Link href="/">Cancel</Link></Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Send className="h-4 w-4" />{isSubmitting ? "Submitting..." : "Submit Checklist"}</Button>
      </div>
    </form>
  )
}