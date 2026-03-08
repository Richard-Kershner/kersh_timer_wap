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

function NodeBox({ node }: { node: RuntimeNode }) {
  return (
    <div
      style={{
        border: '1px solid #aaa',
        padding: 10,
        margin: 4,
        textAlign: 'center',
        minWidth: 120,
      }}
    >
      <div>{node.config.name}</div>
      <div>{Math.max(0, Math.floor(node.remainingMs / 1000))}s</div>
      {node.active && <div>(running)</div>}
    </div>
  );
}

function renderChildren(node: RuntimeNode) {
  const rows: RuntimeNode[] = [];

  let current = node.sequential;

  while (current) {
    rows.push(current);
    current = current.sequential;
  }

  if (rows.length === 0) return null;

  return (
    <div style={{ marginTop: 10 }}>
      {rows.map((child) => (
        <NodeBox key={child.config.id} node={child} />
      ))}
    </div>
  );
}

function renderColumns(root: RuntimeNode) {
  const columns: RuntimeNode[] = [root, ...root.parallel];

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {columns.map((col) => (
        <div
          key={col.config.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <NodeBox node={col} />
          {renderChildren(col)}
        </div>
      ))}
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

      <div style={{ marginTop: 10 }}>
        <button onClick={start}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={cancel}>Cancel</button>
        <button onClick={reset}>Reset</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {runtimeRoot && renderColumns(runtimeRoot)}
      </div>
    </div>
  );
}
