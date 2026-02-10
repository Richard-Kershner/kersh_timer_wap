/*
===============================================================================
FILE: public/service-worker.js
===============================================================================
FINAL PURPOSE:
Provides offline-first static asset caching for the Kersh Timer PWA using a
cache-first strategy for the application shell.

RESPONSIBILITIES:
- Cache static assets on install
- Serve cached assets when offline
- Maintain cache versioning discipline

CONNECTED FILES:
- Registered by: src/pwa/registerServiceWorker.ts
- Serves assets requested by the browser

SHARED DATA MODELS:
- None (NO access to application state, timers, audio, or persistence)

NAMING CONVENTIONS:
- Cache names are uppercase constants
- Versioned cache keys use semantic version suffixes

DEVELOPMENT STEPS:
- Step 1: Cache constants and install handler
- Step 2: Fetch handler with offline fallback
- Step 3: Activation and old-cache cleanup

STEP COMPLETION LOG:
- Step 1: Complete — 2026-02-10 — New file
- Step 2: Complete — 2026-02-10 — New file
- Step 3: Complete — 2026-02-10 — New file
===============================================================================
*/

const CACHE_NAME = 'kersh-timer-shell-v1';

// Step 1: Static application shell assets
const STATIC_ASSETS = ['/', '/index.html', '/manifest.webmanifest'];

// Step 1: Install handler
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
});

// Step 2: Fetch handler (cache-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});

// Step 3: Activate handler (cleanup old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
});
