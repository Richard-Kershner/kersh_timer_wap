/*
File: useTimerEngine.ts

Final Intended Purpose:
- React hook bridging UI and TimerScheduler.
- UI dispatches events only.
- Prevents direct mutation of engine state.

Explicit Responsibilities:
- Expose scheduler state.
- Provide dispatch functions: start, pause, resume, reset.
- Prevent UI from mutating engine internals.

Connected Files:
- TimerScheduler.ts
- TimerGraph.ts
- TimerTypes.ts

Shared Data Models:
- TimerState

Development Steps:
- Step 1: Hook skeleton (COMPLETE — 2026-02-03)
- Step 6: State machine integration (COMPLETE — 2026-02-11)

Change Log:
- 2026-02-11
  - Connected scheduler runtime state.
  - Implemented UI-safe dispatch contract.
*/

import { useRef, useState } from 'react';
import { TimerScheduler } from '../timers/TimerScheduler';
import { TimerNode } from '../timers/TimerNode';
import { TimerState } from '../models/TimerTypes';

export function useTimerEngine() {
  const schedulerRef = useRef(new TimerScheduler());
  const [runtimeState, setRuntimeState] = useState<TimerState>(TimerState.IDLE);

  const syncState = () => {
    setRuntimeState(schedulerRef.current.getRuntimeState());
  };

  const start = (root: TimerNode) => {
    schedulerRef.current.start(root);
    syncState();
  };

  const pause = () => {
    schedulerRef.current.pause();
    syncState();
  };

  const resume = () => {
    schedulerRef.current.resume();
    syncState();
  };

  const reset = () => {
    schedulerRef.current.reset();
    syncState();
  };

  return {
    runtimeState,
    start,
    pause,
    resume,
    reset,
  };
}
