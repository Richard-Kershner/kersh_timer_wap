/*
===============================================================================
FILE: src/hooks/useTimerEngine.ts

Corrected Execution Model

• Root and parallels activate on SAME tick boundary.
• They decrement together.
• Sequential activates ONLY after parent finishes.
• Sounds fire exactly once on completion.
• Reset supported after complete.
===============================================================================
*/

import { useEffect, useRef, useState } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';
import { audioManager } from '../services/AudioManager';


let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  const audio = new Audio();
  audio.src =
      'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAA...'; // 1-frame silent mp3
  audio.play().catch(() => {});
  audioUnlocked = true;
}


export interface RuntimeNode {
  config: TimerNodeConfig;
  remainingMs: number;
  active: boolean;
  completed: boolean;
  effectiveSound?: string;
  parallel: RuntimeNode[];
  sequential?: RuntimeNode;
}

function buildRuntime(
  config: TimerNodeConfig,
  inheritedSound?: string,
): RuntimeNode {
  const resolvedSound = config.inheritSound
    ? inheritedSound
    : (config.sound ?? inheritedSound);

  return {
    config,
    remainingMs: config.durationMs,
    active: false,
    completed: false,
    effectiveSound: resolvedSound,
    parallel:
      config.parallelSiblings?.map((p) => buildRuntime(p, resolvedSound)) ?? [],
    sequential: config.sequentialChild
      ? buildRuntime(config.sequentialChild, resolvedSound)
      : undefined,
  };
}


function activateTree(node: RuntimeNode): RuntimeNode {
  return {
    ...node,
    active: true,
    parallel: node.parallel.map(activateTree),
  };
}

function tickNode(node: RuntimeNode): RuntimeNode {
  let updated = node;

  /* Tick self */
  if (node.active && node.remainingMs > 0) {
    updated = {
      ...node,
      remainingMs: node.remainingMs - 1000,
    };
  }

  /* Tick parallels simultaneously */
  const updatedParallels = updated.parallel.map((p) =>
      p.active ? tickNode(p) : p
  );

  updated = { ...updated, parallel: updatedParallels };

  /* Handle completion */
  if (
      updated.active &&
      updated.remainingMs <= 0 &&
      !updated.completed
  ) {
    updated = {
      ...updated,
      remainingMs: 0,
      active: false,
      completed: true,
      parallel: updated.parallel.map((p) => ({
        ...p,
        active: false,
      })),
    };

    // 🔊 Play sound once
// 🔊 Play sound once (reliable playback)
    audioManager.play(updated.effectiveSound);



    // Activate sequential AFTER parent finishes
    if (updated.sequential) {
      updated = {
        ...updated,
        sequential: activateTree(updated.sequential),
      };
    }
  }

  /* Tick sequential only if active */
  if (updated.sequential?.active) {
    updated = {
      ...updated,
      sequential: tickNode(updated.sequential),
    };
  }

  return updated;
}

function treeFinished(node: RuntimeNode): boolean {
  if (!node.completed) return false;

  if (node.parallel.some((p) => !treeFinished(p))) return false;

  if (node.sequential && !treeFinished(node.sequential)) return false;

  return true;
}

export function useTimerEngine(rootConfig: TimerNodeConfig) {
  const [root, setRoot] = useState<RuntimeNode>(() =>
    buildRuntime(rootConfig, rootConfig.sound),
  );


  const [state, setState] =
      useState<'idle' | 'running' | 'complete'>('idle');

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRoot(buildRuntime(rootConfig, rootConfig.sound));
    setState('idle');
  }, [rootConfig]);

  function start() {
    if (state === 'running') return;

    unlockAudio();

    setRoot((prev) => activateTree(prev));
    setState('running');

    intervalRef.current = window.setInterval(() => {
      setRoot((prev) => {
        const next = tickNode(prev);

        if (treeFinished(next)) {
          if (intervalRef.current)
            clearInterval(intervalRef.current);
          setState('complete');
        }

        return next;
      });
    }, 1000);
  }

  function pause() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState('idle');
  }

  function cancel() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRoot(buildRuntime(rootConfig, rootConfig.sound));
    setState('idle');
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRoot(buildRuntime(rootConfig, rootConfig.sound));
    setState('idle');
  }

  return {
    root,
    state,
    start,
    pause,
    cancel,
    reset,
  };
}
