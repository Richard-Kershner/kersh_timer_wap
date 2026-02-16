/*
Step 8.2:
- Expose progress read-only.
*/

import { useRef, useState, useEffect } from 'react';
import { TimerScheduler } from '../timers/TimerScheduler';
import { TimerNode } from '../timers/TimerNode';
import { TimerState } from '../models/TimerTypes';

export function useTimerEngine() {
  const schedulerRef = useRef(new TimerScheduler());
  const [runtimeState, setRuntimeState] = useState<TimerState>(TimerState.IDLE);
  const [progress, setProgress] = useState(0);

  const syncState = () => {
    setRuntimeState(schedulerRef.current.getRuntimeState());
    setProgress(schedulerRef.current.getProgress());
  };

  useEffect(() => {
    const id = setInterval(syncState, 100);
    return () => clearInterval(id);
  }, []);

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
    progress,
    start,
    pause,
    resume,
    reset,
  };
}
