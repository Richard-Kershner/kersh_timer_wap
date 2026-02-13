/*
File: TimerRunner.tsx

Final Intended Purpose:
- UI control surface for execution lifecycle.
- Dispatches events to useTimerEngine.
- Never mutates engine state directly.

Explicit Responsibilities:
- Render state-aware control buttons.
- Enforce UI contract defined in Step 6.

Connected Files:
- useTimerEngine.ts
- TimerTypes.ts

Development Steps:
- Step 1: Component scaffold (COMPLETE — 2026-02-03)
- Step 6: Runtime state controls (COMPLETE — 2026-02-11)

Change Log:
- 2026-02-11
  - Added state-driven control rendering.
*/

import { TimerNode } from '../timers/TimerNode';
import { TimerState } from '../models/TimerTypes';
import { useTimerEngine } from '../hooks/useTimerEngine';

interface Props {
  root: TimerNode;
}

export function TimerRunner({ root }: Props) {
  const { runtimeState, start, pause, resume, reset } = useTimerEngine();

  return (
    <div>
      <div>Runtime State: {runtimeState}</div>

      {runtimeState === TimerState.IDLE && (
        <button onClick={() => start(root)}>Start</button>
      )}

      {runtimeState === TimerState.RUNNING && (
        <button onClick={pause}>Pause</button>
      )}

      {runtimeState === TimerState.PAUSED && (
        <button onClick={resume}>Resume</button>
      )}

      {runtimeState === TimerState.COMPLETED && (
        <button onClick={reset}>Reset</button>
      )}
    </div>
  );
}
