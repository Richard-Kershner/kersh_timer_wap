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
            padding: 6,
            background: isActive ? '#222' : '#444',
            color: 'white',
            marginBottom: 4,
          }}
        >
          {node.config.name} — {format(remaining)}
        </div>
        {node
          .getExecutableChildren()
          .map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Functional Demo</h2>

      {root.getExecutableChildren().map((node) => renderNode(node))}

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
