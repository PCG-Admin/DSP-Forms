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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChecklistRadioGroup } from "@/components/checklist-radio-group"
import { excavatorHarvesterItems, type CheckStatus } from "@/lib/types"
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BrandLogo } from '@/components/brand-logo'
import { NameSelector } from "@/components/name-selector"

// ─── FULL SECTIONS ARRAY – ALL 34 SECTIONS, COMPLETE ─────────────
const sections = [
  {
    title: "License and Phepha",
    items: ["Phepha valid.", "Displayed and visible."]
  },
  {
    title: "Protective Structure",
    items: [
      "No cracks/damages.",
      "No bolts missing/loose.",
      "Guards not damaged and intact."
    ]
  },
  {
    title: "Exhaust",
    items: ["Clamps secure.", "No excessive smoking/blowing."]
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
      "Condition of seat.",
      "Seat secured.",
      "Rotating lock functional.",
      "Seat adjuster functional."
    ]
  },
  {
    title: "Safety Belt",
    items: [
      "Safety belts bolted/secured.",
      "No damage/not extremely dirty/bleached or dyed.",
      "Retractor clip in order and clicks into place."
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
    title: "Hydraulic Controls",
    items: [
      "Not loose/responsive.",
      "No steering play.",
      "Rear steering.",
      "Pivot/steering ram pins not loose."
    ]
  },
  {
    title: "Hydraulic Head Cut Off (Bail Lever)",
    items: [
      "Operational (when it is disengaged, the hydraulics do not operate)."
    ]
  },
  {
    title: "Working Lights (LED)",
    items: [
      "In working order (if LED's, 2 thirds must be working) ie. (If 9 LED's, 6 must be working)."
    ]
  },
  {
    title: "Rotating Light",
    items: ["Flashing/rotating beacon light in working condition."]
  },
  {
    title: "Grill (Sieve)",
    items: [
      "Check condition – no damage.",
      "Not clogged.",
      "Air is moving freely."
    ]
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
    title: "Air Pre-Cleaner",
    items: [
      "Good condition – no damage/no sucking of air.",
      "Clean and secure.",
      "No dust in pre-cleaner bowl."
    ]
  },
  {
    title: "Fan Belt",
    items: ["No squeaking.", "No signs of damage."]
  },
  {
    title: "Fuel & Oil levels",
    items: [
      "Fuel and oil levels correct.",
      "Fuel cap and hydraulic filler cap secure.",
      "All dipsticks secure."
    ]
  },
  {
    title: "Fuel & Oil Leaks",
    items: [
      "Fuel and oil pipes secure.",
      "No worn or damaged pipes.",
      "No visible fuel and oil leaks."
    ]
  },
  {
    title: "Wiring",
    items: ["No loose, damaged or exposed wires.", "No loose broken plugs."]
  },
  {
    title: "Grease",
    items: ["Adequately greased chassis.", "No missing or damaged grease nipples."]
  },
  {
    title: "Boom Structure",
    items: [
      "Not bent/cracked.",
      "Pins all secured.",
      "No loose/missing bolts."
    ]
  },
  {
    title: "Hydraulic Cylinders",
    items: [
      "Good condition – no damage.",
      "No loose fittings.",
      "No oil leaks.",
      "No missing bolts/nuts."
    ]
  },
  {
    title: "Hydraulic Hoses and Fittings",
    items: [
      "No excessive rubbing.",
      "No loose brackets/bolts/nuts.",
      "Smooth operation.",
      "Jaws not cracked or broken."
    ]
  },
  {
    title: "Harvester Head",
    items: [
      "No pipes leaking/rubbing.",
      "No loose brackets/bolts/nuts.",
      "Roller condition good/smooth operation.",
      "Knives secure/good condition.",
      "Grease hangar link and attachment adequately greased."
    ]
  },
  {
    title: "Cutting Bar & Chain",
    items: [
      "Saw box in good condition.",
      "No wear / adequately lubricated.",
      "Correctly tensioned."
    ]
  },
  {
    title: "Tracks & Sprockets",
    items: [
      "Tracks are aligned.",
      "Not damaged or worn.",
      "No cracks.",
      "No bolts/pins loose or missing."
    ]
  },
  {
    title: "All Excess Loose Debris Removed Pre-Shift",
    items: [
      "Battery area/exhaust area.",
      "Behind the boom/hydraulic cooler.",
      "Engine bay."
    ]
  },
  {
    title: "Escape Hatch & Hammer",
    items: ["Test the escape hatch opening.", "Escape hammer is easily accessible."]
  },
  {
    title: "Communication",
    items: [
      "Radio or cell phone in working condition.",
      "Handheld panic alarm functional."
    ]
  },
  {
    title: "Fire Systems",
    items: [
      "Gauge light working/no warning lights.",
      "No damaged hoses.",
      "Secured/service/seal in place.",
      "Gauges in order."
    ]
  }
]

const allItems = sections.flatMap((section) => section.items)

