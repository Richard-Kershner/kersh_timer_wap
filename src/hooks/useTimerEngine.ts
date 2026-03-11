import { useEffect, useRef, useState } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';
import { audioManager } from '../audio/AudioManager';

type State = 'idle' | 'running' | 'complete';

export function useTimerEngine(root: TimerNodeConfig) {
  const [state, setState] = useState<State>('idle');
  const [remaining, setRemaining] = useState<Map<string, number>>(new Map());

  const activeNodes = useRef<TimerNodeConfig[]>([]);
  const interval = useRef<number | null>(null);

  function initialize(node: TimerNodeConfig, map: Map<string, number>) {
    map.set(node.id, node.durationMs ?? 0);

    if (node.sequentialChild) initialize(node.sequentialChild, map);

    node.parallelSiblings?.forEach((p) => initialize(p, map));
  }

  function activateNode(node: TimerNodeConfig) {
    activeNodes.current.push(node);

    node.parallelSiblings?.forEach((p) => {
      activeNodes.current.push(p);
    });
  }

  function start() {
    const map = new Map<string, number>();
    initialize(root, map);

    setRemaining(map);

    activeNodes.current = [];
    activateNode(root);

    setState('running');

    interval.current = window.setInterval(tick, 1000);
  }

  function resolveSound(
    node: TimerNodeConfig,
    root: TimerNodeConfig,
  ): string | undefined {
    if (!node.inheritSound) return node.sound;

    function findParent(
      target: TimerNodeConfig,
      current: TimerNodeConfig,
    ): TimerNodeConfig | null {
      if (current.sequentialChild?.id === target.id) return current;

      if (current.parallelSiblings?.some((p) => p.id === target.id))
        return current;

      let found = null;

      if (current.sequentialChild)
        found = findParent(target, current.sequentialChild);

      if (found) return found;

      for (const p of current.parallelSiblings ?? []) {
        found = findParent(target, p);

        if (found) return found;
      }

      return null;
    }

    let parent = findParent(node, root);

    while (parent) {
      if (!parent.inheritSound && parent.sound) return parent.sound;

      parent = findParent(parent, root);
    }

    return undefined;
  }

  function tick() {
    setRemaining((prev) => {
      const next = new Map(prev);

      activeNodes.current.forEach((node) => {
        const current = next.get(node.id) ?? 0;

        const updated = Math.max(current - 1000, 0);

        next.set(node.id, updated);

        if (current > 0 && updated === 0) {
          /* play alarm */

          const sound = resolveSound(node, root);

          if (sound) {
            audioManager.play(sound);
          }

          /* start child after parent */

          if (node.sequentialChild) {
            activateNode(node.sequentialChild);
          }
        }
      });

      return next;
    });
  }

  function pause() {
    if (interval.current) clearInterval(interval.current);
    setState('idle');
  }

  function reset() {
    if (interval.current) clearInterval(interval.current);

    const map = new Map<string, number>();
    initialize(root, map);

    setRemaining(map);

    activeNodes.current = [];
    setState('idle');
  }

  function cancel() {
    if (interval.current) clearInterval(interval.current);

    setRemaining(new Map());
    activeNodes.current = [];
    setState('idle');
  }

  useEffect(() => {
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  return {
    state,
    remaining,
    start,
    pause,
    reset,
    cancel,
  };
}
