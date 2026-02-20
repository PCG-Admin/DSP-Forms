'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export default function BrandSelectPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      console.log('[BrandSelect] Checking user...')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('[BrandSelect] No user, redirecting to login')
        router.push('/login')
        return
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('brand')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('[BrandSelect] Error fetching user:', error)
        toast.error('Failed to load user profile')
        router.push('/login')
        return
      }

      console.log('[BrandSelect] Current user data:', userData)

      if (userData?.brand) {
        console.log('[BrandSelect] User already has brand, redirecting to home')
        router.push('/')
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [router, supabase])

  const handleSelect = async (brand: 'ringomode' | 'cintasign') => {
    setSaving(true)
    console.log(`[BrandSelect] Attempting to set brand to: ${brand}`)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Not authenticated')
      router.push('/login')
      return
    }

    // First, try to update with select to verify
    const { data, error } = await supabase
      .from('users')
      .update({ brand })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('[BrandSelect] Update error:', error)
      toast.error(`Failed to set brand: ${error.message}`)
      setSaving(false)
      return
    }

    if (!data) {
      console.error('[BrandSelect] No data returned – update may have failed silently')
      toast.error('Brand update failed – check permissions')
      setSaving(false)
      return
    }

    console.log('[BrandSelect] Update returned:', data)

    if (data.brand !== brand) {
      console.error('[BrandSelect] Brand mismatch:', data.brand, '!=', brand)
      toast.error('Brand update verification failed')
      setSaving(false)
      return
    }

    // Double-check by fetching again
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('brand')
      .eq('id', user.id)
      .single()

    if (verifyError) {
      console.error('[BrandSelect] Verification fetch error:', verifyError)
      toast.error('Could not verify brand update')
      setSaving(false)
      return
    }

    console.log('[BrandSelect] Verification fetch returned:', verifyData)

    if (verifyData.brand !== brand) {
      console.error('[BrandSelect] Verification mismatch:', verifyData.brand, '!=', brand)
      toast.error('Brand verification failed after update')
      setSaving(false)
      return
    }

    toast.success(`Brand set to ${brand}`)
    console.log('[BrandSelect] All good, redirecting to home')

    // Use a small timeout to ensure the cookie/db propagate
    setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 500)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Please select your brand to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => !saving && handleSelect('ringomode')}
            className={`group cursor-pointer ${saving ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Card className="transition-all hover:shadow-lg hover:border-primary/50">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="relative w-48 h-24 mb-4">
                  <Image
                    src="/images/ringomode-logo.png"
                    alt="Ringomode DSP"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                  Ringomode DSP
                </p>
              </CardContent>
            </Card>
          </div>

          <div
            onClick={() => !saving && handleSelect('cintasign')}
            className={`group cursor-pointer ${saving ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Card className="transition-all hover:shadow-lg hover:border-primary/50">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="relative w-48 h-24 mb-4">
                  <Image
                    src="/images/cintasign-logo.jpg"
                    alt="Cintasign"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                  Cintasign
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  )
}