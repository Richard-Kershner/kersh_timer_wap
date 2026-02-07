/*
File: TimerNode.ts

Final Intended Purpose:
- Represents a single executable timer node within a nested timer tree.
- Encapsulates structural relationships and execution rules, but not scheduling.

Explicit Responsibilities:
- Store immutable timer configuration (TimerConfig).
- Track mutable runtime state (TimerState).
- Maintain parent → child relationships.
- Define child execution rules used by TimerScheduler.

Connected Files:
- TimerGraph.ts (creates and owns TimerNode instances)
- TimerScheduler.ts (invokes execution-related methods)
- AudioManager.ts (reacts to state transitions)

Shared Data Models:
- TimerConfig (read-only)
- TimerState (mutated internally)

Naming Conventions Enforced:
- Class names use PascalCase.
- Methods that expose execution intent use imperative verbs.
- No scheduler or timing logic is implemented here.

Development Steps:
- Step 1: Data structure definition (COMPLETE — 2026-02-03)
- Step 2: Child execution rules (COMPLETE — 2026-02-05)
- Step 3: State transitions (PLANNED)
- Step 4: Integration changes (PLANNED)

Change Log:
- Step 1 completed on 2026-02-03
- Step 2 completed on 2026-02-05
  - Added child attachment rules
  - Added execution ordering helpers
  - No runtime scheduling logic introduced
*/

import { TimerConfig, TimerState } from '../models/TimerTypes';

export class TimerNode {
  readonly config: TimerConfig;
  state: TimerState = TimerState.IDLE;
  children: TimerNode[] = [];

  constructor(config: TimerConfig) {
    this.config = config;
  }

  /**
   * Step 2:
   * Attaches a child TimerNode to this node.
   * Enforces structural-only rules; execution timing is delegated.
   */
  addChild(child: TimerNode): void {
    // Step 2: Structural validation only
    if (child === this) {
      throw new Error('TimerNode cannot be a child of itself');
    }

    this.children.push(child);
  }

  /**
   * Step 2:
   * Returns child nodes in the order they should be executed.
   * Sequential vs parallel interpretation is handled by TimerScheduler.
   */
  getExecutableChildren(): TimerNode[] {
    // Step 2: Ordering only, no execution
    return this.children;
  }

  /**
   * Step 2:
   * Indicates whether this node has executable children.
   * Used by TimerScheduler to determine leaf vs composite behavior.
   */
  hasChildren(): boolean {
    return this.children.length > 0;
  }
}
