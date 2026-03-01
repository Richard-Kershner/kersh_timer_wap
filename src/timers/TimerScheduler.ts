import { TimerNodeConfig, TimerStatus } from '../models/TimerTypes';
import { audioManager } from '../audio/AudioManager';

interface RuntimeState {
  remainingMs: number;
  status: TimerStatus;
  effectiveSound?: string;
  parent?: RuntimeState;
  config: TimerNodeConfig;
}

export class TimerScheduler {
  private active = new Map<string, RuntimeState>();
  private root?: TimerNodeConfig;
  private interval?: number;
  private onUpdate?: () => void;

  constructor(onUpdate?: () => void) {
    this.onUpdate = onUpdate;
  }

  /* =========================
     PUBLIC API
     ========================= */

  start(root: TimerNodeConfig) {
    this.stop();
    this.root = root;
    this.activateNode(root, undefined, root.sound);
    this.interval = window.setInterval(() => this.tick(), 50);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    this.active.clear();
    audioManager.stop();
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  resume() {
    if (!this.interval) {
      this.interval = window.setInterval(() => this.tick(), 50);
    }
  }

  reset() {
    this.stop();
    if (this.root) {
      this.start(this.root);
    }
  }

  getActiveStates() {
    return this.active;
  }

  getRuntimeState() {
    return this.active;
  }

  /* =========================
     INTERNAL ENGINE
     ========================= */

  private activateNode(
    config: TimerNodeConfig,
    parent?: RuntimeState,
    inheritedSound?: string,
  ) {
    const effectiveSound =
      config.inheritSound === false ? config.sound : inheritedSound;

    const state: RuntimeState = {
      remainingMs: config.durationMs,
      status: 'RUNNING',
      effectiveSound,
      parent,
      config,
    };

    this.active.set(config.id, state);

    // Start parallel siblings immediately
    if (config.parallelSiblings) {
      for (const sibling of config.parallelSiblings) {
        this.activateNode(sibling, state, effectiveSound);
      }
    }

    // Duration 0 triggers instantly
    if (config.durationMs === 0) {
      this.completeNode(state);
    }
  }

  private tick() {
    const completed: RuntimeState[] = [];

    for (const state of this.active.values()) {
      if (state.status !== 'RUNNING') continue;

      state.remainingMs -= 50;

      if (state.remainingMs <= 0) {
        completed.push(state);
      }
    }

    for (const state of completed) {
      this.completeNode(state);
    }

    this.onUpdate?.();
  }

  private completeNode(state: RuntimeState) {
    if (state.status !== 'RUNNING') return;

    state.status = 'COMPLETE';

    if (state.effectiveSound) {
      audioManager.play(state.effectiveSound);
    }

    // Stop parallel siblings immediately
    if (state.parent) {
      const siblings = state.parent.config.parallelSiblings;
      if (siblings) {
        for (const sibling of siblings) {
          if (sibling.id !== state.config.id) {
            this.forceStop(sibling.id);
          }
        }
      }
    }

    // Remove completed node from active set
    this.active.delete(state.config.id);

    // Start sequential child
    if (state.config.sequentialChild) {
      this.activateNode(
        state.config.sequentialChild,
        state,
        state.effectiveSound,
      );
    }
  }

  private forceStop(id: string) {
    const state = this.active.get(id);
    if (!state) return;

    state.status = 'STOPPED';
    this.active.delete(id);

    // Stop sequential subtree
    if (state.config.sequentialChild) {
      this.forceStop(state.config.sequentialChild.id);
    }

    // Stop parallel subtree
    if (state.config.parallelSiblings) {
      for (const s of state.config.parallelSiblings) {
        this.forceStop(s.id);
      }
    }
  }
}
