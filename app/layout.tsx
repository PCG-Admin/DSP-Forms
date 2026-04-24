import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { OfflineProvider } from '@/components/offline-provider'
import { ServiceWorkerRegister } from '@/components/service-worker-register'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Ringomode HSE Management System',
  description: 'Health, Safety & Environment management checklists and inspection forms for Ringomode operations.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#226436',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <OfflineProvider>
          {children}
        </OfflineProvider>
        <ServiceWorkerRegister />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
