"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as Icons from "lucide-react"
import { 
  ArrowRight, 
  ClipboardList,
  Search
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { createClient } from "@/lib/supabase/client"

// Map icon names to actual Lucide components
const iconMap: Record<string, any> = {
  Truck: Icons.Truck,
  Tractor: Icons.Tractor,
  TreePine: Icons.TreePine,
  Container: Icons.Container,
  Wrench: Icons.Wrench,
  Bus: Icons.Bus,
  Combine: Icons.Combine,
  Logs: Icons.Logs,
  Fuel: Icons.Fuel,
  FileText: Icons.FileText,
  Droplets: Icons.Droplets,
  ClipboardCheck: Icons.ClipboardCheck,
  ClipboardList: Icons.ClipboardList,
}

interface Form {
  id: string
  form_type: string
  title: string
  subtitle: string
  description: string
  document_ref: string
  item_count: number
  icon_name: string
  is_active: boolean
}

interface UserHomePageProps {
  brand: 'ringomode' | 'cintasign'
}

export function UserHomePage({ brand }: UserHomePageProps) {
  const [forms, setForms] = useState<Form[]>([])
  const [filteredForms, setFilteredForms] = useState<Form[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadForms() {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('is_active', true)
        .order('title')

      if (error) {
        console.error('Error loading forms:', error)
      } else {
        setForms(data || [])
        setFilteredForms(data || [])
      }
      setLoading(false)
    }
    loadForms()
  }, [supabase])

  // Filter forms when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredForms(forms)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = forms.filter(form => 
        form.title.toLowerCase().includes(query) ||
        form.subtitle.toLowerCase().includes(query) ||
        form.description.toLowerCase().includes(query)
      )
      setFilteredForms(filtered)
    }
  }, [searchQuery, forms])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading forms...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl p-4 lg:p-8">
        {/* Hero Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <BrandLogo brand={brand} width={180} height={60} />
          </div>
          <h1 className="text-balance text-2xl font-bold text-foreground lg:text-3xl">
            HSE Inspection Checklists
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
            Select a checklist below to begin your pre-shift or daily inspection. All submissions are recorded and reviewed by the HSE team.
          </p>
        </div>

        {/* Stats - Single card: Available Forms */}
        <div className="mb-8 flex justify-center">
          <Card className="text-center w-full max-w-xs">
            <CardContent className="pt-6">
              <ClipboardList className="mx-auto mb-2 h-6 w-6 text-primary" />
              <div className="text-2xl font-bold text-foreground">{filteredForms.length}</div>
              <div className="text-xs text-muted-foreground">
                {filteredForms.length === forms.length ? "Available Forms" : "Matching Forms"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Input */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search forms by title, subtitle, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Form Cards */}
        {filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No forms match your search.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredForms.map((form) => {
              const Icon = iconMap[form.icon_name] || Icons.FileText
              return (
                <Card
                  key={form.id}
                  className="group relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-md flex flex-col h-full"
                >
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{form.title}</CardTitle>
                    <CardDescription className="text-xs font-medium uppercase tracking-wide text-primary">
                      {form.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow flex flex-col">
                    <p className="text-sm text-muted-foreground flex-grow">{form.description}</p>
                    
                    {/* Document Reference & Item Count */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{form.item_count > 0 ? `${form.item_count} inspection items` : "No inspection items"}</span>
                      <span className="font-mono">{form.document_ref}</span>
                    </div>

                    {/* Start Inspection Button */}
                    <Button asChild className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                      <Link href={`/${form.form_type}`}>
                        Start Inspection
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>HSE Management System</p>
          <p className="mt-1">All inspections are logged and reviewed by the HSE Manager.</p>
          <p className="mt-2 text-[10px]">Document Control: HSEMS/8.1.19/REG | Rev. 2 | 27.03.2024</p>
        </footer>
      </main>
    </div>
  )
}