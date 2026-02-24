const CACHE_VERSION = 'v4.0.0';
const CACHE_NAME = `fresh-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `fresh-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `fresh-images-${CACHE_VERSION}`;
const API_CACHE = `fresh-api-${CACHE_VERSION}`;
const FONT_CACHE = `fresh-fonts-${CACHE_VERSION}`;
const PREFETCH_CACHE = `fresh-prefetch-${CACHE_VERSION}`;

// Aggressive precaching - all critical resources
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest-customer.json',
  '/manifest-delivery.json',
  '/manifest-restaurant.json',
  '/manifest-admin.json',
  '/assets/generated/fresh-logo.dim_200x200.png',
  '/assets/generated/customer-app-icon-transparent.dim_192x192.png',
  '/assets/generated/customer-app-icon-transparent.dim_512x512.png',
  '/assets/generated/delivery-app-icon-transparent.dim_192x192.png',
  '/assets/generated/delivery-app-icon-transparent.dim_512x512.png',
  '/assets/generated/restaurant-app-icon-transparent.dim_192x192.png',
  '/assets/generated/restaurant-app-icon-transparent.dim_512x512.png',
  '/assets/generated/admin-app-icon-transparent.dim_192x192.png',
  '/assets/generated/admin-app-icon-transparent.dim_512x512.png',
  '/assets/generated/admin-dashboard.dim_800x600.jpg',
  '/assets/generated/delivery-hero.dim_800x600.jpg',
  '/assets/generated/restaurant-hero.dim_800x600.jpg',
  '/assets/generated/sample-meal.dim_400x300.jpg'
];

// Cache size limits
const MAX_IMAGE_CACHE_SIZE = 150;
const MAX_API_CACHE_SIZE = 250;
const MAX_RUNTIME_CACHE_SIZE = 200;
const MAX_PREFETCH_CACHE_SIZE = 100;
const CACHE_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000; // 30 days for aggressive caching

// Install event - aggressive precaching
self.addEventListener('install', (event) => {
  console.log('[SW v4] Installing service worker with enhanced lazy loading and prefetch');
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[SW v4] Precaching critical assets');
        
        // Precache in batches to avoid timeout
        const batchSize = 5;
        for (let i = 0; i < PRECACHE_URLS.length; i += batchSize) {
          const batch = PRECACHE_URLS.slice(i, i + batchSize);
          await Promise.allSettled(
            batch.map(url => 
              cache.add(url).catch(err => {
                console.warn(`[SW v4] Failed to cache ${url}:`, err);
                return null;
              })
            )
          );
        }
        
        console.log('[SW v4] Precaching complete');
        await self.skipWaiting();
      } catch (error) {
        console.error('[SW v4] Installation failed:', error);
      }
    })()
  );
});

// Activate event - aggressive cache cleanup
self.addEventListener('activate', (event) => {
  console.log('[SW v4] Activating service worker');
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('fresh-') && 
              !cacheName.includes(CACHE_VERSION)) {
            console.log('[SW v4] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      console.log('[SW v4] Activation complete');
      await self.clients.claim();
    })()
  );
});

// Helper: Add timestamp to response
function addCacheTimestamp(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cache-time', Date.now().toString());
  headers.set('sw-cache-version', CACHE_VERSION);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Helper: Check cache expiration
async function isCacheExpired(cache, request) {
  const response = await cache.match(request);
  if (!response) return true;
  
  const cachedTime = response.headers.get('sw-cache-time');
  if (!cachedTime) return false;
  
  const age = Date.now() - parseInt(cachedTime, 10);
  return age > CACHE_EXPIRATION_TIME;
}

// Helper: Limit cache size with LRU eviction
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    const deleteCount = keys.length - maxSize;
    console.log(`[SW v4] Evicting ${deleteCount} entries from ${cacheName}`);
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// Helper: Cache-first with network update in background
async function cacheFirstWithBackgroundUpdate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Return cached immediately if available
  if (cachedResponse && !(await isCacheExpired(cache, request))) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.status === 200) {
        cache.put(request, addCacheTimestamp(response.clone()));
      }
    }).catch(() => {});
    
    return cachedResponse;
  }
  
  // Fetch from network
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, addCacheTimestamp(response.clone()));
      await limitCacheSize(cacheName, MAX_RUNTIME_CACHE_SIZE);
    }
    return response;
  } catch (error) {
    // Return stale cache if network fails
    if (cachedResponse) {
      console.log('[SW v4] Serving stale cache (offline):', request.url);
      return cachedResponse;
    }
    throw error;
  }
}

