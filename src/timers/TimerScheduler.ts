/*
File: TimerScheduler.ts

Final Intended Purpose:
- Drives execution of TimerNode trees according to scheduling rules.
- Owns ALL runtime state transitions as defined in Section 6 (Runtime State Machine).
- Enforces legal state transitions.
- Prevents illegal execution flows and UI-driven mutations.

Explicit Responsibilities:
- Execute TimerNode trees in deterministic order.
- Own the authoritative runtime state machine.
- Validate and enforce legal transitions.
- Emit transition events for AudioManager (future).
- Reject illegal transitions.

Connected Files:
- TimerNode.ts (structure and execution helpers)
- TimerGraph.ts (execution entry point)
- AudioManager.ts (future event subscriber)
- useTimerEngine.ts (UI dispatch bridge)

Shared Data Models:
- TimerState (IDLE, RUNNING, PAUSED, COMPLETED)

Naming Conventions Enforced:
- Public transition methods use imperative verbs.
- Internal validation helpers are prefixed with "can".
- State transition handler is centralized.

Development Steps:
- Step 1: Scheduler shell (COMPLETE — 2026-02-03)
- Step 2: Sequential execution (COMPLETE — 2026-02-05)
- Step 3: Parallel execution (PLANNED)
- Step 4: Background execution (PLANNED)
- Step 6: Runtime state machine lock (COMPLETE — 2026-02-11)

Change Log:
- 2026-02-11
  - Introduced authoritative runtimeState.
  - Implemented legal transition validation matrix.
  - Locked illegal transitions.
  - Removed direct state mutation from start().
*/

import { TimerNode } from './TimerNode';
import { TimerState } from '../models/TimerTypes';

type RuntimeState =
  | TimerState.IDLE
  | TimerState.RUNNING
  | TimerState.PAUSED
  | TimerState.COMPLETED;

export class TimerScheduler {
  private runtimeState: RuntimeState = TimerState.IDLE;
  private root: TimerNode | null = null;

  /* ============================================================
     PUBLIC API — UI DISPATCH ENTRY POINTS (Step 6)
     ============================================================ */

  start(root: TimerNode): void {
    if (!this.canTransitionTo(TimerState.RUNNING)) return;

    this.root = root;
    this.transition(TimerState.RUNNING);
    this.executeNodeSequentially(root);
  }

  pause(): void {
    if (!this.canTransitionTo(TimerState.PAUSED)) return;
    this.transition(TimerState.PAUSED);
  }

  resume(): void {
    if (!this.canTransitionTo(TimerState.RUNNING)) return;
    this.transition(TimerState.RUNNING);
  }

  reset(): void {
    if (this.runtimeState !== TimerState.COMPLETED) return;
    this.transition(TimerState.IDLE);
  }

  getRuntimeState(): RuntimeState {
    return this.runtimeState;
  }

  /* ============================================================
     STATE MACHINE ENFORCEMENT (Step 6)
     ============================================================ */

  private canTransitionTo(target: RuntimeState): boolean {
    const current = this.runtimeState;

    switch (current) {
      case TimerState.IDLE:
        return target === TimerState.RUNNING;

      case TimerState.RUNNING:
        return target === TimerState.PAUSED || target === TimerState.COMPLETED;

      case TimerState.PAUSED:
        return target === TimerState.RUNNING;

      case TimerState.COMPLETED:
        return target === TimerState.IDLE;

      default:
        return false;
    }
  }

  private transition(target: RuntimeState): void {
    if (!this.canTransitionTo(target)) {
      return; // Illegal transition rejected
    }

    this.runtimeState = target;

    // Step 6:
    // AudioManager will subscribe to transition events in future step.
  }

  /* ============================================================
     EXECUTION LOGIC (Step 2 + Step 6 Guarding)
     ============================================================ */

  private executeNodeSequentially(node: TimerNode): void {
    if (this.runtimeState !== TimerState.RUNNING) return;

    node.state = TimerState.RUNNING;

    for (const child of node.getExecutableChildren()) {
      if (this.runtimeState !== TimerState.RUNNING) return;
      this.executeNodeSequentially(child);
    }

    node.state = TimerState.COMPLETED;

    // Step 6:
    // Only scheduler may mark global COMPLETED
    if (node === this.root) {
      this.transition(TimerState.COMPLETED);
    }
  }
}
