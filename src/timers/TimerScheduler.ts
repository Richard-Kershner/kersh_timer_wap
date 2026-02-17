import { TimerNode } from './TimerNode';
import { TimerState } from '../models/TimerTypes';

type RuntimeState =
  | TimerState.IDLE
  | TimerState.RUNNING
  | TimerState.PAUSED
  | TimerState.COMPLETED;

interface ActiveContext {
  node: TimerNode;
  startTime: number;
  elapsed: number;
}

export class TimerScheduler {
  private runtimeState: RuntimeState = TimerState.IDLE;
  private sequence: TimerNode[] = [];
  private activeIndex = 0;
  private activeContext: ActiveContext | null = null;
  private intervalTrackers = new Map<TimerNode, number>();

  start(root: TimerNode): void {
    if (!this.canTransitionTo(TimerState.RUNNING)) return;

    this.sequence = root.getExecutableChildren();
    this.activeIndex = 0;
    this.startNext();

    this.transition(TimerState.RUNNING);
    this.loop();
  }

  pause(): void {
    if (!this.canTransitionTo(TimerState.PAUSED)) return;
    this.transition(TimerState.PAUSED);
  }

  resume(): void {
    if (!this.canTransitionTo(TimerState.RUNNING)) return;
    if (this.activeContext) {
      this.activeContext.startTime = Date.now() - this.activeContext.elapsed;
    }
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

  getActiveNode(): TimerNode | null {
    return this.activeContext?.node ?? null;
  }

  getRemainingMs(node: TimerNode): number {
    if (this.activeContext?.node !== node) {
      return node.config.durationMs ?? 0;
    }

    const duration = node.config.durationMs ?? 0;
    return Math.max(duration - this.activeContext.elapsed, 0);
  }

  private startNext(): void {
    const next = this.sequence[this.activeIndex];
    if (!next) {
      this.transition(TimerState.COMPLETED);
      return;
    }

    this.intervalTrackers.clear();

    this.activeContext = {
      node: next,
      startTime: Date.now(),
      elapsed: 0,
    };
  }

  private loop(): void {
    if (this.runtimeState !== TimerState.RUNNING) return;
    if (!this.activeContext) return;

    const now = Date.now();
    const ctx = this.activeContext;

    ctx.elapsed = now - ctx.startTime;
    const duration = ctx.node.config.durationMs ?? 0;

    this.handleIntervals(ctx);

    if (ctx.elapsed >= duration) {
      this.playAlarm();
      this.activeIndex++;
      this.startNext();
    }

    requestAnimationFrame(() => this.loop());
  }

  private handleIntervals(ctx: ActiveContext): void {
    ctx.node.getExecutableChildren().forEach(child => {
      const interval = child.config.intervalMs;
      if (!interval) return;

      const last = this.intervalTrackers.get(child) ?? 0;

      if (ctx.elapsed - last >= interval) {
        this.playBeep();
        this.intervalTrackers.set(child, ctx.elapsed);
      }
    });
  }

  private playAlarm(): void {
    this.playBeep();
  }

  private playBeep(): void {
    try {
      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.value = 0.2;

      oscillator.connect(gain);
      gain.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch {
      console.log('BEEP');
    }
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
