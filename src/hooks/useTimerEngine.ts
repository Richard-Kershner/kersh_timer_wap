import { useRef, useState, useEffect } from 'react';
import { TimerScheduler } from '../timers/TimerScheduler';
import { TimerNodeConfig } from '../models/TimerTypes';

export function useTimerEngine(rootConfig: TimerNodeConfig) {
  const schedulerRef = useRef<TimerScheduler | null>(null);

  const [remaining, setRemaining] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const scheduler = new TimerScheduler(rootConfig);

    schedulerRef.current = scheduler;

    setRemaining(scheduler.getRemainingMap());
  }, [rootConfig]);

  function start() {
    schedulerRef.current?.start();

    startTickLoop();
  }

  function pause() {
    schedulerRef.current?.stop();
  }

  function reset() {
    schedulerRef.current?.reset();

    setRemaining(schedulerRef.current?.getRemainingMap() ?? new Map());
  }

  function cancel() {
    schedulerRef.current?.reset();

    setRemaining(schedulerRef.current?.getRemainingMap() ?? new Map());
  }

  function startTickLoop() {
    const scheduler = schedulerRef.current;

    if (!scheduler) return;

    const interval = setInterval(() => {
      setRemaining(new Map(scheduler.getRemainingMap()));

      if (scheduler.isComplete()) {
        clearInterval(interval);
      }
    }, 100);
  }

  return {
    remaining,
    start,
    pause,
    reset,
    cancel,
  };
}
