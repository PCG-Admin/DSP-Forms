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

// ============================================================================
// INSPECTION ITEMS – grouped by section (as per the provided PDF/image)
// ============================================================================
const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "License and Phepha",
    items: ["Phepha valid.", "Displayed and visible."]
  },
  {
    title: "Body of Cab/Trailer",
    items: ["Body work not damaged.", "No dents or scratches."]
  },
  {
    title: "Steps and Rails",
    items: ["Steps in good condition.", "Not loose/broken."]
  },
  {
    title: "Cab",
    items: [
      "Cab neat and tidy.",
      "Door and mechanism working.",
      "Door rubber in good condition.",
      "Door handles functional."
    ]
  },
  {
    title: "Mirrors",
    items: [
      "Mirrors in good condition.",
      "Not damaged.",
      "Adequately secured – not loose."
    ]
  },
  {
    title: "Windscreen, Windows & Wipers",
    items: [
      "Clean/secure.",
      "No cracks or damages to windscreen.",
      "Window visibility not obscured by cracks.",
      "Wipers are working."
    ]
  },
  {
    title: "Air Conditioner",
    items: ["In working condition."]
  },
  {
    title: "Seats",
    items: [
      "Safety belts bolted/secured.",
      "No damage/not extremely dirty/bleached or dyed.",
      "Retractor clip in order and clicks into place."
    ]
  },
  {
    title: "Steering Column",
    items: [
      "Steering column in order.",
      "No excessive movement of steering column when locked in position.",
      "Reverse steering functional."
    ]
  },
  {
    title: "Hooter and Reverse Alarm",
    items: ["Hooter working and in good condition.", "Reverse alarm working."]
  },
  {
    title: "Gauges",
    items: ["In working order.", "Any warning symbols/lights."]
  },
  {
    title: "Clutch",
    items: ["Clutch taking correctly – not slipping.", "In working order."]
  },
  {
    title: "Lamps",
    items: ["Dim/bright lights/brake lights/indicators/hazards/reflector in working order."]
  },
  {
    title: "Brakes",
    items: ["In working order.", "Sufficient air build up."]
  },
  {
    title: "Handbrake and Trailer Brakes (If Fitted)",
    items: ["Working."]
  },
  {
    title: "Battery",
    items: [
      "Secure.",
      "Sufficient water.",
      "Terminals clean/tight & covers on.",
      "No exposed wiring."
    ]
  },
  {
    title: "Radiator",
    items: ["Secure.", "Water level correct.", "No signs of leaking."]
  },
  {
    title: "Wiring",
    items: ["No loose, damaged or exposed wires.", "No loose broken plugs."]
  },
  {
    title: "Air Tank Drain",
    items: ["Good condition.", "Drained daily."]
  },
  {
    title: "Oil/Fluid/Air Levels",
    items: [
      "Check all oil levels/brake fluid levels/clutch fluid levels at correct.",
      "Check air gauge in order."
    ]
  },
  {
    title: "Trailer Deck",
    items: ["Ensure trailer deck floor is in good condition.", "Not rusted."]
  },
  {
    title: "Tow Bar & Hitch/King Pin",
    items: ["Bolts, eyes and hitch in good condition.", "No wearing on the king pin."]
  },
  {
    title: "Landing Gear",
    items: ["Ensure stabiliser legs and locking pins are in good condition."]
  },
  {
    title: "Anchor Points, Chains & Binders",
    items: ["Ensure anchor points are safe enough to use.", "Chains and binders to be used are in good condition."]
  },
  {
    title: "Chevron, Reflectors & Tape",
    items: ["Securely mounted.", "No loose breakages."]
  },
  {
    title: "Hydraulic Controls",
    items: [
      "Not loose/responsive.",
      "No steering play.",
      "Rear steering.",
      "Pivot/steering ram pins not loose."
    ]
  }
];

// Flatten all items for progress calculation
const ALL_ITEMS = SECTIONS.flatMap(section => section.items);

