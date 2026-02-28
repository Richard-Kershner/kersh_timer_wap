import { TimerConfig } from '../models/TimerTypes';

export function TimerGraph({ config }: { config: TimerConfig }) {
  function render(node: TimerConfig, depth = 0) {
    return (
      <div key={node.id} style={{ marginLeft: depth * 20 }}>
        • {node.name}
        {node.children?.map((c) => render(c, depth + 1))}
      </div>
    );
  }

  return (
    <div>
      <h3>Structure</h3>
      {render(config)}
    </div>
  );
}
