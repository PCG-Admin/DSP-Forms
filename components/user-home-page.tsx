"use client"

import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Truck, 
  Tractor, 
  TreePine, 
  Container, 
  Wrench,
  Bus,
  Combine,
  Logs,
  Fuel,
  FileText,
  Droplets,
  ClipboardCheck,  // for Weekly Machinery and Daily Machine
  ArrowRight, 
  ClipboardList   // for Daily Attachment
} from "lucide-react"

const forms = [
  // Existing forms (16)
  {
    id: "light-delivery",
    title: "Light Delivery Vehicle",
    subtitle: "Daily Checklist",
    description: "Pre-trip inspection for light delivery vehicles including checks for tyres, brakes, lights, and safety equipment.",
    icon: Truck,
    href: "/light-delivery",
    docRef: "HSEMS/8.1.19/REG/012",
    itemCount: 26,
  },
  {
    id: "excavator-loader",
    title: "Excavator Loader",
    subtitle: "Pre-Shift Inspection",
    description: "Comprehensive pre-shift inspection for excavator loaders covering hydraulics, tracks, controls, and safety systems.",
    icon: Tractor,
    href: "/excavator-loader",
    docRef: "HSEMS/8.1.19/REG/002",
    itemCount: 33,
  },
  {
    id: "excavator-harvester",
    title: "Excavator Harvester",
    subtitle: "Pre-Shift Inspection",
    description: "Pre-shift inspection for excavator harvesters including harvester head, feed rollers, delimbing knives, and safety checks.",
    icon: TreePine,
    href: "/excavator-harvester",
    docRef: "HSEMS/8.1.19/REG/001",
    itemCount: 36,
  },
  {
    id: "lowbed-trailer",
    title: "Lowbed & Roll Back Trailer",
    subtitle: "Pre-Shift Inspection",
    description: "Complete inspection for lowbed and roll back trailers including deck condition, hydraulics, winch, tyres, and coupling systems.",
    icon: Container,
    href: "/lowbed-trailer",
    docRef: "HSEMS/8.1.19/REG/020",
    itemCount: 29,
  },
  {
    id: "mechanic-ldv",
    title: "Mechanic LDV",
    subtitle: "Daily Checklist",
    description: "Specialized daily inspection for mechanic light delivery vehicles covering tools, equipment, and vehicle systems.",
    icon: Wrench,
    href: "/mechanic-ldv",
    docRef: "HSEMS/8.1.19/REG/017",
    itemCount: 24,
  },
  {
    id: "personal-labour-carrier",
    title: "Personal / Labour Carrier",
    subtitle: "Inspection Checklist",
    description: "Daily inspection for personnel carriers including safety equipment, tyres, brakes, and passenger area.",
    icon: Bus,
    href: "/personal-labour-carrier",
    docRef: "HSEMS/8.1.19/REG/011",
    itemCount: 20,
  },
  {
    id: "ponsse-bison",
    title: "Ponsse Bison",
    subtitle: "Pre-Shift Inspection",
    description: "Complete pre-shift inspection for the Ponsse Bison harvester including boom structure, hydraulics, grab, and safety systems.",
    icon: Combine,
    href: "/ponsse-bison",
    docRef: "HSEMS/8.1.19/REG/022",
    itemCount: 34,
  },
  {
    id: "self-loading-forwarder",
    title: "Self Loading Forwarder",
    subtitle: "Pre-Shift Inspection",
    description: "Pre-shift inspection for self‑loading forwarders covering boom, hydraulics, grab, tyres, and safety systems.",
    icon: Tractor,
    href: "/self-loading-forwarder",
    docRef: "HSEMS/8.1.19/REG/003",
    itemCount: 32,
  },
  {
    id: "skidder",
    title: "Skidder (Grapple & Cable)",
    subtitle: "Pre-Shift Inspection",
    description: "Pre-shift inspection for skidders including grapple, cable, winch, hydraulics, and safety systems.",
    icon: Logs,
    href: "/skidder",
    docRef: "HSEMS/8.1.19/REG/006",
    itemCount: 28,
  },
  {
    id: "timber-truck-trailer",
    title: "Timber Truck And Trailer",
    subtitle: "Checklist",
    description: "Complete inspection for timber trucks and trailers covering brakes, lights, tyres, and fire extinguisher.",
    icon: Truck,
    href: "/timber-truck-trailer",
    docRef: "HSEMS/8.1.19/REG/010",
    itemCount: 24,
  },
  {
    id: "trailer",
    title: "Trailer (Excluding Labour)",
    subtitle: "Inspection Checklist",
    description: "Trailer inspection covering body, lights, brakes, tyres, and safety equipment.",
    icon: Container,
    href: "/trailer",
    docRef: "HSEMS/4.4.6.19/REG/013",
    itemCount: 15,
  },
  {
    id: "service-diesel-truck",
    title: "Service/Diesel Truck",
    subtitle: "Pre-Shift Inspection",
    description: "Pre-shift inspection for service/diesel trucks including engine, brakes, lights, and fluid levels.",
    icon: Fuel,
    href: "/service-diesel-truck",
    docRef: "HSEMS/8.1.19/REG/???",
    itemCount: 23,
  },
  {
    id: "vehicle-job-card",
    title: "Motorised Equipment/Vehicle Job Card",
    subtitle: "Work Order",
    description: "Job card for recording repairs, maintenance, and tests on equipment and vehicles.",
    icon: FileText,
    href: "/vehicle-job-card",
    docRef: "HSEMS/8.1.19/REG/???",
    itemCount: 0,
  },
  {
    id: "water-cart-trailer",
    title: "Water Cart Trailer & Pressure Washer",
    subtitle: "Inspection Checklist",
    description: "Daily inspection for water cart trailers and pressure washers covering lights, tyres, tank, hose, and engine.",
    icon: Droplets,
    href: "/water-cart-trailer",
    docRef: "HSEMS/8.1.19/REG/015",
    itemCount: 27,
  },
  {
    id: "weekly-machinery-condition",
    title: "Weekly Machinery Condition Assessment",
    subtitle: "Weekly Assessment",
    description: "Comprehensive weekly assessment of machinery condition covering engine, chassis, transmission, hydraulics, and attachments.",
    icon: ClipboardCheck,
    href: "/weekly-machinery-condition",
    docRef: "HSEMS/8.1.19/DOC/011",
    itemCount: 84,
  },
  {
    id: "bell-timber-truck",
    title: "Bell Timber Truck",
    subtitle: "Pre-Shift Checklist",
    description: "Pre-shift inspection for Bell timber trucks covering cab, hydraulics, brakes, boom, and safety equipment.",
    icon: Combine,
    href: "/bell-timber-truck",
    docRef: "HSEMS/8.1.19/REG/019",
    itemCount: 43,
  },
  // NEW FORMS (4)
  {
    id: "daily-attachment-checklist",
    title: "Daily Attachment Checklist",
    subtitle: "Daily Checklist",
    description: "Daily inspection for harvester attachments including head, grab, and winch.",
    icon: ClipboardList,
    href: "/daily-attachment-checklist",
    docRef: "HSEMS/8.1.19/REG/012",
    itemCount: 39,
  },
  {
    id: "daily-machine-checklist",
    title: "Daily Machine Checklist",
    subtitle: "Daily Checklist",
    description: "Daily inspection for machines covering engine, chassis, hydraulics, and attachments.",
    icon: ClipboardCheck,
    href: "/daily-machine-checklist",
    docRef: "HSEMS/8.1.19/DOC/011",
    itemCount: 84,
  },
  {
    id: "dezzi-timber-truck",
    title: "Dezzi Timber Truck",
    subtitle: "Pre-Shift Checklist",
    description: "Pre-shift inspection for Dezzi timber trucks covering cab, hydraulics, brakes, boom, and safety equipment.",
    icon: Truck,
    href: "/dezzi-timber-truck",
    docRef: "HSEMS/8.1.19/REG/004",
    itemCount: 41,
  },
  {
    id: "diesel-cart-trailer",
    title: "Diesel Cart Trailer",
    subtitle: "Inspection Checklist",
    description: "Inspection for diesel cart trailers covering tank, lights, brakes, tyres, and fire extinguisher.",
    icon: Container,
    href: "/diesel-cart-trailer",
    docRef: "HSEMS/8.1.9/REG/014",
    itemCount: 15,
  },
]

