/*
===============================================================================
FILE: src/components/TimerRunner.tsx
===============================================================================
*/

import { useTimerEngine } from '../hooks/useTimerEngine';
import { TimerNodeConfig } from '../models/TimerTypes';

interface Props {
  root: TimerNodeConfig;
}

function renderTree(node: TimerNodeConfig, depth = 0) {
  return (
    <div key={node.id} style={{ marginLeft: depth * 20 }}>
      {node.name}
      {node.sequentialChild && renderTree(node.sequentialChild, depth + 1)}
      {node.parallelSiblings?.map((p) => renderTree(p, depth + 1))}
    </div>
  );
}

function renderRuntime(node: any, depth = 0) {
  return (
    <div key={node.config.id} style={{ marginLeft: depth * 20 }}>
      {node.config.name} — {Math.max(0, node.remaining / 1000)}s
      {node.active && ' (running)'}
      {node.siblings?.map((s: any) => renderRuntime(s, depth + 1))}
      {node.children && renderRuntime(node.children, depth + 1)}
    </div>
  );
}

export function TimerRunner({ root }: Props) {
  const { state, remaining, start, pause, cancel } = useTimerEngine(root);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>{root.name}</h3>

      <div>Remaining: {remaining}</div>
      <div>State: {state}</div>

      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={cancel}>Cancel</button>

      <div style={{ marginTop: 20 }}>{renderTree(root)}</div>
    </div>
  );
}
