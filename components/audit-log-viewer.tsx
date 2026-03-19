"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShieldAlert } from "lucide-react"

interface AuditLog {
  id: string
  created_at: string
  admin_email: string | null
  action: string
  target_id: string | null
  target_email: string | null
  details: Record<string, unknown> | null
}

const actionColors: Record<string, string> = {
  CREATE_USER:       "bg-green-100 text-green-800",
  DELETE_USER:       "bg-red-100 text-red-800",
  CHANGE_PASSWORD:   "bg-yellow-100 text-yellow-800",
  CHANGE_ROLE:       "bg-blue-100 text-blue-800",
  CHANGE_BRAND:      "bg-purple-100 text-purple-800",
  SUBMIT_FORM:       "bg-teal-100 text-teal-800",
  DELETE_SUBMISSION: "bg-orange-100 text-orange-800",
}

const actionLabels: Record<string, string> = {
  CREATE_USER:       "User Created",
  DELETE_USER:       "User Deleted",
  CHANGE_PASSWORD:   "Password Changed",
  CHANGE_ROLE:       "Role Changed",
  CHANGE_BRAND:      "Brand Changed",
  SUBMIT_FORM:       "Form Submitted",
  DELETE_SUBMISSION: "Submission Deleted",
}

function formatDetails(action: string, details: Record<string, unknown> | null, targetEmail: string | null): string {
  if (!details && !targetEmail) return "—"
  if (action === 'CREATE_USER')       return `${targetEmail ?? '—'} · Role: ${details?.role ?? '—'} · Brand: ${details?.brand ?? 'none'}`
  if (action === 'DELETE_USER')       return targetEmail ?? details?.email as string ?? '—'
  if (action === 'CHANGE_PASSWORD')   return targetEmail ?? '—'
  if (action === 'CHANGE_ROLE')       return `${targetEmail ?? '—'} → ${details?.newRole}`
  if (action === 'CHANGE_BRAND')      return `${targetEmail ?? '—'} → ${details?.newBrand}`
  if (action === 'SUBMIT_FORM')       return `${details?.formTitle ?? '—'} · By: ${details?.submittedBy ?? '—'} · Doc: ${details?.documentNo ?? '—'}${details?.hasDefects ? ' · ⚠ Defects' : ''}`
  if (action === 'DELETE_SUBMISSION') return `${details?.formTitle ?? '—'} · By: ${details?.submittedBy ?? '—'} · Doc: ${details?.documentNo ?? '—'}`
  return JSON.stringify(details)
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/audit-logs')
      .then(r => r.json())
      .then(data => { setLogs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = logs.filter(l => {
    const matchesAction = actionFilter === 'all' || l.action === actionFilter
    const matchesSearch = !search.trim() ||
      (l.admin_email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.target_email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(l.details ?? {}).toLowerCase().includes(search.toLowerCase())
    return matchesAction && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl p-4 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} entries</span>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Activity History</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="SUBMIT_FORM">Form Submitted</SelectItem>
                  <SelectItem value="DELETE_SUBMISSION">Submission Deleted</SelectItem>
                  <SelectItem value="CREATE_USER">User Created</SelectItem>
                  <SelectItem value="DELETE_USER">User Deleted</SelectItem>
                  <SelectItem value="CHANGE_PASSWORD">Password Changed</SelectItem>
                  <SelectItem value="CHANGE_ROLE">Role Changed</SelectItem>
                  <SelectItem value="CHANGE_BRAND">Brand Changed</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, form..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-muted-foreground">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No audit logs found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Date & Time</TableHead>
                      <TableHead>By</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">{log.admin_email ?? "—"}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${actionColors[log.action] ?? "bg-gray-100 text-gray-800"}`}>
                            {actionLabels[log.action] ?? log.action}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-sm truncate">
                          {formatDetails(log.action, log.details, log.target_email)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
