import { useRef, useState, useEffect } from 'react';
import { TimerScheduler } from '../timers/TimerScheduler';
import { TimerNode } from '../timers/TimerNode';
import { TimerState } from '../models/TimerTypes';

export function useTimerEngine() {
  const schedulerRef = useRef(new TimerScheduler());
  const [runtimeState, setRuntimeState] = useState<TimerState>(TimerState.IDLE);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRuntimeState(schedulerRef.current.getRuntimeState());
      forceUpdate((n) => n + 1);
    }, 100);

    return () => clearInterval(id);
  }, []);

  return {
    runtimeState,
    start: (root: TimerNode) => schedulerRef.current.start(root),
    pause: () => schedulerRef.current.pause(),
    resume: () => schedulerRef.current.resume(),
    reset: () => schedulerRef.current.reset(),
    scheduler: schedulerRef.current,
  };
}
