/*
===============================================================================
FILE: src/hooks/useTimerEngine.ts

Deterministic timer execution engine
Simple single-root execution
No nested scheduling yet
===============================================================================
*/

import { useEffect, useRef, useState } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';

type EngineState = 'Idle' | 'Running' | 'Paused' | 'Completed';

export function useTimerEngine(root: TimerNodeConfig) {
  const [state, setState] = useState<EngineState>('Idle');

  const [remaining, setRemaining] = useState<number>(root.durationMs ?? 0);

  const intervalRef = useRef<number | null>(null);

  function start() {
    if (state === 'Running') return;

    setState('Running');

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(intervalRef.current!);
          setState('Completed');
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  }

  function pause() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState('Paused');
  }

  function cancel() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setRemaining(root.durationMs ?? 0);
    setState('Idle');
  }

  useEffect(() => {
    cancel();
  }, [root]);

  return {
    state,
    remaining,
    start,
    pause,
    cancel,
  };
}