// ─── Helper: renders a grouped section with icon in the MIDDLE and visible row borders
const renderGroupedSection = (
  title: string,
  items: string[],
  iconSrc: string,
  itemState: Record<string, CheckStatus>,
  onItemChange: (label: string, value: CheckStatus) => void
) => {
  const splitIndex = Math.floor(items.length / 2)
  const firstHalf = items.slice(0, splitIndex)
  const secondHalf = items.slice(splitIndex)

  return (
    <div key={title} className="space-y-2">
      <h4 className="text-sm font-semibold text-primary">{title}</h4>
      <div className="ml-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
        {/* First half of items – each with bottom border */}
        {firstHalf.map((item) => (
          <div key={item} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
            <span className="text-sm text-foreground">{item}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={itemState[item] === "ok" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "ok" ? null : "ok")
                }
                className={`w-16 ${
                  itemState[item] === "ok" ? "bg-green-600 hover:bg-green-700" : ""
                }`}
              >
                OK
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "def" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "def" ? null : "def")
                }
                className={`w-16 ${
                  itemState[item] === "def" ? "bg-red-600 hover:bg-red-700" : ""
                }`}
              >
                DEF
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "na" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "na" ? null : "na")
                }
                className={`w-16 ${
                  itemState[item] === "na" ? "bg-gray-600 hover:bg-gray-700" : ""
                }`}
              >
                N/A
              </Button>
            </div>
          </div>
        ))}

        {/* Icon row – highlighted background */}
        <div className="flex justify-center py-4 bg-gray-100 rounded-md">
          <Image
            src={iconSrc}
            alt={`${title} icon`}
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        {/* Second half of items – each with bottom border */}
        {secondHalf.map((item) => (
          <div key={item} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
            <span className="text-sm text-foreground">{item}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={itemState[item] === "ok" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "ok" ? null : "ok")
                }
                className={`w-16 ${
                  itemState[item] === "ok" ? "bg-green-600 hover:bg-green-700" : ""
                }`}
              >
                OK
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "def" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "def" ? null : "def")
                }
                className={`w-16 ${
                  itemState[item] === "def" ? "bg-red-600 hover:bg-red-700" : ""
                }`}
              >
                DEF
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "na" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "na" ? null : "na")
                }
                className={`w-16 ${
                  itemState[item] === "na" ? "bg-gray-600 hover:bg-gray-700" : ""
                }`}
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

// ============================================================================
// PROPS INTERFACE
// ============================================================================
interface ExcavatorHarvesterFormProps {
  brand: 'ringomode' | 'cintasign'
}

