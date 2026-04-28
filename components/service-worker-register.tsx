"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Force a fresh SW to take over immediately if one is waiting
      if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING')
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // A new SW has taken over — reload so users immediately see the new behavior
            newWorker.postMessage('SKIP_WAITING')
          }
        })
      })
      // Reload once a new controller takes over so cache changes apply immediately
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })
    }).catch((err) => {
      console.error('SW registration failed:', err)
    })
  }, [])
  return null
}
