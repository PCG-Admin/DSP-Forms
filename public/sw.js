const CACHE_VERSION = 'dsp-v3'
const PAGE_CACHE = `${CACHE_VERSION}-pages`
const STATIC_CACHE = `${CACHE_VERSION}-static`
const APP_SHELL = ['/', '/login', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})

// Put a copy of the response in the named cache, silently ignore failures
function putInCache(cacheName, request, response) {
  if (!response || response.status !== 200 || response.type === 'opaque') return
  caches.open(cacheName).then((cache) => cache.put(request, response)).catch(() => {})
}

// Stale-while-revalidate: return cached immediately (if any), then refresh in background
async function staleWhileRevalidate(cacheName, request) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const networkPromise = fetch(request)
    .then((res) => {
      if (res && res.status === 200 && res.type !== 'opaque') cache.put(request, res.clone()).catch(() => {})
      return res
    })
    .catch(() => null)
  return cached || (await networkPromise) || new Response('Offline', { status: 503 })
}

// Network-first, fall back to cache (navigations — want fresh server-rendered HTML when possible)
async function networkFirst(cacheName, request) {
  try {
    const res = await fetch(request)
    if (res && res.status === 200) {
      const copy = res.clone()
      caches.open(cacheName).then((cache) => cache.put(request, copy)).catch(() => {})
    }
    return res
  } catch {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)
    if (cached) return cached
    // Final fallback: try the root page
    const root = await cache.match('/')
    if (root) return root
    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Skip cross-origin, non-http(s), and chrome-extension requests
  if (url.origin !== self.location.origin) return

  // Never handle API requests — let them hit the network (or fail, which our OfflineProvider catches)
  if (url.pathname.startsWith('/api/')) return

  // Navigation requests (HTML pages) — network-first for fresh content, cache fallback for offline
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(PAGE_CACHE, request))
    return
  }

  // RSC / Next.js data requests — stale-while-revalidate so client-side nav works offline
  if (
    url.pathname.startsWith('/_next/data/') ||
    url.searchParams.has('_rsc') ||
    request.headers.get('RSC') === '1'
  ) {
    event.respondWith(staleWhileRevalidate(PAGE_CACHE, request))
    return
  }

  // Static assets — cache-first (immutable hashed files)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    /\.(?:js|css|woff2?|ttf|eot|png|jpe?g|svg|gif|webp|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((res) => {
          if (res && res.status === 200) putInCache(STATIC_CACHE, request, res.clone())
          return res
        }).catch(() => cached || new Response('', { status: 504 }))
      })
    )
    return
  }

  // Anything else — stale-while-revalidate
  event.respondWith(staleWhileRevalidate(STATIC_CACHE, request))
})
