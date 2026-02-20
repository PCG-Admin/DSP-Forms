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

// ============================================================================
// INSPECTION ITEMS – exactly as they appear in the PDF (headings only)
// ============================================================================
const ALL_INSPECTION_ITEMS: string[] = [
  "License and Phepha",
  "Body of Cab/Trailer",
  "Exhaust",
  "Steps and Rails",
  "Cab",
  "Mirrors",
  "Windscreen, Windows & Wipers",
  "Air Conditioner",
  "Seats",
  "Safety Belt",
  "Steering Column",
  "Hooter and Reverse Alarm",
  "Gauges",
  "Clutch",
  "Lamps",
  "Brakes",
  "Handbrake and Trailer Brakes (If Fitted)",
  "Battery",
  "Radiator",
  "Wiring",
  "Air Tank Drain",
  "Oil/Fluid/Air Levels",
  "Fuel, Air and Oil leaks",
  "Differentials",
  "Tyres",
  "Mud Flaps",
  "Hoses & Fittings (Air & Hydraulics)",
  "Hydraulic Controls",
  "Trailer Deck",
  "Tow Bar & Hitch/King Pin",
  "Landing Gear",
  "Anchor Points, Chains & Binders",
  "Chevron, Reflectors and Tape"
]

// ============================================================================
// PER‑ITEM ICON MAPPING – using the image filenames you provided
// ============================================================================
const itemIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Body of Cab/Trailer": "cabs.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Cab": "cabs.png",
  "Mirrors": "mirrors2.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Steering Column": "steering-column.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Clutch": "clutch.png",
  "Lamps": "led.png",
  "Brakes": "foot-brake.png",
  "Handbrake and Trailer Brakes (If Fitted)": "hand-brake.png",
  "Battery": "battery.png",
  "Radiator": "radiator.png",
  "Wiring": "wiring.png",
  "Air Tank Drain": "air-fuel-leaks.png",
  "Oil/Fluid/Air Levels": "oil-fluid-air-level.png",
  "Fuel, Air and Oil leaks": "fuel-leaks.png",
  "Differentials": "differentials.png",
  "Tyres": "types-spares.png",
  "Mud Flaps": "mud-flap.png",
  "Hoses & Fittings (Air & Hydraulics)": "hydraulic-hoses.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Trailer Deck": "boom-structure.png",
  "Tow Bar & Hitch/King Pin": "tow-hitch.png",
  "Landing Gear": "landing-gear.png",
  "Anchor Points, Chains & Binders": "anchor-points.png",
  "Chevron, Reflectors and Tape": "led.png"
}

// ============================================================================
// PER‑ITEM ROW COMPONENT – unchanged
// ============================================================================
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
        <Image
          src={iconSrc}
          alt={item}
          width={150}
          height={150}
          className="object-contain"
        />
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

// ============================================================================
// PROPS INTERFACE
// ============================================================================
interface LowbedTrailerFormProps {
  brand: 'ringomode' | 'cintasign'
}

