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
import { lightDeliveryItems, type CheckStatus } from "@/lib/types"
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// ============================================================================
// EFFECTIVE ITEMS – remove "First aid kit" from the list
// ============================================================================
const effectiveItems = lightDeliveryItems.filter(item => item !== "First aid kit")

// ============================================================================
// ICON MAPPING – per‑item icons (used for non‑group sections)
// ============================================================================
const itemIconMap: Record<string, string> = {
  "Drivers license available": "license2.png",
  "Valid training card": "license2.png",
  "Vehicle registration document": "license2.png",
  "Windscreen (cracks/chips)": "wipes.png",
  "Wipers and washers": "wipes.png",
  "Mirrors (rear view/side)": "mirrors2.png",
  "Lights (head/tail/brake/indicator)": "led.png",
  "Horn": "hooters.png",
  "Seat belt": "safety-belt.png",
  "Seats (condition/adjustment)": "seats.png",
  "Fire extinguisher (serviced/sealed)": "fire-extinguisher.png",
  "Warning triangle": "emergency-triangle.png",
  "Jack and wheel spanner": "wheel-nut.png",
  "Spare wheel (condition/pressure)": "types-spares.png",
  "Tyres (condition/pressure/wear)": "types-spares.png",
  "Brakes (foot/handbrake)": "foot-brake.png",
  "Steering (play/condition)": "steering-column.png",
  "Oil level": "oil-fluid-air-level.png",
  "Coolant level": "radiator.png",
  "Fuel level": "fuel-oil-levels.png",
  "Battery (condition/terminals)": "battery.png",
  "Exhaust system (leaks/condition)": "air-fuel-leaks.png",
  "Body (dents/damage)": "bonnet-retaining-catch.png",
  "Doors (locks/handles)": "cabs.png",
  "General cleanliness": "wipes.png",
}

// ============================================================================
// SECTION DEFINITIONS – each section has a title, list of items, and optional groupIcon
// (if groupIcon is provided, the section will render as a group with one icon in the middle)
// ============================================================================
interface Section {
  title: string
  items: string[]
  groupIcon?: string // if present, use group layout; otherwise per‑item icons
}

const sections: Section[] = [
  {
    title: "License & Documents",
    items: [
      "Drivers license available",
      "Valid training card",
      "Vehicle registration document"
    ],
    groupIcon: "/images/license2.png"
  },
  {
    title: "Visibility & Lights",
    items: [
      "Windscreen (cracks/chips)",
      "Wipers and washers",
      "Mirrors (rear view/side)",
      "Lights (head/tail/brake/indicator)"
    ]
  },
  {
    title: "Safety Equipment",
    items: [
      "Horn",
      "Seat belt",
      "Seats (condition/adjustment)",
      "Fire extinguisher (serviced/sealed)",
      "Warning triangle",
      "Jack and wheel spanner"
    ]
  },
  {
    title: "Wheels",
    items: [
      "Spare wheel (condition/pressure)",
      "Tyres (condition/pressure/wear)"
    ],
    groupIcon: "/images/types-spares.png"
  },
  {
    title: "Brakes",
    items: [
      "Brakes (foot/handbrake)"
    ]
  },
  {
    title: "Steering & Controls",
    items: [
      "Steering (play/condition)"
    ]
  },
  {
    title: "Fluids & Electrical",
    items: [
      "Oil level",
      "Coolant level",
      "Fuel level",
      "Battery (condition/terminals)"
    ]
  },
  {
    title: "Body & Exhaust",
    items: [
      "Exhaust system (leaks/condition)",
      "Body (dents/damage)",
      "Doors (locks/handles)",
      "General cleanliness"
    ]
  }
]

// ============================================================================
// PER‑ITEM ROW COMPONENT – now with visible columns (borders & background)
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
      {/* Label column */}
      <div className="py-3 pr-4 border-r border-gray-200">
        <span className="text-sm font-medium text-foreground">{item}</span>
      </div>

      {/* Icon column with background */}
      <div className="py-3 px-4 border-r border-gray-200 bg-gray-50 flex justify-center w-[150px]">
        <Image
          src={iconSrc}
          alt={item}
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      {/* Buttons column */}
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
// GROUP SECTION COMPONENT – renders items in two halves with icon in the middle
// ============================================================================
interface GroupSectionProps {
  title: string
  items: string[]
  iconSrc: string
  itemState: Record<string, CheckStatus>
  onItemChange: (label: string, value: CheckStatus) => void
}

