import React from 'react';
import ReactDOM from 'react-dom/client';
import { TimerNode } from './timers/TimerNode';
import { TimerRunner } from './components/TimerRunner';
import { registerServiceWorker } from './pwa/registerServiceWorker';

// Demo tree
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

const root = new TimerNode({
  id: 'root',
  name: 'Root',
  durationMs: 0,
});

root.addChild(timerA);
root.addChild(timerB);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TimerRunner root={root} />
  </React.StrictMode>,
);

registerServiceWorker();
