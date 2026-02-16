/*
File: TimerScheduler.ts

Final Intended Purpose:
- Drives execution of TimerNode trees according to scheduling rules.
- Owns ALL runtime state transitions as defined in Section 6.
- Enforces legal state transitions.
- Prevents illegal execution flows and UI-driven mutations.

Development Steps:
- Step 1: Scheduler shell (COMPLETE — 2026-02-03)
- Step 2: Sequential execution (COMPLETE — 2026-02-05)
- Step 3: Parallel execution (PLANNED)
- Step 4: Background execution (PLANNED)
- Step 6: Runtime state machine lock (COMPLETE — 2026-02-11)
- Step 8.2: Deterministic progress tracking (COMPLETE — 2026-02-16)

Change Log:
- 2026-02-11
  - Introduced authoritative runtimeState.
- 2026-02-16
  - Added elapsed time tracking.
  - Added getProgress().
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

  /* Step 8.2 Progress Tracking */
  private totalDuration = 0;
  private startTime = 0;
  private pausedElapsed = 0;

  start(root: TimerNode): void {
    if (!this.canTransitionTo(TimerState.RUNNING)) return;

    this.root = root;
    this.totalDuration = root.config.durationMs ?? 0;
    this.startTime = Date.now();
    this.pausedElapsed = 0;

    this.transition(TimerState.RUNNING);
    this.loop();
  }

  pause(): void {
    if (!this.canTransitionTo(TimerState.PAUSED)) return;
    this.pausedElapsed += Date.now() - this.startTime;
    this.transition(TimerState.PAUSED);
  }

  resume(): void {
    if (!this.canTransitionTo(TimerState.RUNNING)) return;
    this.startTime = Date.now();
    this.transition(TimerState.RUNNING);
    this.loop();
  }

  reset(): void {
    if (this.runtimeState !== TimerState.COMPLETED) return;
    this.transition(TimerState.IDLE);
  }

  getRuntimeState(): RuntimeState {
    return this.runtimeState;
  }

  getProgress(): number {
    if (!this.totalDuration) return 0;

    let elapsed = this.pausedElapsed;

    if (this.runtimeState === TimerState.RUNNING) {
      elapsed += Date.now() - this.startTime;
    }

    return Math.min(elapsed / this.totalDuration, 1);
  }

  private loop(): void {
    if (this.runtimeState !== TimerState.RUNNING) return;

    if (this.getProgress() >= 1) {
      this.transition(TimerState.COMPLETED);
      return;
    }

    requestAnimationFrame(() => this.loop());
  }

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
    if (!this.canTransitionTo(target)) return;
    this.runtimeState = target;
  }
}