function GroupSection({ title, items, iconSrc, itemState, onItemChange }: GroupSectionProps) {
  const splitIndex = Math.floor(items.length / 2)
  const firstHalf = items.slice(0, splitIndex)
  const secondHalf = items.slice(splitIndex)

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-primary">{title}</h4>
      <div className="ml-4 space-y-2">
        {/* First half */}
        {firstHalf.map(item => (
          <div key={item} className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-foreground">{item}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={itemState[item] === "ok" ? "default" : "outline"}
                size="sm"
                onClick={() => onItemChange(item, itemState[item] === "ok" ? null : "ok")}
                className={`w-16 ${itemState[item] === "ok" ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                OK
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "def" ? "default" : "outline"}
                size="sm"
                onClick={() => onItemChange(item, itemState[item] === "def" ? null : "def")}
                className={`w-16 ${itemState[item] === "def" ? "bg-red-600 hover:bg-red-700" : ""}`}
              >
                DEF
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "na" ? "default" : "outline"}
                size="sm"
                onClick={() => onItemChange(item, itemState[item] === "na" ? null : "na")}
                className={`w-16 ${itemState[item] === "na" ? "bg-gray-600 hover:bg-gray-700" : ""}`}
              >
                N/A
              </Button>
            </div>
          </div>
        ))}

        {/* Icon in the middle */}
        <div className="flex justify-center py-4">
          <Image
            src={iconSrc}
            alt={title}
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        {/* Second half */}
        {secondHalf.map(item => (
          <div key={item} className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-foreground">{item}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={itemState[item] === "ok" ? "default" : "outline"}
                size="sm"
                onClick={() => onItemChange(item, itemState[item] === "ok" ? null : "ok")}
                className={`w-16 ${itemState[item] === "ok" ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                OK
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "def" ? "default" : "outline"}
                size="sm"
                onClick={() => onItemChange(item, itemState[item] === "def" ? null : "def")}
                className={`w-16 ${itemState[item] === "def" ? "bg-red-600 hover:bg-red-700" : ""}`}
              >
                DEF
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "na" ? "default" : "outline"}
                size="sm"
                onClick={() => onItemChange(item, itemState[item] === "na" ? null : "na")}
                className={`w-16 ${itemState[item] === "na" ? "bg-gray-600 hover:bg-gray-700" : ""}`}
              >
                N/A
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LightDeliveryForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ---------- Driver Information ----------
  const [formData, setFormData] = useState({
    driverName: "",
    vehicleRegistration: "",
    date: new Date().toISOString().split("T")[0],
    validTrainingCard: "",
    driversLicenseAvailable: "",
    odometerStart: "",
    odometerStop: "",
  })

  // ---------- Auto‑generate Document Number ----------
  const documentNo = useMemo(() => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `LD-${year}${month}${day}-${random}`
  }, [])

  // ---------- Inspection Items State (using effectiveItems) ----------
  const [items, setItems] = useState<Record<string, CheckStatus>>(
    Object.fromEntries(effectiveItems.map((item) => [item, null]))
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

  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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

  // ---------- Item Change Handler ----------
  const handleItemChange = (label: string, value: CheckStatus) => {
    setItems((prev) => ({ ...prev, [label]: value }))
  }

  // ---------- Submit Handler ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.driverName || !formData.vehicleRegistration) {
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
        body: JSON.stringify({
          formType: "light-delivery",
          formTitle: "Light Delivery Vehicle Daily Checklist",
          submittedBy: formData.driverName,
          hasDefects,
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
            <Image
              src="/images/ringomode-logo.png"
              alt="Ringomode DSP logo"
              width={160}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">HSE Management System</div>
          <CardTitle className="text-xl text-foreground">
            Light Delivery Vehicle Daily Checklist
          </CardTitle>
          <CardDescription>
            Document Ref: HSEMS/8.1.19/REG/012 | Rev. 2 | 27.03.2020
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
            The driver is to conduct a 10 minute physical walkabout of the vehicle on a daily basis
            and assess the condition of the vehicle.
          </p>
          <p className="mt-2 text-sm text-amber-700">
            Outcome to be detailed with an &quot;Ok&quot; if in order and a &quot;Def&quot; if defective. Defective outcomes
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
            <Label htmlFor="driverName" className="text-foreground">
              Driver's Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="driverName"
              value={formData.driverName}
              onChange={(e) => setFormData((p) => ({ ...p, driverName: e.target.value }))}
              placeholder="Enter driver name"
              required
            />
          </div>

          {/* Auto-generated Document Number */}
          <div className="space-y-2">
            <Label htmlFor="documentNo" className="text-foreground">Document No.</Label>
            <Input
              id="documentNo"
              value={documentNo}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleRegistration" className="text-foreground">
              Vehicle Registration <span className="text-destructive">*</span>
            </Label>
            <Input
              id="vehicleRegistration"
              value={formData.vehicleRegistration}
              onChange={(e) => setFormData((p) => ({ ...p, vehicleRegistration: e.target.value }))}
              placeholder="e.g. ABC 123 GP"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validTrainingCard" className="text-foreground">Valid Training Card (Exp. Date)</Label>
            <Input
              id="validTrainingCard"
              type="date"
              value={formData.validTrainingCard}
              onChange={(e) => setFormData((p) => ({ ...p, validTrainingCard: e.target.value }))}
            />
          </div>

          {/* ===== DRIVER'S LICENSE FIELD WITH ICON ===== */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Image
                src="/images/license2.png"
                alt="Driver License Icon"
                width={32}
                height={32}
                className="object-contain"
              />
              <Label htmlFor="driversLicense" className="text-foreground">
                Driver's License Available (Exp. Date)
              </Label>
            </div>
            <Input
              id="driversLicense"
              type="date"
              value={formData.driversLicenseAvailable}
              onChange={(e) => setFormData((p) => ({ ...p, driversLicenseAvailable: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="odometerStart" className="text-foreground">Odometer Start</Label>
            <Input
              id="odometerStart"
              type="number"
              value={formData.odometerStart}
              onChange={(e) => setFormData((p) => ({ ...p, odometerStart: e.target.value }))}
              placeholder="e.g. 45000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="odometerStop" className="text-foreground">Odometer Stop</Label>
            <Input
              id="odometerStop"
              type="number"
              value={formData.odometerStop}
              onChange={(e) => setFormData((p) => ({ ...p, odometerStop: e.target.value }))}
              placeholder="e.g. 45150"
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
          Progress: {checkedCount} / {effectiveItems.length} items checked
        </span>
        {allItemsChecked && (
          <span className="flex items-center gap-1 text-[hsl(142,76%,36%)]">
            <CheckCircle2 className="h-4 w-4" />
            All items checked
          </span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(checkedCount / effectiveItems.length) * 100}%` }}
        />
      </div>

      {/* ===== INSPECTION ITEMS – RENDER EACH SECTION APPROPRIATELY ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Inspection Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section) => {
            // Filter items that exist in state
            const sectionItems = section.items.filter(item => item in items)
            if (sectionItems.length === 0) return null

            // If the section has a groupIcon, render as group section
            if (section.groupIcon) {
              return (
                <GroupSection
                  key={section.title}
                  title={section.title}
                  items={sectionItems}
                  iconSrc={section.groupIcon}
                  itemState={items}
                  onItemChange={handleItemChange}
                />
              )
            }

            // Otherwise render per‑item with icons from map
            return (
              <div key={section.title} className="space-y-4">
                <h4 className="text-sm font-semibold text-primary">{section.title}</h4>
                <div className="ml-4 space-y-2">
                  {sectionItems.map((item) => {
                    const iconFile = itemIconMap[item] || "license2.png"
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
                </div>
              </div>
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
            If &quot;Def&quot; is selected, please specify defects here.
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