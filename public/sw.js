// Dofit Wears & Àṣà PWA Service Worker
// Implements Network-First for dynamic pages & CSS/JS chunks, with Cache fallback
const CACHE_NAME = 'dofit-pwa-v4';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/images/logo.png',
  '/images/dofit-wears/black-crop.png',
  '/images/dofit-wears/purple-tank.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Initial cache asset prefetch error:', err);
      });
    })
  );
  // Promptly activate new worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Purging legacy PWA cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Broadcast update message to client when new worker installed
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Navigation requests (HTML pages): Network-First with Cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline, serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  // 2. Static Assets (Images, scripts, fonts, CSS)
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/images') ||
      url.pathname.startsWith('/_next/static') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js'))
  ) {
    // For CSS stylesheets and JS chunks, use Network-First to guarantee fresh styling
    const isStyleOrChunk = url.pathname.endsWith('.css') || url.pathname.includes('/chunks/');

    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          });

        if (isStyleOrChunk) {
          // Network first, fall back to cached version if offline
          return fetchPromise.catch(() => cachedResponse);
        }

        // Stale-while-revalidate for images & other media
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
