import { useTimerEngine } from '../hooks/useTimerEngine';
import { ColumnRunnerSkin } from '../skins/classic/ColumnRunnerSkin';
import { TimerNodeConfig } from '../models/TimerTypes';

export function TimerRunner({ root }: { root: TimerNodeConfig }) {
  const engine = useTimerEngine(root);

  return (
    <div>
      {ColumnRunnerSkin.renderRunner(root, engine.remaining)}

      <div style={{ marginTop: 20 }}>
        <button onClick={engine.start}>Start</button>
        <button onClick={engine.pause}>Pause</button>
        <button onClick={engine.reset}>Reset</button>
        <button onClick={engine.cancel}>Cancel</button>
      </div>
    </div>
  );
}
