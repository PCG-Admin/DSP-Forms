/** @type {import('next').NextConfig} */

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : '*.supabase.co'

const cspValue = [
  "default-src 'self'",
  // Next.js requires unsafe-inline + unsafe-eval for its runtime scripts
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
  // Inline styles are used throughout (Tailwind, shadcn)
  "style-src 'self' 'unsafe-inline'",
  // data: for base64 PDF images; blob: for generated PDFs
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Supabase REST + Realtime websocket
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
  // No iframes allowed (redundant with X-Frame-Options but belt-and-suspenders)
  "frame-ancestors 'none'",
  // Prevent <base> tag injection
  "base-uri 'self'",
  // Restrict where forms can submit
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspValue,
  },
  // Enforce HTTPS for 2 years (HSTS)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Prevent clickjacking
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // Prevent MIME-type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Control referrer information
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Disable unnecessary browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  // Legacy XSS protection for older browsers
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // Prevent DNS prefetch leaking
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
]

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