// ============================================================================
// PER‑ITEM ICON MAPPING – using composite keys (section||item) to avoid duplicates
// ============================================================================
const itemIconMap: Record<string, string> = {
  // License and Phepha
  "License and Phepha||Phepha valid.": "license2.png",
  "License and Phepha||Displayed and visible.": "license2.png",

  // Body of Cab/Trailer
  "Body of Cab/Trailer||Body work not damaged.": "cabs.png",
  "Body of Cab/Trailer||No dents or scratches.": "cabs.png",

  // Steps and Rails
  "Steps and Rails||Steps in good condition.": "steps-and-rails.png",
  "Steps and Rails||Not loose/broken.": "steps-and-rails.png",

  // Cab
  "Cab||Cab neat and tidy.": "cabs.png",
  "Cab||Door and mechanism working.": "cabs.png",
  "Cab||Door rubber in good condition.": "cabs.png",
  "Cab||Door handles functional.": "cabs.png",

  // Mirrors
  "Mirrors||Mirrors in good condition.": "mirrors2.png",
  "Mirrors||Not damaged.": "mirrors2.png",
  "Mirrors||Adequately secured – not loose.": "mirrors2.png",

  // Windscreen, Windows & Wipers
  "Windscreen, Windows & Wipers||Clean/secure.": "wipes.png",
  "Windscreen, Windows & Wipers||No cracks or damages to windscreen.": "wipes.png",
  "Windscreen, Windows & Wipers||Window visibility not obscured by cracks.": "wipes.png",
  "Windscreen, Windows & Wipers||Wipers are working.": "wipes.png",

  // Air Conditioner
  "Air Conditioner||In working condition.": "air-conditioner.png",

  // Seats
  "Seats||Safety belts bolted/secured.": "safety-belt.png",
  "Seats||No damage/not extremely dirty/bleached or dyed.": "safety-belt.png",
  "Seats||Retractor clip in order and clicks into place.": "safety-belt.png",

  // Steering Column
  "Steering Column||Steering column in order.": "steering-column.png",
  "Steering Column||No excessive movement of steering column when locked in position.": "steering-column.png",
  "Steering Column||Reverse steering functional.": "steering-column.png",

  // Hooter and Reverse Alarm
  "Hooter and Reverse Alarm||Hooter working and in good condition.": "hooters.png",
  "Hooter and Reverse Alarm||Reverse alarm working.": "hooters.png",

  // Gauges
  "Gauges||In working order.": "gauges.png",
  "Gauges||Any warning symbols/lights.": "gauges.png",

  // Clutch
  "Clutch||Clutch taking correctly – not slipping.": "clutch.png",
  "Clutch||In working order.": "clutch.png",

  // Lamps
  "Lamps||Dim/bright lights/brake lights/indicators/hazards/reflector in working order.": "led.png",

  // Brakes
  "Brakes||In working order.": "foot-brake.png",
  "Brakes||Sufficient air build up.": "foot-brake.png",

  // Handbrake and Trailer Brakes (If Fitted)
  "Handbrake and Trailer Brakes (If Fitted)||Working.": "hand-brake.png",

  // Battery
  "Battery||Secure.": "battery.png",
  "Battery||Sufficient water.": "battery.png",
  "Battery||Terminals clean/tight & covers on.": "battery.png",
  "Battery||No exposed wiring.": "battery.png",

  // Radiator
  "Radiator||Secure.": "radiator.png",
  "Radiator||Water level correct.": "radiator.png",
  "Radiator||No signs of leaking.": "radiator.png",

  // Wiring
  "Wiring||No loose, damaged or exposed wires.": "wiring.png",
  "Wiring||No loose broken plugs.": "wiring.png",

  // Air Tank Drain
  "Air Tank Drain||Good condition.": "air-fuel-leaks.png",
  "Air Tank Drain||Drained daily.": "air-fuel-leaks.png",

  // Oil/Fluid/Air Levels
  "Oil/Fluid/Air Levels||Check all oil levels/brake fluid levels/clutch fluid levels at correct.": "oil-fluid-air-level.png",
  "Oil/Fluid/Air Levels||Check air gauge in order.": "oil-fluid-air-level.png",

  // Trailer Deck
  "Trailer Deck||Ensure trailer deck floor is in good condition.": "boom-structure.png",
  "Trailer Deck||Not rusted.": "boom-structure.png",

  // Tow Bar & Hitch/King Pin
  "Tow Bar & Hitch/King Pin||Bolts, eyes and hitch in good condition.": "tow-hitch.png",
  "Tow Bar & Hitch/King Pin||No wearing on the king pin.": "tow-hitch.png",

  // Landing Gear
  "Landing Gear||Ensure stabiliser legs and locking pins are in good condition.": "landing-gear.png",

  // Anchor Points, Chains & Binders
  "Anchor Points, Chains & Binders||Ensure anchor points are safe enough to use.": "anchor-points.png",
  "Anchor Points, Chains & Binders||Chains and binders to be used are in good condition.": "anchor-points.png",

  // Chevron, Reflectors & Tape
  "Chevron, Reflectors & Tape||Securely mounted.": "led.png",
  "Chevron, Reflectors & Tape||No loose breakages.": "led.png",

  // Hydraulic Controls
  "Hydraulic Controls||Not loose/responsive.": "hydraulic-controls.png",
  "Hydraulic Controls||No steering play.": "hydraulic-controls.png",
  "Hydraulic Controls||Rear steering.": "hydraulic-controls.png",
  "Hydraulic Controls||Pivot/steering ram pins not loose.": "hydraulic-controls.png",
};

