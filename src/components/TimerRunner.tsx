/*
===============================================================================
FILE: src/components/TimerRunner.tsx

Execution wrapper for TimerNodeConfig
Exposes Start / Pause / Cancel
===============================================================================
*/

import { useTimerEngine } from '../hooks/useTimerEngine';
import { TimerNodeConfig } from '../models/TimerTypes';

interface Props {
  root: TimerNodeConfig;
}

export function TimerRunner({ root }: Props) {
  const { state, remaining, start, pause, cancel } = useTimerEngine(root);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>{root.name}</h3>

      <div>Remaining: {remaining} ms</div>

      <div style={{ marginTop: 10 }}>
        <button onClick={start}>Start</button>

        <button onClick={pause}>Pause</button>

        <button onClick={cancel}>Cancel</button>
      </div>

      <div>State: {state}</div>
    </div>
  );
}
