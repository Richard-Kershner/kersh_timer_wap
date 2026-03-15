import { TimerNodeConfig } from '../models/TimerTypes';

export class TimerNode {
  id: string;
  name: string;
  durationMs: number;
  remainingMs: number;

  parent?: TimerNode;

  sequentialChild?: TimerNode;
  parallelSiblings: TimerNode[] = [];

  inheritSound?: boolean;
  sound?: string;

  constructor(config: TimerNodeConfig, parent?: TimerNode) {
    this.id = config.id;
    this.name = config.name;
    this.durationMs = config.durationMs ?? 0;
    this.remainingMs = this.durationMs;

    this.parent = parent;

    this.inheritSound = config.inheritSound;
    this.sound = config.sound;

    if (config.sequentialChild) {
      this.sequentialChild = new TimerNode(config.sequentialChild, this);
    }

    if (config.parallelSiblings) {
      this.parallelSiblings = config.parallelSiblings.map(
        (p) => new TimerNode(p, this),
      );
    }
  }

  reset() {
    this.remainingMs = this.durationMs;
    this.sequentialChild?.reset();
    this.parallelSiblings.forEach((p) => p.reset());
  }
}
