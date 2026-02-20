'use client'

import React, { useState, useMemo } from "react"
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
  HARVESTER_OPERATORS, 
  HARVESTER_FLEET_NUMBERS 
} from "@/lib/cintasign-constants"
import type { CintasignUnit } from "@/lib/cintasign-constants"

interface HarvestingEntry {
    fleetNo: string;
    operator: string;
    shift: string;
    compartment: string;
    treeVolume: string;
    treesDebarked: string;
    totalTons: string;
    hoursOpen: string;
    hoursClose: string;
    hoursWorked: string;
    tonsPerHour: string;
    treesPerHour: string;
}

interface CintasignHarvestingFormProps {
  brand: 'ringomode' | 'cintasign'
}

export function CintasignHarvestingForm({ brand }: CintasignHarvestingFormProps) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        day: "",
        farm: "",
        automaticNumber: "9008",
        unit: "CNT1" as CintasignUnit,
        fleetEntries: Array(8).fill(null).map(() => ({
            fleetNo: "", operator: "", shift: "", compartment: "", treeVolume: "", treesDebarked: "", totalTons: "",
            hoursOpen: "", hoursClose: "", hoursWorked: "", tonsPerHour: "", treesPerHour: ""
        })),
        breakdownEntries: Array(8).fill(null).map((_, i) => ({
            machineId: ((i + 1) * 10).toString(),
            operator: "", stop: "", start: "", details: ""
        }))
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Calculate grand total of all "Total Tons" fields
    const grandTotalTons = useMemo(() => {
        return formData.fleetEntries.reduce((sum, entry) => {
            const tons = parseFloat(entry.totalTons) || 0;
            return sum + tons;
        }, 0);
    }, [formData.fleetEntries]);

    const handleFleetChange = (index: number, field: keyof HarvestingEntry, value: string) => {
        const newFleet = [...formData.fleetEntries]
        newFleet[index] = { ...newFleet[index], [field]: value }
        setFormData(prev => ({ ...prev, fleetEntries: newFleet }))
    }

    const handleBreakdownChange = (index: number, field: string, value: string) => {
        const newBreakdown = [...formData.breakdownEntries]
        newBreakdown[index] = { ...newBreakdown[index], [field]: value }
        setFormData(prev => ({ ...prev, breakdownEntries: newBreakdown }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const submissionData = {
            formType: "cintasign-harvesting",
            formTitle: "Cintasign Harvesting Sheet",
            submittedBy: "Harvest Manager",
            hasDefects: false,
            brand: brand, // ✅ use prop
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

            setIsSubmitted(true)
            toast.success("Harvesting report submitted successfully!")
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
                            Your Cintasign Harvesting report has been recorded.
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
                    <CardTitle className="text-2xl text-foreground">Cintasign Harvesting Sheet</CardTitle>
                    <CardDescription>Document Ref: CINT/HARV/001 | Rev. 1 | 01.03.2025</CardDescription>
                </CardHeader>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-amber-800">
                        General Instructions for Harvesting:
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-amber-700">
                        Complete all harvesting fleet and breakdown details for the day.
                    </p>
                </CardContent>
            </Card>

            {/* Common Information + Unit */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Harvesting Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-5">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input required type="date" value={formData.date} onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Day</Label>
                        <Input required value={formData.day} onChange={e => setFormData(prev => ({ ...prev, day: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Farm</Label>
                        <Select value={formData.farm} onValueChange={v => setFormData(prev => ({ ...prev, farm: v }))}>
                            <SelectTrigger><SelectValue placeholder="Select farm" /></SelectTrigger>
                            <SelectContent>
                                {FARMS.map(farm => <SelectItem key={farm} value={farm}>{farm}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Automatic Number</Label>
                        <Input value={formData.automaticNumber} onChange={e => setFormData(prev => ({ ...prev, automaticNumber: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Cintasign Unit</Label>
                        <Select value={formData.unit} onValueChange={(v) => setFormData(prev => ({ ...prev, unit: v as CintasignUnit }))}>
                            <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                            <SelectContent>
                                {CINTASIGN_UNITS.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Harvesting Fleet Entries */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Harvesting Fleet Details</CardTitle>
                    <CardDescription>Enter data for up to 8 harvesters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {formData.fleetEntries.map((entry, idx) => (
                        <div key={idx} className="space-y-4 border-b border-gray-200 pb-6 last:border-none">
                            <h4 className="text-sm font-semibold text-primary">Harvester {idx + 1}</h4>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-7">
                                <div className="space-y-2">
                                    <Label className="text-xs">Fleet No</Label>
                                    <Select value={entry.fleetNo} onValueChange={v => handleFleetChange(idx, "fleetNo", v)}>
                                        <SelectTrigger><SelectValue placeholder="Select fleet" /></SelectTrigger>
                                        <SelectContent>
                                            {HARVESTER_FLEET_NUMBERS.map(fn => <SelectItem key={fn} value={fn}>{fn}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Operator</Label>
                                    <Select value={entry.operator} onValueChange={v => handleFleetChange(idx, "operator", v)}>
                                        <SelectTrigger><SelectValue placeholder="Select operator" /></SelectTrigger>
                                        <SelectContent>
                                            {HARVESTER_OPERATORS.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Shift</Label>
                                    <Select value={entry.shift} onValueChange={v => handleFleetChange(idx, "shift", v)}>
                                        <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
                                        <SelectContent>
                                            {SHIFTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Compartment</Label>
                                    <Input value={entry.compartment} onChange={e => handleFleetChange(idx, "compartment", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Tree Volume</Label>
                                    <Input value={entry.treeVolume} onChange={e => handleFleetChange(idx, "treeVolume", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Trees Debarked</Label>
                                    <Input value={entry.treesDebarked} onChange={e => handleFleetChange(idx, "treesDebarked", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Total Tons</Label>
                                    <Input 
                                        type="number" 
                                        step="0.01" 
                                        value={entry.totalTons} 
                                        onChange={e => handleFleetChange(idx, "totalTons", e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                                <div className="space-y-2">
                                    <Label className="text-xs">Hours Open</Label>
                                    <Input value={entry.hoursOpen} onChange={e => handleFleetChange(idx, "hoursOpen", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Hours Close</Label>
                                    <Input value={entry.hoursClose} onChange={e => handleFleetChange(idx, "hoursClose", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Hours Worked</Label>
                                    <Input value={entry.hoursWorked} onChange={e => handleFleetChange(idx, "hoursWorked", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Tons Per Hour</Label>
                                    <Input value={entry.tonsPerHour} onChange={e => handleFleetChange(idx, "tonsPerHour", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Trees Per Hour</Label>
                                    <Input value={entry.treesPerHour} onChange={e => handleFleetChange(idx, "treesPerHour", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Grand Total Tons Summary */}
            <Card className="border-primary/20 bg-primary/5">
                <CardContent className="py-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Grand Total Tons (all harvesters):</span>
                        <span className="text-primary">{grandTotalTons.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Breakdown Hours And Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Breakdown Hours And Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-5 gap-4 px-2">
                        {["Machine ID", "Operator", "Stop", "Start", "Details"].map(header => (
                            <Label key={header} className="text-xs font-medium text-muted-foreground text-center">{header}</Label>
                        ))}
                    </div>
                    <div className="mt-4 space-y-4">
                        {formData.breakdownEntries.map((entry, idx) => (
                            <div key={idx} className="grid grid-cols-5 gap-4 items-center">
                                <div className="text-sm font-medium text-foreground pl-2">Machine {entry.machineId}</div>
                                <Select value={entry.operator} onValueChange={v => handleBreakdownChange(idx, "operator", v)}>
                                    <SelectTrigger><SelectValue placeholder="Select operator" /></SelectTrigger>
                                    <SelectContent>
                                        {HARVESTER_OPERATORS.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Input className="h-9" value={entry.stop} onChange={e => handleBreakdownChange(idx, "stop", e.target.value)} />
                                <Input className="h-9" value={entry.start} onChange={e => handleBreakdownChange(idx, "start", e.target.value)} />
                                <Input className="h-9" value={entry.details} onChange={e => handleBreakdownChange(idx, "details", e.target.value)} />
                            </div>
                        ))}
                    </div>
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
                <div><span className="font-semibold">Document Reference</span><br />CINT / HARV / 001</div>
                <div><span className="font-semibold">Author</span><br />Harvest Manager</div>
                <div><span className="font-semibold">Revision</span><br />1</div>
                <div><span className="font-semibold">Creation Date</span><br />01.03.2025</div>
            </div>
        </form>
    )
}