import { TimerNodeConfig } from '../../models/TimerTypes';

export interface ColumnNode {
  node: TimerNodeConfig;
  column: number;
  row: number;
}

export function buildColumnTree(root: TimerNodeConfig): ColumnNode[] {
  const result: ColumnNode[] = [];

  function walk(node: TimerNodeConfig, column: number, row: number) {
    result.push({
      node,
      column,
      row,
    });

    const parallels = node.parallelSiblings ?? [];

    parallels.forEach((p, i) => {
      walk(p, column + i + 1, row);
    });

    if (node.sequentialChild) {
      walk(node.sequentialChild, column, row + 1);
    }
  }

  walk(root, 0, 0);

  return result;
}
