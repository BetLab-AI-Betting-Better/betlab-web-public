const CACHE_NAME = 'betlab-v2'
const OFFLINE_URL = '/offline'

const STATIC_ASSETS = [
  '/',
  '/offline',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate')
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[ServiceWorker] Removing old cache:', key)
            return caches.delete(key)
          })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  const { request } = event
  const url = new URL(request.url)

  // Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseToCache))
          return response
        })
        .catch(() => {
          // Return cached response if available
          return caches.match(request)
        })
    )
    return
  }

  // Cache-first for static assets (images, fonts, etc.)
  if (
    url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf|eot)$/)
  ) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response

          return fetch(request).then(response => {
            // Cache the new resource
            const responseToCache = response.clone()
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseToCache))
            return response
          })
        })
    )
    return
  }

  // Stale-while-revalidate for HTML pages
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        const fetchPromise = fetch(request)
          .then(networkResponse => {
            // Update cache with new response
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseToCache))
            return networkResponse
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match(OFFLINE_URL)
            }
          })

        // Return cached response immediately, but update cache in background
        return cachedResponse || fetchPromise
      })
  )
})

// Background sync for failed requests (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag)
  // TODO: Implement background sync logic
})

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push notification received')
  // TODO: Implement push notification logic
})