export function LowbedTrailerForm({ brand }: LowbedTrailerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ---------- Driver Information ----------
  const [formData, setFormData] = useState({
    driverName: "",
    truckRegistration: "",
    date: new Date().toISOString().split("T")[0],
    openingKilometres: "",
    closingKilometres: "",
    validDriversLicense: "",
    trailerRegistration: "",
    pdpExpiryDate: "",
  })

  // ---------- Auto‑generate Document Number ----------
  const documentNo = useMemo(() => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `LT-${year}${month}${day}-${random}`
  }, [])

  // ---------- Inspection Items State ----------
  const [items, setItems] = useState<Record<string, CheckStatus>>(
    Object.fromEntries(ALL_INSPECTION_ITEMS.map((item) => [item, null]))
  )

  // ---------- Defect Details ----------
  const [defectDetails, setDefectDetails] = useState("")

  // ---------- Signature Pad ----------
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureImage, setSignatureImage] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = 400
    const height = 120
    canvas.width = width
    canvas.height = height

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#000000"

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1)
  }, [])

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in e) {
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    } else {
      return {
        x: e.nativeEvent.offsetX * scaleX,
        y: e.nativeEvent.offsetY * scaleY,
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    const { x, y } = getCanvasCoordinates(e)
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { x, y } = getCanvasCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setSignatureImage(canvas.toDataURL("image/png"))
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1)
    setSignatureImage(null)
  }

  // ---------- Computed Values ----------
  const hasDefects = useMemo(() => Object.values(items).some((s) => s === "def"), [items])
  const allItemsChecked = useMemo(() => Object.values(items).every((s) => s !== null), [items])
  const checkedCount = useMemo(() => Object.values(items).filter((s) => s !== null).length, [items])

  const handleItemChange = (label: string, value: CheckStatus) => {
    setItems((prev) => ({ ...prev, [label]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.driverName || !formData.truckRegistration) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!allItemsChecked) {
      toast.error("Please check all inspection items")
      return
    }

    if (hasDefects && !defectDetails.trim()) {
      toast.error("Please provide details for the defects")
      return
    }

    if (!signatureImage) {
      toast.error("Please provide your signature")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          formType: "lowbed-trailer",
          formTitle: "Lowbed And Roll Back Trailer Pre-Shift Use Inspection Checklist",
          submittedBy: formData.driverName,
          hasDefects,
          brand: brand, // ✅ use prop
          data: {
            ...formData,
            documentNo,
            items,
            hasDefects,
            defectDetails,
            signature: signatureImage,
          },
        }),
      })

      if (response.ok) {
        toast.success("Checklist submitted successfully!")
        router.push("/")
      } else {
        toast.error("Failed to submit checklist")
      }
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 p-4 pb-12 lg:p-8 lg:pb-16">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {/* ===== HEADER ===== */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3">
            <BrandLogo brand={brand} width={160} height={50} />
          </div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">HSE Management System</div>
          <CardTitle className="text-xl text-foreground">
            Lowbed And Roll Back Trailer Pre-Shift Use Inspection Checklist
          </CardTitle>
          <CardDescription>
            Document Ref: HSEMS/8.1.19/REG/020 | Rev. 2 | 27.03.2024
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ===== GENERAL INSTRUCTIONS ===== */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-semibold text-amber-800">
              General Instructions for Checklist:
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700">
            The mechanic is to conduct a 10 minute physical walkabout of the vehicle on a daily basis
            and assess the condition of the vehicle.
          </p>
          <p className="mt-2 text-sm text-amber-700">
            Outcome to be detailed with an "Ok" if in order and a "Def" if defective. Defective outcomes
            to be documented below.
          </p>
        </CardContent>
      </Card>

      {/* ===== DRIVER INFORMATION ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Driver Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="driverName">Drivers name <span className="text-destructive">*</span></Label>
            <Input
              id="driverName"
              value={formData.driverName}
              onChange={(e) => setFormData((p) => ({ ...p, driverName: e.target.value }))}
              placeholder="Enter driver name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentNo">Document No.</Label>
            <Input id="documentNo" value={documentNo} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="truckRegistration">Truck registration <span className="text-destructive">*</span></Label>
            <Input
              id="truckRegistration"
              value={formData.truckRegistration}
              onChange={(e) => setFormData((p) => ({ ...p, truckRegistration: e.target.value }))}
              placeholder="e.g. ABC 123 GP"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="openingKilometres">Opening kilometres</Label>
            <Input
              id="openingKilometres"
              type="number"
              value={formData.openingKilometres}
              onChange={(e) => setFormData((p) => ({ ...p, openingKilometres: e.target.value }))}
              placeholder="e.g. 125000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="closingKilometres">Closing kilometres</Label>
            <Input
              id="closingKilometres"
              type="number"
              value={formData.closingKilometres}
              onChange={(e) => setFormData((p) => ({ ...p, closingKilometres: e.target.value }))}
              placeholder="e.g. 125350"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validDriversLicense">Valid drivers license (exp date)</Label>
            <Input
              id="validDriversLicense"
              type="date"
              value={formData.validDriversLicense}
              onChange={(e) => setFormData((p) => ({ ...p, validDriversLicense: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trailerRegistration">Trailer registration</Label>
            <Input
              id="trailerRegistration"
              value={formData.trailerRegistration}
              onChange={(e) => setFormData((p) => ({ ...p, trailerRegistration: e.target.value }))}
              placeholder="e.g. TRL-001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdpExpiryDate">PDP expiry date</Label>
            <Input
              id="pdpExpiryDate"
              type="date"
              value={formData.pdpExpiryDate}
              onChange={(e) => setFormData((p) => ({ ...p, pdpExpiryDate: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* ===== QUICK REFERENCE ===== */}
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

      {/* ===== PROGRESS ===== */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progress: {checkedCount} / {ALL_INSPECTION_ITEMS.length} items checked
        </span>
        {allItemsChecked && (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            All items checked
          </span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(checkedCount / ALL_INSPECTION_ITEMS.length) * 100}%` }}
        />
      </div>

      {/* ===== INSPECTION ITEMS – flat list ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Inspection Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ALL_INSPECTION_ITEMS.map((item) => {
            const iconFile = itemIconMap[item]
            if (!iconFile) {
              console.warn(`No icon mapped for item: ${item}`)
              return null
            }
            return (
              <ItemRow
                key={item}
                item={item}
                value={items[item]}
                onChange={(val) => handleItemChange(item, val)}
                iconSrc={`/images/${iconFile}`}
              />
            )
          })}
        </CardContent>
      </Card>

      {/* ===== DEFECTS SECTION (always visible) ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Are There Any Defects Selected
          </CardTitle>
          <CardDescription>
            If "Def" is selected, please specify defects here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={defectDetails}
            onChange={(e) => setDefectDetails(e.target.value)}
            placeholder="Details of defect ..."
            rows={4}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* ===== SIGNATURE PAD ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Signature</CardTitle>
          <CardDescription>
            Draw your signature using your mouse or touchpad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              className="w-full max-w-[400px] h-[120px] border rounded-md touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
            <div className="flex gap-2 mt-3 self-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
                className="gap-2"
              >
                <Eraser className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* ===== FOOTER ===== */}
      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground border-t pt-4">
        <div>
          <span className="font-semibold">Document Reference No.</span>
          <br />
          HSEMS / 8.1.19 / REG / 020
        </div>
        <div>
          <span className="font-semibold">Author</span>
          <br />
          HSE Manager
        </div>
        <div>
          <span className="font-semibold">Revision</span>
          <br />
          2
        </div>
        <div>
          <span className="font-semibold">Date</span>
          <br />
          27.03.2024
        </div>
      </div>

      {/* ===== SUBMIT BUTTONS ===== */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/">Cancel</Link>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Checklist"}
        </Button>
      </div>
    </form>
  )
}