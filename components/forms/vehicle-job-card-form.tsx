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
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BrandLogo } from "@/components/brand-logo"
import { NameSelector } from "@/components/name-selector"

// ============================================================================
// PROPS INTERFACE
// ============================================================================
interface VehicleJobCardFormProps {
  brand: 'ringomode' | 'cintasign'
}

export function VehicleJobCardForm({ brand }: VehicleJobCardFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ---------- Form Fields (based on PDF) ----------
  const [formData, setFormData] = useState({
    driverName: "",
    machineVehicle: "",
    machineRegNumber: "",
    hourMeterKmReading: "",
    date: new Date().toISOString().split("T")[0],
    categoryOfWork: "",
    descriptionOfWork: "",
    testPerformedAndResult: "",
    jobCompletedAndSafe: "",
    mechanicsName: "",
    operatorsName: "",
  })

  // State for the next document number fetched from server
  const [nextNumber, setNextNumber] = useState<number | null>(null)

  // Fetch next document number on mount
  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        const res = await fetch('/api/next-document?formType=vehicle-job-card')
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

  // ---------- Signature Pads ----------
  const mechanicsCanvasRef = useRef<HTMLCanvasElement>(null)
  const operatorsCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawingMechanic, setIsDrawingMechanic] = useState(false)
  const [isDrawingOperator, setIsDrawingOperator] = useState(false)
  const [mechanicSignature, setMechanicSignature] = useState<string | null>(null)
  const [operatorSignature, setOperatorSignature] = useState<string | null>(null)

  // Initialize canvases
  useEffect(() => {
    const initCanvas = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const width = 300
      const height = 100
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
    }
    initCanvas(mechanicsCanvasRef.current)
    initCanvas(operatorsCanvasRef.current)
  }, [])

  // Helper to get canvas coordinates
  const getCanvasCoordinates = (
    canvas: HTMLCanvasElement,
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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

  // Signature helpers
  const startDrawing = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>
  ) => (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    setIsDrawing(true)
    ctx.beginPath()
    const { x, y } = getCanvasCoordinates(canvas, e)
    ctx.moveTo(x, y)
  }

  const draw = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    isDrawing: boolean
  ) => (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const { x, y } = getCanvasCoordinates(canvas, e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    setSignature: React.Dispatch<React.SetStateAction<string | null>>
  ) => () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setSignature(canvas.toDataURL("image/png"))
    }
  }

  const clearSignature = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    setSignature: React.Dispatch<React.SetStateAction<string | null>>
  ) => () => {
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
    setSignature(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.driverName || !formData.machineVehicle) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!mechanicSignature || !operatorSignature) {
      toast.error("Both mechanic and operator signatures are required")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          formType: "vehicle-job-card",
          formTitle: "Motorised Equipment/Vehicle Job Card",
          submittedBy: formData.driverName,
          hasDefects: false,
          brand: brand,
          data: {
            ...formData,
            mechanicSignature,
            operatorSignature,
          }, // documentNo NOT included
        }),
      })

      if (response.ok) {
        // Fire‑and‑forget webhook call to Make (DocuWare integration)
        const makeWebhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
        if (makeWebhookUrl) {
          fetch(makeWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              formTitle: "Motorised Equipment/Vehicle Job Card",
              documentNo,
              brand,
              submittedBy: formData.driverName,
              submittedAt: new Date().toISOString(),
              hasDefects: false,
              defectDetails: "", // No defect details for this form
              inspectionData: {
                ...formData,
                mechanicSignature,
                operatorSignature,
              }, // Full job card data
            }),
          }).catch(err => console.error('Webhook error:', err))
        }

        toast.success("Job card submitted successfully!")
        router.push("/")
      } else {
        toast.error("Failed to submit job card")
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

      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3">
            <BrandLogo brand={brand} width={160} height={50} />
          </div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">HSE MANAGEMENT SYSTEM</div>
          <CardTitle className="text-2xl text-foreground">Motorised Equipment/Vehicle Job Card</CardTitle>
          <CardDescription>Document Ref: HSEMS/8.1.19/REG/??? | Rev. 1 | 27.03.2020</CardDescription>
        </CardHeader>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {/* Driver name dropdown */}
          <NameSelector
            brand={brand}
            value={formData.driverName}
            onChange={(val) => setFormData(p => ({ ...p, driverName: val }))}
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
            <Label htmlFor="machineVehicle">Machine / vehicle <span className="text-destructive">*</span></Label>
            <Input id="machineVehicle" value={formData.machineVehicle} onChange={e => setFormData(p => ({ ...p, machineVehicle: e.target.value }))} placeholder="e.g. Excavator, Truck" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="machineRegNumber">Machine / registration number</Label>
            <Input id="machineRegNumber" value={formData.machineRegNumber} onChange={e => setFormData(p => ({ ...p, machineRegNumber: e.target.value }))} placeholder="e.g. ABC123" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourMeterKmReading">Hour meter / KM reading</Label>
            <Input id="hourMeterKmReading" value={formData.hourMeterKmReading} onChange={e => setFormData(p => ({ ...p, hourMeterKmReading: e.target.value }))} placeholder="e.g. 1250" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="categoryOfWork">Category of work</Label>
            <Input id="categoryOfWork" value={formData.categoryOfWork} onChange={e => setFormData(p => ({ ...p, categoryOfWork: e.target.value }))} placeholder="e.g. Repair, Maintenance" />
          </div>
        </CardContent>
      </Card>

      {/* Work Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Work Performed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descriptionOfWork">Description of work performed</Label>
            <Textarea id="descriptionOfWork" value={formData.descriptionOfWork} onChange={e => setFormData(p => ({ ...p, descriptionOfWork: e.target.value }))} rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="testPerformedAndResult">Test performed and result</Label>
            <Textarea id="testPerformedAndResult" value={formData.testPerformedAndResult} onChange={e => setFormData(p => ({ ...p, testPerformedAndResult: e.target.value }))} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobCompletedAndSafe">Job completed and safe to use</Label>
            <Select value={formData.jobCompletedAndSafe} onValueChange={val => setFormData(p => ({ ...p, jobCompletedAndSafe: val }))}>
              <SelectTrigger id="jobCompletedAndSafe">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mechanics and Operators */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mechanic */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mechanic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {/* Mechanics name dropdown */}
              <NameSelector
                brand={brand}
                value={formData.mechanicsName}
                onChange={(val) => setFormData(p => ({ ...p, mechanicsName: val }))}
                label="Mechanics name"
                placeholder="Select mechanic name"
              />
            </div>
            <div className="space-y-2">
              <Label>Mechanics signature</Label>
              <div className="flex flex-col items-start">
                <canvas
                  ref={mechanicsCanvasRef}
                  className="w-full max-w-[300px] h-[100px] border rounded-md touch-none cursor-crosshair"
                  onMouseDown={startDrawing(mechanicsCanvasRef, setIsDrawingMechanic)}
                  onMouseMove={draw(mechanicsCanvasRef, isDrawingMechanic)}
                  onMouseUp={stopDrawing(mechanicsCanvasRef, setIsDrawingMechanic, setMechanicSignature)}
                  onMouseLeave={stopDrawing(mechanicsCanvasRef, setIsDrawingMechanic, setMechanicSignature)}
                  onTouchStart={startDrawing(mechanicsCanvasRef, setIsDrawingMechanic)}
                  onTouchMove={draw(mechanicsCanvasRef, isDrawingMechanic)}
                  onTouchEnd={stopDrawing(mechanicsCanvasRef, setIsDrawingMechanic, setMechanicSignature)}
                  onTouchCancel={stopDrawing(mechanicsCanvasRef, setIsDrawingMechanic, setMechanicSignature)}
                />
                <Button type="button" variant="outline" size="sm" onClick={clearSignature(mechanicsCanvasRef, setMechanicSignature)} className="gap-2 mt-2">
                  <Eraser className="h-4 w-4" /> Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Operator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {/* Operators name dropdown */}
              <NameSelector
                brand={brand}
                value={formData.operatorsName}
                onChange={(val) => setFormData(p => ({ ...p, operatorsName: val }))}
                label="Operators name"
                placeholder="Select operator name"
              />
            </div>
            <div className="space-y-2">
              <Label>Operators signature</Label>
              <div className="flex flex-col items-start">
                <canvas
                  ref={operatorsCanvasRef}
                  className="w-full max-w-[300px] h-[100px] border rounded-md touch-none cursor-crosshair"
                  onMouseDown={startDrawing(operatorsCanvasRef, setIsDrawingOperator)}
                  onMouseMove={draw(operatorsCanvasRef, isDrawingOperator)}
                  onMouseUp={stopDrawing(operatorsCanvasRef, setIsDrawingOperator, setOperatorSignature)}
                  onMouseLeave={stopDrawing(operatorsCanvasRef, setIsDrawingOperator, setOperatorSignature)}
                  onTouchStart={startDrawing(operatorsCanvasRef, setIsDrawingOperator)}
                  onTouchMove={draw(operatorsCanvasRef, isDrawingOperator)}
                  onTouchEnd={stopDrawing(operatorsCanvasRef, setIsDrawingOperator, setOperatorSignature)}
                  onTouchCancel={stopDrawing(operatorsCanvasRef, setIsDrawingOperator, setOperatorSignature)}
                />
                <Button type="button" variant="outline" size="sm" onClick={clearSignature(operatorsCanvasRef, setOperatorSignature)} className="gap-2 mt-2">
                  <Eraser className="h-4 w-4" /> Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer note */}
      <Card className="border-muted bg-muted/10">
        <CardContent className="py-3 text-xs text-muted-foreground">
          Printed copies are for reference only and are not controlled. It is the responsibility of users of this document to ensure that they are using the recent version.
        </CardContent>
      </Card>

      <Separator />

      {/* Submit */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Job Card"}
        </Button>
      </div>
    </form>
  )
}