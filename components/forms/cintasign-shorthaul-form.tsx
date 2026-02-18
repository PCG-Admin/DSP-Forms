"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowLeft, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { exportSubmissionToPDF } from "@/lib/export-utils"
import type { Submission, FleetEntry, BreakdownEntry } from "@/lib/types"
import { BrandLogo } from "@/components/brand-logo"
import { Separator } from "@/components/ui/separator"

export default function CintasignShorthaulForm() {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        day: "",
        farm: "",
        automaticNumber: "8826",
        fleetEntries: Array(8).fill(null).map((_, i) => ({
            fleetNo: "",
            operator: "",
            shift: "",
            compartment: "",
            noOfLoads: "",
            estTons: "",
            hoursOpen: "",
            hoursClose: "",
            hoursWorked: "",
            loadsPerHour: "",
            tonsPerHour: ""
        })),
        breakdownEntries: Array(8).fill(null).map((_, i) => ({
            machineId: ((i + 1) * 10).toString(),
            operator: "",
            stop: "",
            start: "",
            details: ""
        }))
    })

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submissionData, setSubmissionData] = useState<Submission | null>(null)

    const handleFleetChange = (index: number, field: keyof FleetEntry, value: string) => {
        const newFleet = [...formData.fleetEntries]
        newFleet[index] = { ...newFleet[index], [field]: value }
        setFormData(prev => ({ ...prev, fleetEntries: newFleet }))
    }

    const handleBreakdownChange = (index: number, field: keyof BreakdownEntry, value: string) => {
        const newBreakdown = [...formData.breakdownEntries]
        newBreakdown[index] = { ...newBreakdown[index], [field]: value }
        setFormData(prev => ({ ...prev, breakdownEntries: newBreakdown }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // In a real implementation, you would send this to your API
        // For now, we store in localStorage as a placeholder
        const submission: Submission = {
            id: Math.random().toString(36).substring(2, 9),
            formType: "cintasign-shorthaul",
            formTitle: "Cintasign Shorthaul Trip Sheet",
            submittedAt: new Date().toISOString(),
            submittedBy: "Trip Manager",
            data: formData,
            hasDefects: false,
            brand: "cintasign", // or get from cookie
        }
        const existing = JSON.parse(localStorage.getItem("form_submissions") || "[]")
        localStorage.setItem("form_submissions", JSON.stringify([...existing, submission]))

        setSubmissionData(submission)
        setIsSubmitted(true)
        toast.success("Logistics report submitted successfully!")
    }

    if (isSubmitted && submissionData) {
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
                            Your Cintasign Shorthaul report has been recorded.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => exportSubmissionToPDF(submissionData)}
                                className="w-full gap-2 bg-primary hover:bg-primary/90"
                            >
                                <Image src="/images/pdf-icon.png" alt="PDF" width={20} height={20} className="invert brightness-0" />
                                Download PDF
                            </Button>
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
        <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-6 p-4 pb-12 lg:p-8 lg:pb-16">
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
                        <BrandLogo width={160} height={50} />
                    </div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">HSE Management System</div>
                    <CardTitle className="text-2xl text-foreground">Cintasign Shorthaul Trip Sheet</CardTitle>
                    <CardDescription>Document Ref: CIN/TRIP/001 | Rev. 1 | 01.03.2025</CardDescription>
                </CardHeader>
            </Card>

            {/* General Instructions */}
            <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-amber-800">
                        General Instructions for Trip Sheet:
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-amber-700">
                        Complete all fleet and breakdown details for the day. All fields are required for accurate reporting.
                    </p>
                </CardContent>
            </Card>

            {/* Top Metadata Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Trip Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Date</Label>
                        <Input
                            required
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Day</Label>
                        <Input
                            required
                            value={formData.day}
                            onChange={e => setFormData(prev => ({ ...prev, day: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Farm</Label>
                        <Input
                            required
                            value={formData.farm}
                            onChange={e => setFormData(prev => ({ ...prev, farm: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Automatic Number</Label>
                        <div className="text-lg font-bold text-foreground">{formData.automaticNumber}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Fleet Entries */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Fleet Details</CardTitle>
                    <CardDescription>Enter data for up to 8 fleet units</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {formData.fleetEntries.map((entry, idx) => (
                        <div key={idx} className="space-y-4 border-b border-gray-200 pb-6 last:border-none">
                            <h4 className="text-sm font-semibold text-primary">Unit {idx + 1}</h4>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                                <div className="space-y-2">
                                    <Label className="text-xs">Fleet No</Label>
                                    <Input value={entry.fleetNo} onChange={e => handleFleetChange(idx, "fleetNo", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Operator</Label>
                                    <Input value={entry.operator} onChange={e => handleFleetChange(idx, "operator", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Shift</Label>
                                    <Input value={entry.shift} onChange={e => handleFleetChange(idx, "shift", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Compartment</Label>
                                    <Input value={entry.compartment} onChange={e => handleFleetChange(idx, "compartment", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">No Of Loads</Label>
                                    <Input value={entry.noOfLoads} onChange={e => handleFleetChange(idx, "noOfLoads", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">EST. Tons</Label>
                                    <Input value={entry.estTons} onChange={e => handleFleetChange(idx, "estTons", e.target.value)} />
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
                                    <Label className="text-xs">Loads Per Hour</Label>
                                    <Input value={entry.loadsPerHour} onChange={e => handleFleetChange(idx, "loadsPerHour", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Tons Per Hour</Label>
                                    <Input value={entry.tonsPerHour} onChange={e => handleFleetChange(idx, "tonsPerHour", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
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
                                <Input className="h-9" value={entry.operator} onChange={e => handleBreakdownChange(idx, "operator", e.target.value)} />
                                <Input className="h-9" value={entry.stop} onChange={e => handleBreakdownChange(idx, "stop", e.target.value)} />
                                <Input className="h-9" value={entry.start} onChange={e => handleBreakdownChange(idx, "start", e.target.value)} />
                                <Input className="h-9" value={entry.details} onChange={e => handleBreakdownChange(idx, "details", e.target.value)} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <Card className="border-muted bg-muted/5">
                <CardContent className="py-3 text-xs text-muted-foreground">
                    <p>All data is recorded and stored for operational review.</p>
                </CardContent>
            </Card>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                </Button>
                <Button
                    type="submit"
                    className="gap-2 bg-[#fbb016] hover:bg-[#e5a014] text-black font-bold"
                >
                    <Send className="h-4 w-4" />
                    Submit Report
                </Button>
            </div>

            {/* Footer with document reference */}
            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground border-t pt-4">
                <div>
                    <span className="font-semibold">Document Reference No.</span>
                    <br />
                    CIN / TRIP / 001
                </div>
                <div>
                    <span className="font-semibold">Author</span>
                    <br />
                    Logistics Manager
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
        </form>
    )
}