export function ExcavatorHarvesterForm({ brand }: ExcavatorHarvesterFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ---------- Operator Information ----------
  const [formData, setFormData] = useState({
    operatorName: "",
    shift: "",
    date: new Date().toISOString().split("T")[0],
    hourMeterStart: "",
    hourMeterStop: "",
    validTrainingCard: "",
    unitNumber: ""
  })

  // State for the next document number fetched from server
  const [nextNumber, setNextNumber] = useState<number | null>(null)

  // Fetch next document number on mount
  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        const res = await fetch('/api/next-document?formType=excavator-harvester')
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
    Object.fromEntries(allItems.map((item) => [item, null]))
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
        y: (touch.clientY - rect.top) * scaleY
      }
    } else {
      return {
        x: e.nativeEvent.offsetX * scaleX,
        y: e.nativeEvent.offsetY * scaleY
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
  const hasDefects = useMemo(
    () => Object.values(items).some((s) => s === "def"),
    [items]
  )
  const allItemsChecked = useMemo(
    () => Object.values(items).every((s) => s !== null),
    [items]
  )
  const checkedCount = useMemo(
    () => Object.values(items).filter((s) => s !== null).length,
    [items]
  )

  const handleItemChange = (label: string, value: CheckStatus) => {
    setItems((prev) => ({ ...prev, [label]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.operatorName || !formData.unitNumber) {
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
          formType: "excavator-harvester",
          formTitle: "Excavator Harvester Pre-Shift Inspection Checklist",
          submittedBy: formData.operatorName,
          hasDefects,
          brand: brand,
          data: {
            ...formData,
            items,
            hasDefects,
            defectDetails,
            signature: signatureImage
          } // documentNo NOT included
        })
      })

      if (response.ok) {
        // Fire‑and‑forget webhook call to Make
        const webhookUrl = process.env.MAKE_WEBHOOK_URL
        if (webhookUrl) {
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              formTitle: "Excavator Harvester Pre-Shift Inspection Checklist",
              documentNo,
              brand,
              submittedBy: formData.operatorName,
              submittedAt: new Date().toISOString(),
              hasDefects,
              defectDetails,
              inspectionData: items, // object mapping each item to its status
            }),
          }).catch(err => console.error('Webhook error:', err))
        }
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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 text-muted-foreground"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {/* HEADER */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3">
            <BrandLogo brand={brand} width={160} height={50} />
          </div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            HSE Management System
          </div>
          <CardTitle className="text-xl text-foreground">
            Excavator Harvester Pre-Shift Inspection Checklist
          </CardTitle>
          <CardDescription>
            Document Ref: HSEMS/8.1.19/REG/001 | Rev. 5 | 27.03.2020
          </CardDescription>
        </CardHeader>
      </Card>

      {/* GENERAL INSTRUCTIONS */}
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
            The operator is to conduct a 10 minute physical walkabout of the machinery on a daily basis
            and assess the condition of the attachment.
          </p>
          <p className="mt-2 text-sm text-amber-700">
            Outcome to be detailed with an &quot;Ok&quot; if in order and a &quot;Def&quot; if defective. Defective outcomes
            to be documented below.
          </p>
        </CardContent>
      </Card>

      {/* OPERATOR INFORMATION */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Operator Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {/* Operator name dropdown */}
          <NameSelector
            brand={brand}
            value={formData.operatorName}
            onChange={(val) => setFormData((p) => ({ ...p, operatorName: val }))}
            label="Operator Name & Surname"
            required
            placeholder="Select operator name"
          />

          {/* Document number field – read‑only, now shows actual next number */}
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
            <Label htmlFor="shift" className="text-foreground">Shift</Label>
            <Select
              value={formData.shift}
              onValueChange={(val) => setFormData((p) => ({ ...p, shift: val }))}
            >
              <SelectTrigger id="shift">
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day Shift</SelectItem>
                <SelectItem value="night">Night Shift</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="hourMeterStart" className="text-foreground">Hour Meter Start</Label>
            <Input
              id="hourMeterStart"
              type="number"
              value={formData.hourMeterStart}
              onChange={(e) => setFormData((p) => ({ ...p, hourMeterStart: e.target.value }))}
              placeholder="e.g. 1250"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourMeterStop" className="text-foreground">Hour Meter Stop</Label>
            <Input
              id="hourMeterStop"
              type="number"
              value={formData.hourMeterStop}
              onChange={(e) => setFormData((p) => ({ ...p, hourMeterStop: e.target.value }))}
              placeholder="e.g. 1262"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validTrainingCard" className="text-foreground">
              Valid Training Card (Exp. Date)
            </Label>
            <Input
              id="validTrainingCard"
              type="date"
              value={formData.validTrainingCard}
              onChange={(e) => setFormData((p) => ({ ...p, validTrainingCard: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitNumber" className="text-foreground">
              Unit Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="unitNumber"
              value={formData.unitNumber}
              onChange={(e) => setFormData((p) => ({ ...p, unitNumber: e.target.value }))}
              placeholder="e.g. EXC-H-001"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* QUICK REFERENCE */}
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

      {/* PROGRESS */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progress: {checkedCount} / {allItems.length} items checked
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
          style={{ width: `${(checkedCount / allItems.length) * 100}%` }}
        />
      </div>

      {/* INSPECTION ITEMS – ALL 34 SECTIONS GROUPED WITH VISIBLE ROW BORDERS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Inspection Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section, sectionIdx) => {
            if (section.title === "License and Phepha") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/license2.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Protective Structure") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/protective-structure.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Exhaust") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/exhaust.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Steps and Rails") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/steps-and-rails.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Cab") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/cabs.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Windscreen, Windows & Wipers") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/wipes.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Air Conditioner") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/air-conditioner.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Seats") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/seats.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Safety Belt") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/safety-belt.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Hooter and Reverse Alarm") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/hooters.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Gauges") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/gauges.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Hydraulic Controls") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/hydraulic-controls.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Air Pre-Cleaner") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/air-pre-cleaner.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Battery") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/battery.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Hydraulic Head Cut Off (Bail Lever)") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/bail-lever.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Fan Belt") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/fan-belt.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Fuel & Oil levels") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/fuel-oil-levels.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Fuel & Oil Leaks") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/fuel-leaks.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Wiring") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/wiring.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Grease") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/grease.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Grill (Sieve)") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/grill.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Working Lights (LED)") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/led.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Radiator") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/radiator.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Rotating Light") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/rotating-light.png",
                items,
                handleItemChange
              )
            }

            if (section.title === "Boom Structure") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/boom-structure.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Hydraulic Cylinders") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/hydraulic-cylinders.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Hydraulic Hoses and Fittings") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/hydraulic-hoses.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Harvester Head") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/harvester-head.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Cutting Bar & Chain") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/cutting-bar.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Tracks & Sprockets") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/tracks-sprockets.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "All Excess Loose Debris Removed Pre-Shift") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/all-excess-loose-debris.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Escape Hatch & Hammer") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/escape-hatch.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Communication") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/communication.png",
                items,
                handleItemChange
              )
            }
            if (section.title === "Fire Systems") {
              return renderGroupedSection(
                section.title,
                section.items,
                "/images/fire-system.png",
                items,
                handleItemChange
              )
            }

            // Fallback (should not happen)
            return (
              <div key={sectionIdx} className="space-y-2">
                <h4 className="text-sm font-semibold text-primary">{section.title}</h4>
                <div className="ml-4 space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <ChecklistRadioGroup
                      key={`${sectionIdx}-${itemIdx}`}
                      label={item}
                      value={items[item]}
                      onChange={(val: CheckStatus) => handleItemChange(item, val)}
                      index={itemIdx}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* DEFECTS SECTION */}
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

      {/* SIGNATURE PAD */}
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

      {/* SUBMIT BUTTONS */}
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