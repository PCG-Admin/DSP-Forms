'use client'

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { BrandLogo } from "@/components/brand-logo"
import { Separator } from "@/components/ui/separator"
import { 
  CINTASIGN_UNITS,
  SHIFTS, 
  FARMS, 
  LOADING_OPERATORS, 
  LOADING_FLEET_NUMBERS, 
  TRANSPORT_COMPANIES 
} from "@/lib/cintasign-constants"
import type { CintasignUnit } from "@/lib/cintasign-constants"

interface LoadingEntry {
    deliveryNoteNo: string;
    compNo: string;
    transportCompany: string;
    longHaulReg: string;
    driverName: string;
}

interface CintasignLoadingFormProps {
  brand: 'ringomode' | 'cintasign'
}

export function CintasignLoadingForm({ brand }: CintasignLoadingFormProps) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        day: "",
        farm: "",
        automaticNumber: "",
        unit: "", // start empty
        operator: "",
        fleetNo: "",
        shift: "",
        entries: Array(69).fill(null).map(() => ({
            deliveryNoteNo: "", compNo: "", transportCompany: "", longHaulReg: "", driverName: ""
        }))
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // State for the next document number fetched from server
    const [nextNumber, setNextNumber] = useState<number | null>(null)

    // Fetch next document number on mount
    useEffect(() => {
        const fetchNextNumber = async () => {
            try {
                const res = await fetch('/api/next-document?formType=cintasign-loading')
                if (res.ok) {
                    const data = await res.json()
                    setNextNumber(data.nextNumber)
                    // Set the automatic number after fetching
                    const d = new Date()
                    const yymmdd = `${d.getFullYear().toString().slice(-2)}${(d.getMonth()+1).toString().padStart(2,"0")}${d.getDate().toString().padStart(2,"0")}`
                    const num = data.nextNumber
                    setFormData(prev => ({ ...prev, automaticNumber: `${yymmdd}-${num}` }))
                } else {
                    console.error('Failed to fetch next document number')
                }
            } catch (error) {
                console.error('Error fetching next document number:', error)
            }
        }
        fetchNextNumber()
    }, [])

    const handleEntryChange = (index: number, field: keyof LoadingEntry, value: string) => {
        const newEntries = [...formData.entries]
        newEntries[index] = { ...newEntries[index], [field]: value }
        setFormData(prev => ({ ...prev, entries: newEntries }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const submissionData = {
            formType: "cintasign-loading",
            formTitle: "Cintasign Loading Sheet",
            submittedBy: "Loading Supervisor",
            hasDefects: false,
            brand: brand,
            data: formData,
        }

        try {
            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(submissionData),
            })

            if (!response.ok) throw new Error("Submission failed")

            // --- Webhook call (fire‑and‑forget) ---
            const makeWebhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
            if (makeWebhookUrl) {
                const formBody = new URLSearchParams()
                formBody.append('data', JSON.stringify({
                    formTitle: "Cintasign Loading Sheet",
                    documentNo: formData.automaticNumber,
                    brand,
                    submittedBy: "Loading Supervisor",
                    submittedAt: new Date().toISOString(),
                    hasDefects: false,
                    defectDetails: "",
                    inspectionData: formData,
                }))

                fetch(makeWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formBody,
                }).catch(err => console.error('Webhook error:', err))
            }

            setIsSubmitted(true)
            toast.success("Loading report submitted successfully!")
        } catch (error) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Submission Successful!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            Your Cintasign Loading report has been recorded.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" onClick={() => window.location.href = "/"} className="w-full">
                                Back to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6 p-4 pb-12 lg:p-8 lg:pb-16">
            <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-3">
                        <BrandLogo brand={brand} width={160} height={50} />
                    </div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">HSE Management System</div>
                    <CardTitle className="text-2xl text-foreground">Cintasign Loading Sheet</CardTitle>
                    <CardDescription>Document Ref: CINT/LOAD/001 | Rev. 1 | 01.03.2025</CardDescription>
                </CardHeader>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-amber-800">
                        General Instructions for Loading:
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-amber-700">
                        Complete all loading details for the day. Up to 69 loading records can be entered.
                    </p>
                </CardContent>
            </Card>

            {/* Loading Information – two‑row grid for better organisation */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Loading Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* First row: Date, Day, Farm, Automatic Number */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="day">Day</Label>
                            <Input
                                id="day"
                                required
                                value={formData.day}
                                onChange={e => setFormData(prev => ({ ...prev, day: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="farm">Farm</Label>
                            <Select value={formData.farm} onValueChange={v => setFormData(prev => ({ ...prev, farm: v }))}>
                                <SelectTrigger id="farm">
                                    <SelectValue placeholder="Select farm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FARMS.map(farm => <SelectItem key={farm} value={farm}>{farm}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="autoNumber">Automatic Number</Label>
                            <Input
                                id="autoNumber"
                                value={formData.automaticNumber}
                                readOnly
                                className="bg-muted"
                            />
                        </div>
                    </div>

                    {/* Second row: Cintasign Unit, Operator, Fleet No, Shift */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="unit">Cintasign Unit</Label>
                            <Select 
                                value={formData.unit} 
                                onValueChange={(v) => setFormData(prev => ({ ...prev, unit: v }))}
                            >
                                <SelectTrigger id="unit">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CINTASIGN_UNITS.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="operator">Operator (Supervisor)</Label>
                            <Select value={formData.operator} onValueChange={v => setFormData(prev => ({ ...prev, operator: v }))}>
                                <SelectTrigger id="operator">
                                    <SelectValue placeholder="Select operator" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOADING_OPERATORS.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fleetNo">Fleet No</Label>
                            <Select value={formData.fleetNo} onValueChange={v => setFormData(prev => ({ ...prev, fleetNo: v }))}>
                                <SelectTrigger id="fleetNo">
                                    <SelectValue placeholder="Select fleet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOADING_FLEET_NUMBERS.map(fn => <SelectItem key={fn} value={fn}>{fn}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shift">Shift</Label>
                            <Select value={formData.shift} onValueChange={v => setFormData(prev => ({ ...prev, shift: v }))}>
                                <SelectTrigger id="shift">
                                    <SelectValue placeholder="Select shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SHIFTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Loading Entries Table – with fixed column widths and horizontal scroll */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Loading Details</CardTitle>
                    <CardDescription>Enter up to 69 loading records</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full min-w-[800px] table-auto border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-muted">
                                <th className="w-32 p-2 text-left font-medium">Delivery Note No</th>
                                <th className="w-20 p-2 text-left font-medium">Comp No</th>
                                <th className="w-36 p-2 text-left font-medium">Transport Company</th>
                                <th className="w-36 p-2 text-left font-medium">Long Haul Reg</th>
                                <th className="w-36 p-2 text-left font-medium">Driver Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.entries.map((entry, idx) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-muted/20">
                                    <td className="p-1">
                                        <Input
                                            value={entry.deliveryNoteNo}
                                            onChange={e => handleEntryChange(idx, "deliveryNoteNo", e.target.value)}
                                            className="h-9 w-full"
                                        />
                                    </td>
                                    <td className="p-1">
                                        <Input
                                            value={entry.compNo}
                                            onChange={e => handleEntryChange(idx, "compNo", e.target.value)}
                                            className="h-9 w-full"
                                        />
                                    </td>
                                    <td className="p-1">
                                        <Select value={entry.transportCompany} onValueChange={v => handleEntryChange(idx, "transportCompany", v)}>
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TRANSPORT_COMPANIES.map(tc => <SelectItem key={tc} value={tc}>{tc}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-1">
                                        <Input
                                            value={entry.longHaulReg}
                                            onChange={e => handleEntryChange(idx, "longHaulReg", e.target.value)}
                                            className="h-9 w-full"
                                        />
                                    </td>
                                    <td className="p-1">
                                        <Select value={entry.driverName} onValueChange={v => handleEntryChange(idx, "driverName", v)}>
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LOADING_OPERATORS.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card className="border-muted bg-muted/5">
                <CardContent className="py-3 text-xs text-muted-foreground">
                    <p>All data is recorded and stored for operational review.</p>
                </CardContent>
            </Card>

            <Separator />

            <div className="flex items-center justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2 bg-[#fbb016] hover:bg-[#e5a014] text-black font-bold">
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground border-t pt-4">
                <div><span className="font-semibold">Document Reference</span><br />CINT / LOAD / 001</div>
                <div><span className="font-semibold">Author</span><br />Loading Supervisor</div>
                <div><span className="font-semibold">Revision</span><br />1</div>
                <div><span className="font-semibold">Creation Date</span><br />01.03.2025</div>
            </div>
        </form>
    )
}