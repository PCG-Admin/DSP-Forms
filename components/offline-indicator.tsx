"use client"

import { CloudOff, CloudUpload, RefreshCw } from "lucide-react"
import { useOffline } from "@/components/offline-provider"
import { Button } from "@/components/ui/button"

export function OfflineIndicator() {
  const { isOnline, pendingCount, syncNow } = useOffline()

  if (isOnline && pendingCount === 0) return null

  return (
    <div className="flex items-center gap-1.5">
      {!isOnline ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-orange-800 whitespace-nowrap">
          <CloudOff className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>Offline</span>
          {pendingCount > 0 && <span>· {pendingCount}</span>}
        </span>
      ) : (
        <>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-amber-800 whitespace-nowrap">
            <CloudUpload className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{pendingCount} pending</span>
          </span>
          <Button size="sm" variant="ghost" className="h-6 gap-1 px-1.5 text-[10px] sm:h-7 sm:px-2 sm:text-xs" onClick={() => void syncNow()}>
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Sync</span>
          </Button>
        </>
      )}
    </div>
  )
}
