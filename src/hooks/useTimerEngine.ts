import { useRef, useState } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';
import { TimerGraph } from '../timers/TimerGraph';
import { TimerScheduler } from '../timers/TimerScheduler';

export function useTimerEngine(config: TimerNodeConfig) {
  const schedulerRef = useRef<TimerScheduler | null>(null);

  const [remaining, setRemaining] = useState<Map<string, number>>(new Map());

  if (!schedulerRef.current) {
    const graph = new TimerGraph(config);
    schedulerRef.current = new TimerScheduler(graph);
  }

  const scheduler = schedulerRef.current;

  const uiInterval = useRef<number | null>(null);

  function start() {
    scheduler.start();

    if (uiInterval.current) clearInterval(uiInterval.current);

    uiInterval.current = window.setInterval(() => {
      setRemaining(new Map(scheduler.getRemainingMap()));
    }, 200);
  }

  function pause() {
    scheduler.stop();
  }

  function reset() {
    scheduler.stop();

    scheduler.graph.root.reset();

    setRemaining(new Map(scheduler.getRemainingMap()));
  }

  function cancel() {
    scheduler.stop();

    scheduler.graph.root.reset();

    setRemaining(new Map());
  }

  return {
    remaining,
    start,
    pause,
    reset,
    cancel,
  };
}
