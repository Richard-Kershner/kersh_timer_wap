/*
===============================================================================
FILE: src/main.tsx

Application Entry.
Web build is canonical runtime.
===============================================================================
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import { TimerManager } from './components/TimerManager';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import { TimerNodeConfig } from './models/TimerTypes';

/* Demo Timers */

const demoTimers: TimerNodeConfig[] = [
  {
    id: crypto.randomUUID(),
    name: 'Workout',
    durationMs: 60000,
    inheritSound: true,
    parallelSiblings: [
      {
        id: crypto.randomUUID(),
        name: 'Warmup',
        durationMs: 15000,
        inheritSound: true,
      },
      {
        id: crypto.randomUUID(),
        name: 'Main',
        durationMs: 30000,
        inheritSound: true,
      },
    ],
    sequentialChild: {
      id: crypto.randomUUID(),
      name: 'Cooldown',
      durationMs: 15000,
      inheritSound: true,
    },
  },
  {
    id: crypto.randomUUID(),
    name: 'Quick Timer',
    durationMs: 10000,
    inheritSound: true,
  },
];

/* Bootstrap */

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TimerManager defaultRoots={demoTimers} />
  </React.StrictMode>,
);

registerServiceWorker();
