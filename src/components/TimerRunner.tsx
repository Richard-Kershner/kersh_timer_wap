import { TimerNode } from '../timers/TimerNode';
import { TimerState } from '../models/TimerTypes';
import { useTimerEngine } from '../hooks/useTimerEngine';

interface Props {
  root: TimerNode;
}

function format(ms: number) {
  return (ms / 1000).toFixed(1) + 's';
}

export function TimerRunner({ root }: Props) {
  const { runtimeState, start, pause, resume, reset, scheduler } =
    useTimerEngine();

  const active = scheduler.getActiveNode();

  const renderNode = (node: TimerNode, depth = 0) => {
    const remaining = scheduler.getRemainingMs(node);
    const isActive = active === node;

    return (
      <div key={node.config.id} style={{ marginLeft: depth * 20 }}>
        <div
          style={{
            padding: 8,
            marginBottom: 4,
            background: isActive ? '#1f2937' : '#374151',
            color: 'white',
            borderRadius: 4,
          }}
        >
          <strong>{node.config.name}</strong>
          <span style={{ marginLeft: 10 }}>{format(remaining)}</span>
        </div>

        {node
          .getExecutableChildren()
          .map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Timer</h2>

      {/* Root must render itself */}
      {renderNode(root)}

      <div style={{ marginTop: 20 }}>
        {runtimeState === TimerState.IDLE && (
          <button onClick={() => start(root)}>Start</button>
        )}

        {runtimeState === TimerState.RUNNING && (
          <button onClick={pause}>Pause</button>
        )}

        {runtimeState === TimerState.PAUSED && (
          <button onClick={resume}>Resume</button>
        )}

        {runtimeState === TimerState.COMPLETED && (
          <button onClick={reset}>Reset</button>
        )}
      </div>
    </div>
  );
}