// Helper: Prefetch resources in background
async function prefetchResource(url) {
  try {
    const cache = await caches.open(PREFETCH_CACHE);
    const response = await fetch(url);
    if (response.status === 200) {
      await cache.put(url, addCacheTimestamp(response.clone()));
      await limitCacheSize(PREFETCH_CACHE, MAX_PREFETCH_CACHE_SIZE);
      console.log('[SW v4] Prefetched:', url);
    }
  } catch (error) {
    console.warn('[SW v4] Prefetch failed:', url, error);
  }
}

// Fetch event - aggressive caching strategies with lazy loading support
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin except fonts
  if (url.origin !== location.origin && 
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('fonts.gstatic.com')) {
    return;
  }

  // 1. Fonts - Cache-first with long expiration
  if (url.pathname.match(/\.(woff|woff2|ttf|eot|otf)$/i) || 
      url.origin.includes('fonts.g')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(FONT_CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
        
        const response = await fetch(request);
        if (response.status === 200) {
          cache.put(request, addCacheTimestamp(response.clone()));
        }
        return response;
      })()
    );
    return;
  }

  // 2. Images - Aggressive cache-first with background prefetch
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|avif)$/i)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(IMAGE_CACHE);
        const cached = await cache.match(request);
        
        // Return cached immediately, even if expired
        if (cached) {
          // Update in background if expired
          if (await isCacheExpired(cache, request)) {
            fetch(request).then(response => {
              if (response.status === 200) {
                cache.put(request, addCacheTimestamp(response.clone()));
                limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE);
              }
            }).catch(() => {});
          }
          return cached;
        }
        
        // Fetch from network
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            cache.put(request, addCacheTimestamp(response.clone()));
            await limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE);
          }
          return response;
        } catch (error) {
          return new Response('', { status: 404 });
        }
      })()
    );
    return;
  }

  // 3. API calls - Network-first with aggressive cache fallback
  if (url.pathname.includes('/api/') || 
      url.pathname.includes('canister') ||
      url.search.includes('canisterId')) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request, { 
            cache: 'no-cache' 
          });
          
          if (response.status === 200) {
            const cache = await caches.open(API_CACHE);
            cache.put(request, addCacheTimestamp(response.clone()));
            await limitCacheSize(API_CACHE, MAX_API_CACHE_SIZE);
          }
          return response;
        } catch (error) {
          const cache = await caches.open(API_CACHE);
          const cached = await cache.match(request);
          if (cached) {
            console.log('[SW v4] Serving API from cache (offline)');
            return cached;
          }
          return new Response(
            JSON.stringify({ error: 'Offline', cached: false }), 
            { 
              status: 503, 
              headers: { 'Content-Type': 'application/json' } 
            }
          );
        }
      })()
    );
    return;
  }

  // 4. JavaScript & CSS - Aggressive cache-first with deferred loading support
  if (url.pathname.match(/\.(js|css|mjs)$/i)) {
    event.respondWith(cacheFirstWithBackgroundUpdate(request, RUNTIME_CACHE));
    return;
  }

  // 5. HTML - Network-first with cache fallback
  if (request.mode === 'navigate' || 
      request.destination === 'document' ||
      url.pathname.endsWith('.html')) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, addCacheTimestamp(response.clone()));
          }
          return response;
        } catch (error) {
          const cache = await caches.open(RUNTIME_CACHE);
          const cached = await cache.match(request);
          if (cached) {
            console.log('[SW v4] Serving HTML from cache (offline)');
            return cached;
          }
          // Fallback to index.html
          const indexCache = await caches.open(CACHE_NAME);
          const index = await indexCache.match('/index.html');
          return index || new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // 6. Everything else - Cache-first
  event.respondWith(cacheFirstWithBackgroundUpdate(request, RUNTIME_CACHE));
});

// Message handling - enhanced with prefetch support
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(names => 
        Promise.all(
          names.filter(n => n.startsWith('fresh-'))
            .map(n => caches.delete(n))
        )
      )
    );
  }
  
  if (event.data?.type === 'PREFETCH_RESOURCES') {
    const urls = event.data.urls || [];
    event.waitUntil(
      Promise.all(urls.map(url => prefetchResource(url)))
    );
  }
  
  if (event.data?.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      (async () => {
        const names = await caches.keys();
        const sizes = await Promise.all(
          names.map(async name => {
            const cache = await caches.open(name);
            const keys = await cache.keys();
            return { name, size: keys.length };
          })
        );
        event.ports[0].postMessage({ type: 'CACHE_SIZE', sizes });
      })()
    );
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  console.log('[SW v4] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      (async () => {
        console.log('[SW v4] Syncing data...');
      })()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification',
    icon: '/assets/generated/fresh-logo.dim_200x200.png',
    badge: '/assets/generated/fresh-logo.dim_200x200.png',
    vibrate: [200, 100, 200],
    tag: 'fresh-notification',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification('Fresh', options)
  );
});

console.log('[SW v4] Service worker loaded - Enhanced lazy loading and prefetch enabled');