export function UserHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />

      <main className="mx-auto max-w-7xl p-4 lg:p-8">
        {/* Hero Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <Image src="/images/ringomode-logo.png" alt="Ringomode DSP logo" width={180} height={60} className="object-contain" />
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
              <div className="text-2xl font-bold text-foreground">{forms.length}</div>
              <div className="text-xs text-muted-foreground">Available Forms</div>
            </CardContent>
          </Card>
        </div>

        {/* Form Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {forms.map((form) => {
            const Icon = form.icon
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
                    <span>{form.itemCount > 0 ? `${form.itemCount} inspection items` : "No inspection items"}</span>
                    <span className="font-mono">{form.docRef}</span>
                  </div>

                  {/* Start Inspection Button */}
                  <Button asChild className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                    <Link href={form.href}>
                      Start Inspection
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-20">
          {/* Existing badges (16) */}
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <p className="text-xs font-medium text-blue-700">Light Delivery</p>
            <p className="text-lg font-bold text-blue-800">26</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-3 text-center">
            <p className="text-xs font-medium text-orange-700">Excavator Loader</p>
            <p className="text-lg font-bold text-orange-800">33</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center">
            <p className="text-xs font-medium text-green-700">Excavator Harvester</p>
            <p className="text-lg font-bold text-green-800">36</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3 text-center">
            <p className="text-xs font-medium text-purple-700">Lowbed Trailer</p>
            <p className="text-lg font-bold text-purple-800">29</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3 text-center">
            <p className="text-xs font-medium text-red-700">Mechanic LDV</p>
            <p className="text-lg font-bold text-red-800">24</p>
          </div>
          <div className="rounded-lg bg-teal-50 p-3 text-center">
            <p className="text-xs font-medium text-teal-700">Labour Carrier</p>
            <p className="text-lg font-bold text-teal-800">20</p>
          </div>
          <div className="rounded-lg bg-indigo-50 p-3 text-center">
            <p className="text-xs font-medium text-indigo-700">Ponsse Bison</p>
            <p className="text-lg font-bold text-indigo-800">34</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 text-center">
            <p className="text-xs font-medium text-emerald-700">Self Loading Forwarder</p>
            <p className="text-lg font-bold text-emerald-800">32</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 text-center">
            <p className="text-xs font-medium text-amber-700">Skidder</p>
            <p className="text-lg font-bold text-amber-800">28</p>
          </div>
          <div className="rounded-lg bg-rose-50 p-3 text-center">
            <p className="text-xs font-medium text-rose-700">Timber Truck</p>
            <p className="text-lg font-bold text-rose-800">24</p>
          </div>
          <div className="rounded-lg bg-cyan-50 p-3 text-center">
            <p className="text-xs font-medium text-cyan-700">Trailer</p>
            <p className="text-lg font-bold text-cyan-800">15</p>
          </div>
          <div className="rounded-lg bg-lime-50 p-3 text-center">
            <p className="text-xs font-medium text-lime-700">Service Diesel</p>
            <p className="text-lg font-bold text-lime-800">23</p>
          </div>
          <div className="rounded-lg bg-fuchsia-50 p-3 text-center">
            <p className="text-xs font-medium text-fuchsia-700">Job Card</p>
            <p className="text-lg font-bold text-fuchsia-800">—</p>
          </div>
          <div className="rounded-lg bg-sky-50 p-3 text-center">
            <p className="text-xs font-medium text-sky-700">Water Cart</p>
            <p className="text-lg font-bold text-sky-800">27</p>
          </div>
          <div className="rounded-lg bg-pink-50 p-3 text-center">
            <p className="text-xs font-medium text-pink-700">Weekly Machinery</p>
            <p className="text-lg font-bold text-pink-800">84</p>
          </div>
          <div className="rounded-lg bg-violet-50 p-3 text-center">
            <p className="text-xs font-medium text-violet-700">Bell Timber</p>
            <p className="text-lg font-bold text-violet-800">43</p>
          </div>
          {/* New badges (4) */}
          <div className="rounded-lg bg-orange-100 p-3 text-center">
            <p className="text-xs font-medium text-orange-800">Daily Attachment</p>
            <p className="text-lg font-bold text-orange-900">39</p>
          </div>
          <div className="rounded-lg bg-yellow-100 p-3 text-center">
            <p className="text-xs font-medium text-yellow-800">Daily Machine</p>
            <p className="text-lg font-bold text-yellow-900">84</p>
          </div>
          <div className="rounded-lg bg-stone-100 p-3 text-center">
            <p className="text-xs font-medium text-stone-800">Dezzi Timber</p>
            <p className="text-lg font-bold text-stone-900">41</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-3 text-center">
            <p className="text-xs font-medium text-slate-800">Diesel Cart</p>
            <p className="text-lg font-bold text-slate-900">15</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>Ringomode HSE Management System</p>
          <p className="mt-1">All inspections are logged and reviewed by the HSE Manager.</p>
          <p className="mt-2 text-[10px]">Document Control: HSEMS/8.1.19/REG | Rev. 2 | 27.03.2024</p>
        </footer>
      </main>
    </div>
  )
}