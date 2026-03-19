"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ClipboardList, LayoutDashboard, LogOut, ShieldAlert, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SiteHeaderProps {
  role: "user" | "admin"
}

export function SiteHeader({ role }: SiteHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href={role === "admin" ? "/admin" : "/"} className="flex items-center gap-3">
            <Image
              src="/images/dsp-logo.png"
              alt=" DSP logo"
              width={40}
              height={20}
              className="object-contain"
            />
          </Link>
        </div>

        <nav className="flex items-center gap-1">
          {role === "user" ? (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "gap-2 text-muted-foreground",
                pathname === "/" && "bg-primary/10 text-primary"
              )}
            >
              <Link href="/">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Checklists</span>
              </Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "gap-2 text-muted-foreground",
                  pathname === "/admin" && "bg-primary/10 text-primary"
                )}
              >
                <Link href="/admin">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "gap-2 text-muted-foreground",
                  pathname === "/admin/users" && "bg-primary/10 text-primary"
                )}
              >
                <Link href="/admin/users">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Users</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "gap-2 text-muted-foreground",
                  pathname === "/admin/audit-logs" && "bg-primary/10 text-primary"
                )}
              >
                <Link href="/admin/audit-logs">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="hidden sm:inline">Audit Log</span>
                </Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
            <Link href={role === "admin" ? "/brand-select" : "/admin"}>
              {role === "admin" ? (
                <>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">User View</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </>
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}