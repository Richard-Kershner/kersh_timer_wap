/*
===============================================================================
Grid renderer used by both editor and runtime skins
===============================================================================
*/

import { buildColumnTree } from './buildColumnTree';
import { TimerNodeConfig } from '../../models/TimerTypes';

interface Props {
  root: TimerNodeConfig;
  renderNode: (node: TimerNodeConfig) => React.ReactNode;
}

export function TimerColumnGrid({ root, renderNode }: Props) {
  const nodes = buildColumnTree(root);

  const maxCol = Math.max(...nodes.map((n) => n.column));
  const maxRow = Math.max(...nodes.map((n) => n.row));

  const grid: (TimerNodeConfig | null)[][] = [];

  for (let r = 0; r <= maxRow; r++) {
    const row: (TimerNodeConfig | null)[] = [];

    for (let c = 0; c <= maxCol; c++) {
      const found = nodes.find((n) => n.column === c && n.row === r);

      row.push(found ? found.node : null);
    }

    grid.push(row);
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {grid.map((row, r) => (
        <div
          key={r}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${maxCol + 1}, 1fr)`,
            gap: 20,
          }}
        >
          {row.map((node, c) => (
            <div key={c}>{node && renderNode(node)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
