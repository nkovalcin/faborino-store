const CACHE_NAME = 'faborino-v1'
const STATIC_ASSETS = [
  '/',
  '/sk',
  '/sk/kategorie',
  '/sk/produkty',
  '/manifest.json',
  '/favicon.ico',
]

const API_CACHE_NAME = 'faborino-api-v1'
const IMAGE_CACHE_NAME = 'faborino-images-v1'

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return fetch(request).then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            cache.put(request, response.clone())
          }
          return response
        }).catch(() => {
          // Return cached response if network fails
          return cache.match(request)
        })
      })
    )
    return
  }

  // Handle image requests
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response
          }
          
          return fetch(request).then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone())
            }
            return response
          })
        })
      })
    )
    return
  }

  // Handle all other requests
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      })
    }).catch(() => {
      // Return offline page for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('/offline.html')
      }
    })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart())
  }
})

async function syncCart() {
  try {
    // Sync cart data when online
    const cartData = await getStoredCartData()
    if (cartData) {
      await syncCartToServer(cartData)
    }
  } catch (error) {
    console.error('Cart sync failed:', error)
  }
}

async function getStoredCartData() {
  // Get cart data from IndexedDB or localStorage
  return JSON.parse(localStorage.getItem('cart-store') || '{}')
}

async function syncCartToServer(cartData) {
  // Sync cart data to server
  await fetch('/api/cart/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartData),
  })
}