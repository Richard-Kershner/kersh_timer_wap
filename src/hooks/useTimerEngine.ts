/*
===============================================================================
FILE: src/hooks/useTimerEngine.ts

Deterministic recursive engine.
All nodes tracked independently.
===============================================================================
*/

import { useEffect, useRef, useState } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';

interface RuntimeNode {
  config: TimerNodeConfig;
  remaining: number;
  active: boolean;
  children?: RuntimeNode;
  siblings?: RuntimeNode[];
}

function buildRuntime(node: TimerNodeConfig): RuntimeNode {
  return {
    config: node,
    remaining: node.durationMs ?? 0,
    active: false,
    children: node.sequentialChild
      ? buildRuntime(node.sequentialChild)
      : undefined,
    siblings: node.parallelSiblings?.map(buildRuntime),
  };
}

export function useTimerEngine(rootConfig: TimerNodeConfig) {
  const [root, setRoot] = useState<RuntimeNode>(buildRuntime(rootConfig));

  const [state, setState] = useState<'idle' | 'running' | 'paused'>('idle');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function activateNode(node: RuntimeNode) {
    node.active = true;
    node.siblings?.forEach((s) => (s.active = true));
  }

  function stopNode(node: RuntimeNode) {
    node.active = false;
    node.siblings?.forEach((s) => (s.active = false));
  }

  function tickNode(node: RuntimeNode) {
    if (!node.active) return;

    if (node.remaining > 0) {
      node.remaining -= 1000;
    }

    if (node.remaining <= 0) {
      stopNode(node);

      // Start sequential child
      if (node.children) {
        activateNode(node.children);
      }
    }

    node.siblings?.forEach(tickNode);
    if (node.children) tickNode(node.children);
  }

  function start() {
    if (state === 'running') return;

    setState('running');

    activateNode(root);

    intervalRef.current = setInterval(() => {
      tickNode(root);
      setRoot({ ...root });
    }, 1000);
  }

  function pause() {
    setState('paused');
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function cancel() {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setRoot(buildRuntime(rootConfig));
    setState('idle');
  }

  return {
    root,
    state,
    start,
    pause,
    cancel,
  };
}
