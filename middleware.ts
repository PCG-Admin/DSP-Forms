import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = req.cookies.get(name)?.value
          console.log(`[Middleware] Getting cookie ${name}:`, cookie ? 'exists' : 'missing')
          return cookie
        },
        set(name: string, value: string, options: any) {
          console.log(`[Middleware] Setting cookie ${name}`)
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          console.log(`[Middleware] Removing cookie ${name}`)
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  console.log(`[Middleware] Path: ${req.nextUrl.pathname}`)
  console.log(`[Middleware] User from getUser:`, user?.email || 'none')
  if (error) console.error('[Middleware] getUser error:', error)

  const path = req.nextUrl.pathname

  // Public routes (no auth required)
  if (path === '/login') {
    // If user already logged in, redirect based on role/brand
    if (user) {
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('role, brand')
        .eq('id', user.id)
        .single()

      if (dbError) {
        console.error('[Middleware] DB error on /login:', dbError)
        return res // let them stay on login if DB fails
      }

      if (userData) {
        if (userData.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', req.url))
        }
        if (!userData.brand) {
          return NextResponse.redirect(new URL('/brand-select', req.url))
        }
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
    return res
  }

  // All other routes require authentication
  if (!user) {
    console.log(`[Middleware] No user, redirecting to /login from ${path}`)
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Fetch user data for protected routes
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('role, brand')
    .eq('id', user.id)
    .single()

  if (dbError) {
    console.error('[Middleware] DB fetch error:', dbError)
    // If DB fails, maybe still allow them to try brand-select to recover
    if (path === '/brand-select') return res
    return NextResponse.redirect(new URL('/brand-select', req.url))
  }

  // Admin route protection
  if (path.startsWith('/admin')) {
    if (userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return res
  }

  // Regular users: ensure they have a brand before accessing home
  if (userData.role !== 'admin') {
    if (!userData.brand && path !== '/brand-select') {
      return NextResponse.redirect(new URL('/brand-select', req.url))
    }
    if (userData.brand && path === '/brand-select') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}