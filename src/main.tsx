/*
===============================================================================
FILE: src/main.tsx

PURPOSE:
- Bootstrap application
- Construct default demo timer trees
- Render TimerManager
- Register service worker

This file intentionally remains thin and deterministic.
===============================================================================
*/

import React from 'react';
import ReactDOM from 'react-dom/client';

import { TimerNode } from './timers/TimerNode';
import { TimerManager } from './components/TimerManager';
import { registerServiceWorker } from './pwa/registerServiceWorker';

/* ============================================================================
   DEFAULT TIMER TREE #1
============================================================================ */

const timerA = new TimerNode({
  id: 'a',
  name: 'Timer A',
  durationMs: 10000,
});

const timerB = new TimerNode({
  id: 'b',
  name: 'Timer B',
  durationMs: 20000,
});

const intervalChild = new TimerNode({
  id: 'b-int',
  name: '2s Interval',
  durationMs: 0,
  intervalMs: 2000,
});

timerB.addChild(intervalChild);

const root1 = new TimerNode({
  id: 'root-1',
  name: 'Root Timer One',
  durationMs: 0,
});

root1.addChild(timerA);
root1.addChild(timerB);

/* ============================================================================
   DEFAULT TIMER TREE #2
============================================================================ */

const quickTimer = new TimerNode({
  id: 'quick',
  name: 'Quick 5s',
  durationMs: 5000,
});

const repeatTimer = new TimerNode({
  id: 'repeat',
  name: 'Repeat 1s',
  durationMs: 0,
  intervalMs: 1000,
});

const root2 = new TimerNode({
  id: 'root-2',
  name: 'Root Timer Two',
  durationMs: 0,
});

root2.addChild(quickTimer);
root2.addChild(repeatTimer);

/* ============================================================================
   RENDER
============================================================================ */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TimerManager defaultRoots={[root1, root2]} />
  </React.StrictMode>,
);

/* ============================================================================
   PWA
============================================================================ */

registerServiceWorker();
