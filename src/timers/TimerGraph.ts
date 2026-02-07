/*
File: TimerGraph.ts

Final Intended Purpose:
- Owns and exposes a navigable hierarchy of TimerNode instances.
- Acts as the authoritative structural representation of a timer tree.

Explicit Responsibilities:
- Hold a single root TimerNode.
- Provide traversal helpers used by TimerScheduler and diagnostics.
- Avoid execution, timing, or mutation of TimerNode state.

Connected Files:
- TimerNode.ts (nodes contained by this graph)
- PersistenceService.ts (serializes / deserializes structure)

Shared Data Models:
- TimerNode (read-only traversal, no mutation)

Naming Conventions Enforced:
- Traversal helpers use explicit graph terminology (traverse, collect).
- No execution or scheduling verbs are permitted here.

Development Steps:
- Step 1: Graph container (COMPLETE — 2026-02-03)
- Step 2: Traversal helpers (COMPLETE — 2026-02-05)
- Step 3: Validation (PLANNED)
- Step 4: Persistence hooks (PLANNED)

Change Log:
- Step 1 completed on 2026-02-03
- Step 2 completed on 2026-02-05
  - Added depth-first traversal
  - Added node collection helpers
*/

import { TimerNode } from './TimerNode';

export class TimerGraph {
  root: TimerNode;

  constructor(root: TimerNode) {
    this.root = root;
  }

  /**
   * Step 2:
   * Performs a depth-first traversal starting at the root.
   * The visitor is invoked once per node.
   */
  traverseDepthFirst(visitor: (node: TimerNode) => void): void {
    // Step 2: DFS traversal helper
    const walk = (node: TimerNode): void => {
      visitor(node);
      node.children.forEach(walk);
    };

    walk(this.root);
  }

  /**
   * Step 2:
   * Collects all nodes in the graph using depth-first traversal.
   * Ordering is deterministic and stable.
   */
  collectAllNodes(): TimerNode[] {
    // Step 2: Node aggregation helper
    const nodes: TimerNode[] = [];

    this.traverseDepthFirst((node) => {
      nodes.push(node);
    });

    return nodes;
  }

  /**
   * Step 2:
   * Identifies leaf nodes (nodes with no children).
   * Used by TimerScheduler to identify terminal execution points.
   */
  collectLeafNodes(): TimerNode[] {
    // Step 2: Leaf identification helper
    const leaves: TimerNode[] = [];

    this.traverseDepthFirst((node) => {
      if (!node.hasChildren()) {
        leaves.push(node);
      }
    });

    return leaves;
  }
}
