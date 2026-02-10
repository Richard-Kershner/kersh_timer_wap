/*
===============================================================================
FILE: src/main.tsx
===============================================================================
FINAL PURPOSE:
Application entry point for the Kersh Timer web application.

RESPONSIBILITIES:
- Bootstrap the React application
- Attach the root React tree to the DOM
- Register web-only infrastructure (PWA service worker)

CONNECTED FILES:
- Renders (placeholder): React component tree
- Calls: src/pwa/registerServiceWorker.ts
- Future integration targets:
  - src/components/TimerEditor.tsx
  - src/components/TimerRunner.tsx

SHARED DATA MODELS:
- None

NAMING CONVENTIONS:
- Entry-point file
- No exported symbols
- Side-effect–driven initialization only

DEVELOPMENT STEPS:
- Step 1: App bootstrap
- Step 2: Routing (planned)
- Step 3: Global providers (planned)
- Step 5: PWA registration (web-only)

CHANGE LOG:
- Step 1 completed on 2026-02-03
- Step 5 completed on 2026-02-10 — Added service worker registration
===============================================================================
*/

import React from 'react';
import ReactDOM from 'react-dom/client';

// Step 5: PWA service worker registration
import { registerServiceWorker } from './pwa/registerServiceWorker';

// Step 1: App bootstrap
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>Kersh Timer</div>
  </React.StrictMode>,
);

// Step 5: Register service worker after React bootstrap
registerServiceWorker();
