const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = '/offline'; // Path to your custom offline page

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll([
                OFFLINE_URL,
                '/', // Cache the homepage
                '/favicon.ico', // Cache favicon
                // Add any other critical assets here (e.g., main CSS, JS bundles)
                // For a Next.js app, this might involve more dynamic caching strategies
                // or specific routes/build output files.
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }

                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    console.log('Fetch failed, returning offline page ', error);
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(OFFLINE_URL);
                    return cachedResponse;
                }
            })()
        );
    } else {
        // For non-navigation requests, use a cache-first strategy with network fallback
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((networkResponse) => {
                    // Cache new requests as they come in
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    // If both cache and network fail, you might want to return a fallback for specific asset types
                    // For now, let's just let the fetch error propagate for non-navigation requests
                    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                });
            })
        );
    }
});
