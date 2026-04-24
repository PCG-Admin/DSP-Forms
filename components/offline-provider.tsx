"use client"

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react"
import { toast } from "sonner"
import { enqueue, getAll, remove, update, count } from "@/lib/offline-queue"

interface OfflineContextValue {
  isOnline: boolean
  pendingCount: number
  syncNow: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextValue>({
  isOnline: true,
  pendingCount: 0,
  syncNow: async () => {},
})

export function useOffline() {
  return useContext(OfflineContext)
}

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [pendingCount, setPendingCount] = useState(0)
  const syncingRef = useRef(false)
  const originalFetchRef = useRef<typeof fetch | null>(null)

  const refreshCount = useCallback(async () => {
    try { setPendingCount(await count()) } catch {}
  }, [])

  const syncNow = useCallback(async () => {
    if (syncingRef.current) return
    if (typeof navigator !== 'undefined' && !navigator.onLine) return
    syncingRef.current = true
    try {
      const items = await getAll()
      if (items.length === 0) return
      const fetchFn = originalFetchRef.current ?? fetch
      let synced = 0
      for (const item of items) {
        try {
          const res = await fetchFn(item.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.body),
          })
          if (res.ok) {
            await remove(item.id)
            synced++
          } else {
            const text = await res.text().catch(() => '')
            await update(item.id, { attempts: item.attempts + 1, lastError: `HTTP ${res.status}: ${text.slice(0, 120)}` })
          }
        } catch (err: any) {
          await update(item.id, { attempts: item.attempts + 1, lastError: String(err?.message ?? err) })
        }
      }
      if (synced > 0) toast.success(`Synced ${synced} offline submission${synced > 1 ? 's' : ''}`)
      await refreshCount()
    } finally {
      syncingRef.current = false
    }
  }, [refreshCount])

  // Patch window.fetch once
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (originalFetchRef.current) return

    const original = window.fetch.bind(window)
    originalFetchRef.current = original

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()

      const isSubmission = method === 'POST' && url.includes('/api/submissions') && !url.includes('/api/submissions/')

      if (isSubmission && !navigator.onLine) {
        try {
          const body = init?.body ? JSON.parse(init.body as string) : {}
          await enqueue({ url: '/api/submissions', body })
          await refreshCount()
          toast.success('Saved offline — will sync when online')
          return new Response(JSON.stringify({ success: true, offline: true }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err) {
          return new Response(JSON.stringify({ error: 'Failed to save offline' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      return original(input, init)
    }

    return () => {
      if (originalFetchRef.current) window.fetch = originalFetchRef.current
    }
  }, [refreshCount])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.info('Back online — syncing...')
      void syncNow()
    }
    const handleOffline = () => {
      setIsOnline(false)
      toast.warning('You are offline — submissions will be saved locally')
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [syncNow])

  useEffect(() => {
    void refreshCount()
    if (navigator.onLine) void syncNow()
    const id = setInterval(() => { if (navigator.onLine) void syncNow() }, 60000)
    return () => clearInterval(id)
  }, [refreshCount, syncNow])

  return (
    <OfflineContext.Provider value={{ isOnline, pendingCount, syncNow }}>
      {children}
    </OfflineContext.Provider>
  )
}
