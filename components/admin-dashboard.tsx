"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Submission, CheckStatus } from "@/lib/types"
import {
  exportSubmissionsToCSV,
  exportSingleSubmissionToCSV,
  exportSubmissionToPDF,
} from "@/lib/export-utils"
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Search,
  RefreshCw,
  Eye,
  Calendar,
  User,
  FileText,
  FileDown,
  FileSpreadsheet,
  MoreHorizontal,
  Printer,
  Truck,
  Construction,
  Trees,
  Container,
  Wrench,
  Bus,
  Combine,
  Logs,
  Fuel,
  Tractor,
  Droplets,
  ClipboardCheck,
  Trash2, // ✅ Added for delete
} from "lucide-react"
import { toast } from "sonner"

// ============================================================================
// TYPE GUARDS
// ============================================================================
function hasItems(data: any): data is { items: Record<string, CheckStatus> } {
  return data && typeof data === 'object' && 'items' in data;
}
function hasDefectDetails(data: any): data is { defectDetails: string } {
  return data && typeof data === 'object' && 'defectDetails' in data;
}
function hasSignature(data: any): data is { signature: string } {
  return data && typeof data === 'object' && 'signature' in data;
}

function StatusBadge({ status }: { status: CheckStatus }) {
  if (!status) return <span className="text-muted-foreground">-</span>
  const map = {
    ok: {
      label: "OK",
      className:
        "bg-[hsl(142,76%,36%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(142,76%,32%)]",
    },
    def: {
      label: "Defect",
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    na: {
      label: "N/A",
      className: "bg-muted text-muted-foreground hover:bg-muted/80",
    },
  }
  const config = map[status]
  return <Badge className={config.className}>{config.label}</Badge>
}

// Brand badge helper
function BrandBadge({ brand }: { brand?: string }) {
  const displayBrand = brand || 'ringomode'; // fallback for old submissions
  const isCintasign = displayBrand === 'cintasign';
  return (
    <Badge variant="outline" className={isCintasign ? "border-blue-500 text-blue-700" : "border-gray-500 text-gray-700"}>
      {displayBrand}
    </Badge>
  );
}

// Form type label (updated to include cintasign-shorthaul)
function formTypeLabel(type: string) {
  switch (type) {
    case "light-delivery":
      return "Light Delivery Vehicle"
    case "excavator-loader":
      return "Excavator Loader"
    case "excavator-harvester":
      return "Excavator Harvester"
    case "lowbed-trailer":
      return "Lowbed & Roll Back Trailer"
    case "mechanic-ldv":
      return "Mechanic LDV"
    case "personal-labour-carrier":
      return "Personal / Labour Carrier"
    case "ponsse-bison":
      return "Ponsse Bison"
    case "self-loading-forwarder":
      return "Self Loading Forwarder"
    case "skidder":
      return "Skidder (Grapple & Cable)"
    case "timber-truck-trailer":
      return "Timber Truck And Trailer"
    case "trailer":
      return "Trailer (Excluding Labour)"
    case "service-diesel-truck":
      return "Service/Diesel Truck"
    case "vehicle-job-card":
      return "Motorised Equipment/Vehicle Job Card"
    case "water-cart-trailer":
      return "Water Cart Trailer & Pressure Washer"
    case "weekly-machinery-condition":
      return "Weekly Machinery Condition Assessment"
    case "bell-timber-truck":
      return "Bell Timber Truck"
    case "daily-attachment-checklist":
      return "Daily Attachment Checklist"
    case "daily-machine-checklist":
      return "Daily Machine Checklist"
    case "dezzi-timber-truck":
      return "Dezzi Timber Truck"
    case "diesel-cart-trailer":
      return "Diesel Cart Trailer"
    case "cintasign-shorthaul":
      return "Cintasign Shorthaul"
    default:
      return type
  }
}

// Form icon mapping (updated for cintasign-shorthaul)
function getFormIcon(type: string) {
  switch (type) {
    case "light-delivery":
      return <Truck className="h-4 w-4 text-muted-foreground" />
    case "excavator-loader":
      return <Construction className="h-4 w-4 text-muted-foreground" />
    case "excavator-harvester":
      return <Trees className="h-4 w-4 text-muted-foreground" />
    case "lowbed-trailer":
      return <Container className="h-4 w-4 text-muted-foreground" />
    case "mechanic-ldv":
      return <Wrench className="h-4 w-4 text-muted-foreground" />
    case "personal-labour-carrier":
      return <Bus className="h-4 w-4 text-muted-foreground" />
    case "ponsse-bison":
      return <Combine className="h-4 w-4 text-muted-foreground" />
    case "self-loading-forwarder":
      return <Tractor className="h-4 w-4 text-muted-foreground" />
    case "skidder":
      return <Logs className="h-4 w-4 text-muted-foreground" />
    case "timber-truck-trailer":
      return <Truck className="h-4 w-4 text-muted-foreground" />
    case "trailer":
      return <Container className="h-4 w-4 text-muted-foreground" />
    case "service-diesel-truck":
      return <Fuel className="h-4 w-4 text-muted-foreground" />
    case "vehicle-job-card":
      return <FileText className="h-4 w-4 text-muted-foreground" />
    case "water-cart-trailer":
      return <Droplets className="h-4 w-4 text-muted-foreground" />
    case "weekly-machinery-condition":
      return <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
    case "bell-timber-truck":
      return <Combine className="h-4 w-4 text-muted-foreground" />
    case "daily-attachment-checklist":
      return <ClipboardList className="h-4 w-4 text-muted-foreground" />
    case "daily-machine-checklist":
      return <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
    case "dezzi-timber-truck":
      return <Truck className="h-4 w-4 text-muted-foreground" />
    case "diesel-cart-trailer":
      return <Container className="h-4 w-4 text-muted-foreground" />
    case "cintasign-shorthaul":
      return <Truck className="h-4 w-4 text-muted-foreground" />
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

function formatFieldKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

// Preview Component – with type guards
function SubmissionPreview({ submission }: { submission: Submission }) {
  const logoPath = submission.brand === 'cintasign' 
    ? '/images/cintasign-logo.jpg' 
    : '/images/ringomode-logo.png';
  const logoAlt = submission.brand === 'cintasign' ? 'Cintasign Logo' : 'Ringomode DSP Logo';

  // Helper to render fleet entries if present (specific to cintasign-shorthaul)
  const renderFleetEntries = () => {
    if (submission.formType !== 'cintasign-shorthaul') return null;
    const data = submission.data as any; // we know it's the shorthaul type
    if (!data.fleetEntries || data.fleetEntries.length === 0) return null;
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">Fleet Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left">Fleet No</th>
                  <th className="p-2 text-left">Operator</th>
                  <th className="p-2 text-left">Shift</th>
                  <th className="p-2 text-left">Compartment</th>
                  <th className="p-2 text-left">Loads</th>
                  <th className="p-2 text-left">Est Tons</th>
                  <th className="p-2 text-left">Open</th>
                  <th className="p-2 text-left">Close</th>
                  <th className="p-2 text-left">Worked</th>
                  <th className="p-2 text-left">Loads/hr</th>
                  <th className="p-2 text-left">Tons/hr</th>
                </tr>
              </thead>
              <tbody>
                {data.fleetEntries.map((entry: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{entry.fleetNo}</td>
                    <td className="p-2">{entry.operator}</td>
                    <td className="p-2">{entry.shift}</td>
                    <td className="p-2">{entry.compartment}</td>
                    <td className="p-2">{entry.noOfLoads}</td>
                    <td className="p-2">{entry.estTons}</td>
                    <td className="p-2">{entry.hoursOpen}</td>
                    <td className="p-2">{entry.hoursClose}</td>
                    <td className="p-2">{entry.hoursWorked}</td>
                    <td className="p-2">{entry.loadsPerHour}</td>
                    <td className="p-2">{entry.tonsPerHour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderBreakdownEntries = () => {
    if (submission.formType !== 'cintasign-shorthaul') return null;
    const data = submission.data as any;
    if (!data.breakdownEntries || data.breakdownEntries.length === 0) return null;
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">Breakdown Hours & Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left">Machine ID</th>
                  <th className="p-2 text-left">Operator</th>
                  <th className="p-2 text-left">Stop</th>
                  <th className="p-2 text-left">Start</th>
                  <th className="p-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {data.breakdownEntries.map((entry: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{entry.machineId}</td>
                    <td className="p-2">{entry.operator}</td>
                    <td className="p-2">{entry.stop}</td>
                    <td className="p-2">{entry.start}</td>
                    <td className="p-2">{entry.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 print:space-y-4" id="submission-preview">
      {/* Print Header with dynamic logo */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={logoPath}
            alt={logoAlt}
            width={140}
            height={45}
            className="object-contain"
          />
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">HSE Management System</p>
          <p className="text-xs text-muted-foreground">
            {new Date(submission.submittedAt).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <Separator />

      {/* Title + Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{submission.formTitle}</h2>
        {submission.hasDefects ? (
          <Badge className="bg-destructive text-destructive-foreground">Defects Found</Badge>
        ) : (
          <Badge className="bg-[hsl(142,76%,36%)] text-[hsl(0,0%,100%)]">Clean</Badge>
        )}
      </div>

      {/* Form Fields – always show basic fields */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">Form Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">Submitted By</span>
              <span className="font-medium text-foreground">{submission.submittedBy}</span>
            </div>
            {Object.entries(submission.data)
              .filter(
                ([key]) =>
                  key !== "items" &&
                  key !== "hasDefects" &&
                  key !== "defectDetails" &&
                  key !== "signature" &&
                  key !== "fleetEntries" &&
                  key !== "breakdownEntries"
              )
              .map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatFieldKey(key)}
                  </span>
                  <span className="font-medium text-foreground">{String(value) || "-"}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Conditional rendering based on form type */}
      {submission.formType === "cintasign-shorthaul" ? (
        <>
          {renderFleetEntries()}
          {renderBreakdownEntries()}
        </>
      ) : (
        <>
          {/* Inspection Items – only if data has items */}
          {hasItems(submission.data) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">Inspection Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center justify-between rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
                  <span>Item</span>
                  <span>Status</span>
                </div>
                {Object.entries(submission.data.items).map(([item, status], idx) => (
                  <div
                    key={item}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                      status === "def"
                        ? "bg-destructive/5"
                        : idx % 2 === 0
                          ? "bg-muted/30"
                          : "bg-card"
                    }`}
                  >
                    <span className="text-foreground">{item}</span>
                    <StatusBadge status={status as CheckStatus} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Defect Details – only if data has defectDetails */}
          {hasDefectDetails(submission.data) && submission.data.defectDetails && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Defect Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{submission.data.defectDetails}</p>
              </CardContent>
            </Card>
          )}

          {/* Signature – only if data has signature */}
          {hasSignature(submission.data) && submission.data.signature && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="inline-block border-b-2 border-foreground/20 pb-1">
                  <p className="font-serif text-base italic text-foreground">
                    {submission.data.signature}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

// Main Dashboard
interface AdminDashboardProps {
  initialSubmissions?: Submission[];
}

export function AdminDashboard({ initialSubmissions = [] }: AdminDashboardProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [defectFilter, setDefectFilter] = useState<string>("all")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [dialogTab, setDialogTab] = useState<string>("preview")

  // Notification states
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/submissions")
      const data = await res.json()
      if (Array.isArray(data)) {
        setSubmissions(data)
      } else {
        console.error("Expected array but got:", data)
      }
    } catch {
      console.error("Failed to fetch submissions")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }, [])

  const markAsRead = async (submissionId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      })
      
      setNotifications(prev => prev.filter(n => n.id !== submissionId))
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === submissionId ? { ...sub, isRead: true } : sub
        )
      )
      
      toast.success("Marked as read")
    } catch (error) {
      toast.error("Failed to mark as read")
    }
  }

  // ✅ Delete function
  const handleDelete = async (submissionId: string) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      // Remove from local state
      setSubmissions(prev => prev.filter(s => s.id !== submissionId));
      toast.success("Submission deleted successfully");
    } catch (error) {
      toast.error("Failed to delete submission");
    }
  };

  useEffect(() => {
    fetchSubmissions()
    fetchNotifications()
    
    const interval = setInterval(() => {
      fetchNotifications()
      fetchSubmissions()
    }, 10000)
    
    return () => clearInterval(interval)
  }, [fetchSubmissions, fetchNotifications])

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.formTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || s.formType === typeFilter
    const matchesDefect =
      defectFilter === "all" ||
      (defectFilter === "defects" && s.hasDefects) ||
      (defectFilter === "clean" && !s.hasDefects)
    return matchesSearch && matchesType && matchesDefect
  })

  const totalSubmissions = submissions.length
  const defectCount = submissions.filter((s) => s.hasDefects).length
  const cleanCount = submissions.filter((s) => !s.hasDefects).length
  const todayCount = submissions.filter(
    (s) => new Date(s.submittedAt).toDateString() === new Date().toDateString()
  ).length

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error("No submissions to export")
      return
    }
    exportSubmissionsToCSV(filtered)
    toast.success(`Exported ${filtered.length} submission(s) to CSV`)
  }

  const handleSingleCSV = (sub: Submission) => {
    exportSingleSubmissionToCSV(sub)
    toast.success("Exported submission to CSV")
  }

  const handleSinglePDF = async (sub: Submission) => {
    try {
      await exportSubmissionToPDF(sub)
      toast.success("PDF downloaded successfully")
    } catch {
      toast.error("Failed to generate PDF")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage HSE inspection submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent relative"
              onClick={() => {
                if (notifications.length > 0) {
                  const first = notifications[0]
                  toast.info(
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold">{first.title}</p>
                      <p className="text-sm">{first.message}</p>
                      <Button 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => {
                          markAsRead(first.id)
                          const sub = submissions.find(s => s.id === first.id)
                          if (sub) {
                            setSelectedSubmission(sub)
                            setDialogTab("preview")
                          }
                        }}
                      >
                        View Submission
                      </Button>
                    </div>
                  )
                }
              }}
            >
              <span className="relative">
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline">Notifications</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="gap-2 bg-transparent"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export All CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{totalSubmissions}</div>
              <div className="text-xs text-muted-foreground">Total Submissions</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{defectCount}</div>
              <div className="text-xs text-muted-foreground">With Defects</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(142,76%,36%)]/10">
              <CheckCircle2 className="h-5 w-5 text-[hsl(142,76%,36%)]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{cleanCount}</div>
              <div className="text-xs text-muted-foreground">Clean Inspections</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{todayCount}</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Submissions</CardTitle>
          <CardDescription>
            Filter and review all submitted inspection checklists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or form type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Form Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="light-delivery">Light Delivery</SelectItem>
                <SelectItem value="excavator-loader">Excavator Loader</SelectItem>
                <SelectItem value="excavator-harvester">Excavator Harvester</SelectItem>
                <SelectItem value="lowbed-trailer">Lowbed & Roll Back</SelectItem>
                <SelectItem value="mechanic-ldv">Mechanic LDV</SelectItem>
                <SelectItem value="personal-labour-carrier">Labour Carrier</SelectItem>
                <SelectItem value="ponsse-bison">Ponsse Bison</SelectItem>
                <SelectItem value="self-loading-forwarder">Self Loading Forwarder</SelectItem>
                <SelectItem value="skidder">Skidder</SelectItem>
                <SelectItem value="timber-truck-trailer">Timber Truck</SelectItem>
                <SelectItem value="trailer">Trailer</SelectItem>
                <SelectItem value="service-diesel-truck">Service Diesel</SelectItem>
                <SelectItem value="vehicle-job-card">Job Card</SelectItem>
                <SelectItem value="water-cart-trailer">Water Cart</SelectItem>
                <SelectItem value="weekly-machinery-condition">Weekly Machinery</SelectItem>
                <SelectItem value="bell-timber-truck">Bell Timber</SelectItem>
                <SelectItem value="daily-attachment-checklist">Daily Attachment</SelectItem>
                <SelectItem value="daily-machine-checklist">Daily Machine</SelectItem>
                <SelectItem value="dezzi-timber-truck">Dezzi Timber</SelectItem>
                <SelectItem value="diesel-cart-trailer">Diesel Cart</SelectItem>
                <SelectItem value="cintasign-shorthaul">Cintasign Shorthaul</SelectItem>
              </SelectContent>
            </Select>
            <Select value={defectFilter} onValueChange={setDefectFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="defects">With Defects</SelectItem>
                <SelectItem value="clean">Clean Only</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubmissions}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No submissions found
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {totalSubmissions === 0
                  ? "Submissions will appear here once users complete inspection forms."
                  : "Try adjusting your filters to find what you're looking for."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground">Submitted By</TableHead>
                    <TableHead className="text-foreground">Form Type</TableHead>
                    <TableHead className="text-foreground">Brand</TableHead>
                    <TableHead className="text-foreground">Date</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-right text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((sub) => (
                    <TableRow
                      key={sub.id}
                      className={`${sub.hasDefects ? "bg-destructive/5" : ""} ${!sub.isRead ? "border-l-4 border-l-blue-500" : ""}`}
                    >
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {sub.submittedBy}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFormIcon(sub.formType)}
                          <span className="text-foreground">
                            {formTypeLabel(sub.formType)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <BrandBadge brand={sub.brand} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(sub.submittedAt).toLocaleDateString("en-ZA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        {sub.hasDefects ? (
                          <Badge className="bg-destructive text-destructive-foreground">
                            Defects Found
                          </Badge>
                        ) : (
                          <Badge className="bg-[hsl(142,76%,36%)] text-[hsl(0,0%,100%)]">
                            Clean
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(sub)
                              setDialogTab("preview")
                              if (!sub.isRead) {
                                markAsRead(sub.id)
                              }
                            }}
                            className="gap-2 text-primary"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          
                          {!sub.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(sub.id)}
                              className="gap-2 text-green-600"
                              title="Mark as read"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Mark Read</span>
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open export menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSubmission(sub)
                                  setDialogTab("preview")
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSinglePDF(sub)}>
                                <FileDown className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSingleCSV(sub)}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Download CSV
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {/* ✅ Delete button */}
                              <DropdownMenuItem 
                                onClick={() => handleDelete(sub.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail / Preview Dialog */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => {
          if (!open && selectedSubmission && !selectedSubmission.isRead) {
            markAsRead(selectedSubmission.id)
          }
          setSelectedSubmission(null)
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedSubmission?.formTitle}
            </DialogTitle>
            <DialogDescription>
              Submitted by {selectedSubmission?.submittedBy} on{" "}
              {selectedSubmission &&
                new Date(selectedSubmission.submittedAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <Tabs
              value={dialogTab}
              onValueChange={setDialogTab}
              className="flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="preview" className="gap-2">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="data" className="gap-2">
                    <FileText className="h-3.5 w-3.5" />
                    Raw Data
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSinglePDF(selectedSubmission)}
                    className="gap-2 bg-transparent text-xs"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSingleCSV(selectedSubmission)}
                    className="gap-2 bg-transparent text-xs"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="gap-2 bg-transparent text-xs"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print
                  </Button>
                </div>
              </div>

              <TabsContent
                value="preview"
                className="mt-4 flex-1 overflow-hidden"
              >
                <ScrollArea className="h-[55vh] pr-4">
                  <SubmissionPreview submission={selectedSubmission} />
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="data"
                className="mt-4 flex-1 overflow-hidden"
              >
                <ScrollArea className="h-[55vh] pr-4">
                  <div className="space-y-4">
                    {/* Overall Status */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Overall Status:
                      </span>
                      {selectedSubmission.hasDefects ? (
                        <Badge className="bg-destructive text-destructive-foreground">
                          Defects Found
                        </Badge>
                      ) : (
                        <Badge className="bg-[hsl(142,76%,36%)] text-[hsl(0,0%,100%)]">
                          Clean
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    {/* Raw Data - pretty‑printed JSON for better visibility */}
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-foreground">
                        Full Submission Data
                      </h4>
                      <pre className="rounded-md bg-muted p-3 text-xs overflow-auto">
                        {JSON.stringify(selectedSubmission, null, 2)}
                      </pre>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}