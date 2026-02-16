/*
File: TimerRunner.tsx

Final Intended Purpose:
- UI control surface for execution lifecycle.
- Dispatches events to useTimerEngine.
- Never mutates engine state directly.

Explicit Responsibilities:
- Render state-aware control buttons.
- Enforce state machine contract.
- Guard against missing root timer.

Connected Files:
- useTimerEngine.ts
- TimerTypes.ts
- TimerNode.ts

Development Steps:
- Step 1: Component scaffold (COMPLETE — 2026-02-03)
- Step 6: Runtime state controls (COMPLETE — 2026-02-11)
- Step 7: Root guard + display (COMPLETE — 2026-02-13)

Change Log:
- 2026-02-13
  - Added root guard.
*/

import { TimerNode } from '../timers/TimerNode';
import { TimerState } from '../models/TimerTypes';
import { useTimerEngine } from '../hooks/useTimerEngine';

interface Props {
  root?: TimerNode;
}

export function TimerRunner({ root }: Props) {
  const { runtimeState, start, pause, resume, reset } = useTimerEngine();

  if (!root) {
    return <div>No timer selected.</div>;
  }

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
