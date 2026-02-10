/*
===============================================================================
FILE: src/pwa/registerServiceWorker.ts
===============================================================================
FINAL PURPOSE:
Provides an explicit, controlled registration mechanism for the Kersh Timer
service worker in web (PWA) environments.

RESPONSIBILITIES:
- Register service-worker.js at application startup
- Log lifecycle events for debugging and verification
- Avoid embedding caching or application logic

CONNECTED FILES:
- Called by: src/main.tsx
- Registers: public/service-worker.js

SHARED DATA MODELS:
- None

NAMING CONVENTIONS:
- Functions use imperative verb-based naming
- File exports a single public registration function

DEVELOPMENT STEPS:
- Step 1: Registration function scaffold
- Step 2: Browser capability checks and logging
- Step 3: Runtime verification hooks

STEP COMPLETION LOG:
- Step 1: Complete — 2026-02-10 — New file
- Step 2: Complete — 2026-02-10 — New file
- Step 3: Pending — Runtime SW verification
===============================================================================
*/

export function registerServiceWorker(): void {
  // Step 2: Capability check
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service workers not supported in this browser');
    return;
  }

  // Step 2: Register service worker after page load
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        // Step 3: Successful registration logging
        console.info(
          '[PWA] Service worker registered with scope:',
          registration.scope,
        );
      })
      .catch((error) => {
        // Step 3: Failure diagnostics
        console.error('[PWA] Service worker registration failed:', error);
      });
  });
}
