const CACHE_NAME = 'devbattle-cache-v1';
const DYNAMIC_CACHE_NAME = 'devbattle-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // In a real production app, we would inject the Webpack/Turbopack built assets here
];

// Install Event - Precache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline page');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Network First for API, Stale-While-Revalidate for Static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests (POST, PUT, DELETE should be handled by Background Sync if offline)
  if (request.method !== 'GET') return;

  // Next.js specific dynamic routes and hot reloading ignore
  if (url.pathname.startsWith('/_next/webpack-hmr') || url.pathname.includes('hot-update')) return;

  // API Requests - Network First, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(request, clonedResponse));
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          
          // Return a structured JSON response indicating offline status
          return new Response(JSON.stringify({ error: 'offline', message: 'You are currently offline. Please check your connection.' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Static Assets and Pages - Stale While Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          if (networkResponse.ok && request.url.startsWith('http')) {
            cache.put(request, networkResponse.clone());
          }
        });
        return networkResponse;
      }).catch(() => {
        // If it's a navigation request and fails, serve the offline page
        if (request.mode === 'navigate') {
          return caches.match('/offline');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Push Notification Event
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'New Notification', body: event.data.text() };
  }

  const title = data.title || 'DevBattle Notification';
  const options = {
    body: data.body || 'You have a new update.',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-192x192.png',
    data: data.data || { url: '/' },
    vibrate: [100, 50, 100],
    actions: data.actions || []
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background Sync Event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-queue') {
    event.waitUntil(processOfflineQueue());
  }
});

async function processOfflineQueue() {
  console.log('[Service Worker] Processing offline queue...');
  
  // To keep the SW simple, we delegate the actual IndexedDB processing 
  // back to the main thread via postMessage. The main thread will hit the API.
  const clientsList = await clients.matchAll();
  for (const client of clientsList) {
    client.postMessage({ type: 'PROCESS_OFFLINE_QUEUE' });
  }
}
