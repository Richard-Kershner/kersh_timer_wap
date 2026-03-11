/*
===============================================================================
Builds column-aligned timer tree structure.
===============================================================================
*/

import { TimerNodeConfig } from '../../models/TimerTypes';

export interface ColumnNode {
  node: TimerNodeConfig;
  column: number;
  row: number;
}

export function buildColumnTree(root: TimerNodeConfig): ColumnNode[] {
  const result: ColumnNode[] = [];

  function traverse(node: TimerNodeConfig, column: number, row: number) {
    result.push({
      node,
      column,
      row,
    });

    /* sequential child goes downward */
    if (node.sequentialChild) {
      traverse(node.sequentialChild, column, row + 1);
    }

    /* parallels go right */
    node.parallelSiblings?.forEach((p, index) => {
      traverse(p, column + index + 1, row);
    });
  }

  traverse(root, 0, 0);

  return result;
}
