/*
===============================================================================
FILE: src/components/TimerRunner.tsx
===============================================================================
*/

import { useTimerEngine, RuntimeNode } from '../hooks/useTimerEngine';
import { TimerNodeConfig } from '../models/TimerTypes';

interface Props {
  root: TimerNodeConfig;
}

function format(ms: number) {
  return Math.max(0, Math.floor(ms / 1000));
}

function renderNode(node: RuntimeNode, depth: number) {
  return (
    <div key={node.config.id} style={{ marginLeft: depth * 20 }}>
      {node.config.name} — {Math.max(0, Math.floor(node.remainingMs / 1000))}s{' '}
      {node.active ? '(running)' : ''}
      {node.parallel.map((p) => renderNode(p, depth + 1))}
      {node.sequential && renderNode(node.sequential, depth + 1)}
    </div>
  );
}

export function TimerRunner({ root }: Props) {
  const {
    root: runtimeRoot,
    state,
    start,
    pause,
    cancel,
    reset,
  } = useTimerEngine(root);


  return (
    <div style={{ marginTop: 20 }}>
      <h3>{root.name}</h3>

      <div>State: {state}</div>

      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={cancel}>Cancel</button>

      <div style={{ marginTop: 20 }}>{renderNode(runtimeRoot, 0)}</div>
    </div>
  );
}
