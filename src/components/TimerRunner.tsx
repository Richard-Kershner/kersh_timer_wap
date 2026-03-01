import { TimerNodeConfig } from '../models/TimerTypes';
import { TimerScheduler } from '../timers/TimerScheduler';
import { useEffect, useState } from 'react';

interface Props {
  root: TimerNodeConfig;
}

export function TimerRunner({ root }: Props) {
  const [, setTick] = useState(0);
  const [scheduler] = useState(
    () => new TimerScheduler(() => setTick((v) => v + 1)),
  );

  useEffect(() => {
    scheduler.start(root);
    return () => scheduler.stop();
  }, [root]);

  const renderNode = (node: TimerNodeConfig, depth = 0) => {
    const state = scheduler.getActiveStates().get(node.id);
    const remaining = state ? state.remainingMs : node.durationMs;

    return (
      <div key={node.id} style={{ marginLeft: depth * 20 }}>
        <div>
          {node.name} – {(remaining / 1000).toFixed(1)}s
        </div>

        {node.parallelSiblings?.map((s) => renderNode(s, depth + 1))}

        {node.sequentialChild && renderNode(node.sequentialChild, depth + 1)}
      </div>
    );
  };

  return <div>{renderNode(root)}</div>;
}
