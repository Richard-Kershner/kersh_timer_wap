/*
File: TimerScheduler.ts

Final Intended Purpose:
- Drives execution of TimerNode trees according to scheduling rules.
- Owns runtime progression but not persistence or UI concerns.

Explicit Responsibilities:
- Execute TimerNode trees in deterministic order.
- Manage TimerState transitions during execution.
- Delegate audio signaling to AudioManager (not yet active).

Connected Files:
- TimerNode.ts (structure and execution helpers)
- TimerGraph.ts (entry point for execution)
- AudioManager.ts (invoked in later steps)

Shared Data Models:
- TimerState

Naming Conventions Enforced:
- Execution methods use imperative verbs.
- Internal helpers are private and prefixed consistently.

Development Steps:
- Step 1: Scheduler shell (COMPLETE — 2026-02-03)
- Step 2: Sequential execution (COMPLETE — 2026-02-05)
- Step 3: Parallel execution (PLANNED)
- Step 4: Background execution (PLANNED)

Change Log:
- Step 1 completed on 2026-02-03
- Step 2 completed on 2026-02-05
  - Added depth-first sequential execution
  - Implemented basic state transitions
*/

import { TimerNode } from './TimerNode';
import { TimerState } from '../models/TimerTypes';

export class TimerScheduler {
  private isRunning = false;

  /**
   * Step 2:
   * Starts execution from a root TimerNode.
   * Sequential execution only.
   */
  start(root: TimerNode): void {
    // Step 2: Entry point guard
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.executeNodeSequentially(root);
  }

  /**
   * Step 2:
   * Stops execution immediately.
   * Does not reset state (handled in later steps).
   */
  stop(): void {
    // Step 2: Hard stop
    this.isRunning = false;
  }

  /**
   * Step 2:
   * Executes a TimerNode and its children sequentially.
   * Timing mechanics are intentionally omitted at this stage.
   */
  private executeNodeSequentially(node: TimerNode): void {
    // Step 2: Abort if scheduler stopped
    if (!this.isRunning) {
      return;
    }

    // Step 2: State transition — start
    node.state = TimerState.RUNNING;

    // Step 2: Execute children in order
    for (const child of node.getExecutableChildren()) {
      this.executeNodeSequentially(child);
    }

    // Step 2: State transition — complete
    node.state = TimerState.COMPLETED;
  }
}