const FALLBACK_ICON = "license2.png";

// ============================================================================
// PER‑ITEM ROW COMPONENT (with icon column)
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
interface LowbedStepdeckTrailerFormProps {
  brand: 'ringomode' | 'cintasign'
}

// ============================================================================
// MAIN FORM COMPONENT
// ============================================================================
export function LowbedStepdeckTrailerForm({ brand }: LowbedStepdeckTrailerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ---------- Driver Information ----------
  const [formData, setFormData] = useState({
    driverName: "",
    truckRegistration: "",
    date: new Date().toISOString().split("T")[0],
    openingKilometers: "",
    closingKilometers: "",
    validDriversLicenseExp: "",
    trailerRegistration: "",
    pdpExpiryDate: "",
  })

  // State for the next document number fetched from server
  const [nextNumber, setNextNumber] = useState<number | null>(null)

  // Fetch next document number on mount
  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        const res = await fetch('/api/next-document?formType=lowbed-stepdeck-trailer')
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

  // ---------- Inspection Items State ----------
  const [items, setItems] = useState<Record<string, CheckStatus>>(
    Object.fromEntries(ALL_ITEMS.map((item) => [item, null]))
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
          formType: "lowbed-stepdeck-trailer",
          formTitle: "Lowbed And Step Deck Trailer Pre-Use Inspection Checklist",
          submittedBy: formData.driverName,
          hasDefects,
          brand: brand,
          data: {
            ...formData,
            items,
            hasDefects,
            defectDetails,
            signature: signatureImage,
          }, // documentNo NOT included
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6 p-4 pb-12 lg:p-8 lg:pb-16">
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
            Lowbed And Step Deck Trailer Pre-Use Inspection Checklist
          </CardTitle>
          <CardDescription>
            Document Ref: HSEMS/8.1.19/REG/021 | Rev. 1 | 01.03.2025
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
          <CardTitle className="text-base text-foreground">Driver & Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {/* Driver name dropdown */}
          <NameSelector
            brand={brand}
            value={formData.driverName}
            onChange={(val) => setFormData((p) => ({ ...p, driverName: val }))}
            label="Drivers name"
            required
            placeholder="Select driver name"
          />

          {/* Document number field – read‑only, now shows actual next number */}
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
            <Label htmlFor="openingKilometers">Opening kilometers</Label>
            <Input
              id="openingKilometers"
              type="number"
              value={formData.openingKilometers}
              onChange={(e) => setFormData((p) => ({ ...p, openingKilometers: e.target.value }))}
              placeholder="e.g. 125000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="closingKilometers">Closing kilometers</Label>
            <Input
              id="closingKilometers"
              type="number"
              value={formData.closingKilometers}
              onChange={(e) => setFormData((p) => ({ ...p, closingKilometers: e.target.value }))}
              placeholder="e.g. 125350"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validDriversLicenseExp">Valid drivers license (exp date)</Label>
            <Input
              id="validDriversLicenseExp"
              type="date"
              value={formData.validDriversLicenseExp}
              onChange={(e) => setFormData((p) => ({ ...p, validDriversLicenseExp: e.target.value }))}
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
          Progress: {checkedCount} / {ALL_ITEMS.length} items checked
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
          style={{ width: `${(checkedCount / ALL_ITEMS.length) * 100}%` }}
        />
      </div>

      {/* ===== INSPECTION ITEMS – grouped by section, with icons ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Inspection Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <h4 className="text-sm font-semibold text-primary">{section.title}</h4>
              <div className="ml-4 space-y-2">
                {section.items.map((item) => {
                  const compositeKey = `${section.title}||${item}`;
                  const iconFile = itemIconMap[compositeKey] || FALLBACK_ICON;
                  return (
                    <ItemRow
                      key={item}
                      item={item}
                      value={items[item]}
                      onChange={(val) => handleItemChange(item, val)}
                      iconSrc={`/images/${iconFile}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ===== DEFECTS SECTION ===== */}
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
          HSEMS / 8.1.19 / REG / 021
        </div>
        <div>
          <span className="font-semibold">Author</span>
          <br />
          HSE Manager
        </div>
        <div>
          <span className="font-semibold">Revision</span>
          <br />
          1
        </div>
        <div>
          <span className="font-semibold">Creation Date</span>
          <br />
          01.03.2025
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