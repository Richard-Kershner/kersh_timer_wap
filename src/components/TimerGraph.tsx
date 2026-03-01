/*
===============================================================================
FILE: src/components/TimerGraph.tsx

Purpose:
- Visual renderer for TimerNodeConfig tree
- Diagnostic / visualization only
- No runtime mutation
===============================================================================
*/

import { TimerNodeConfig } from '../models/TimerTypes';

interface Props {
  config: TimerNodeConfig;
}

export function TimerGraph({ config }: Props) {
  function renderNode(
    node: TimerNodeConfig,
    depth: number = 0,
  ): React.ReactElement {
    return (
      <div key={node.id} style={{ marginLeft: depth * 20 }}>
        <div>
          {node.name}
          {node.durationMs ? ` (${node.durationMs / 1000}s)` : ''}
        </div>

        {/* Parallel siblings */}
        {node.parallelSiblings?.map((child: TimerNodeConfig) =>
          renderNode(child, depth + 1),
        )}

        {/* Sequential child */}
        {node.sequentialChild && renderNode(node.sequentialChild, depth + 1)}
      </div>
    );
  }

  return <div>{renderNode(config)}</div>;
}
