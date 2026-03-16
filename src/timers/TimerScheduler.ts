import { TimerGraph } from './TimerGraph';
import { TimerNode } from './TimerNode';
import { TimerNodeConfig } from '../models/TimerTypes';
import { audioManager } from '../audio/AudioManager';

export class TimerScheduler {
  graph: TimerGraph;

  activeNodes: Set<TimerNode> = new Set();

  interval?: number;

  constructor(rootConfig: TimerNodeConfig) {
    this.graph = new TimerGraph(rootConfig);

    /* initialize remaining times immediately */

    this.graph.collectAllNodes().forEach((node) => {
      node.remainingMs = node.durationMs;
    });
  }

  start() {
    this.activeNodes.clear();

    const root = this.graph.root;

    this.activateNode(root);

    if (!this.interval) {
      this.interval = window.setInterval(() => this.tick(), 1000);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    audioManager.stopAll();
  }

  reset() {
    this.stop();

    this.graph.collectAllNodes().forEach((node) => {
      node.remainingMs = node.durationMs;
    });

    this.activeNodes.clear();
  }

  isComplete(): boolean {
    return this.activeNodes.size === 0;
  }

  private activateNode(node: TimerNode) {
    this.activeNodes.add(node);

    node.parallelSiblings.forEach((p) => {
      this.activeNodes.add(p);
    });
  }

  private tick() {
    const finished: TimerNode[] = [];

    this.activeNodes.forEach((node) => {
      if (node.remainingMs <= 0) return;

      node.remainingMs -= 1000;

      if (node.remainingMs <= 0) {
        finished.push(node);
      }
    });

    finished.forEach((node) => this.completeNode(node));
  }

  private completeNode(node: TimerNode) {
    this.activeNodes.delete(node);

    const sound = this.resolveSound(node);

    if (sound) {
      audioManager.play(sound);
    }

    if (node.sequentialChild) {
      this.activateNode(node.sequentialChild);
    }
  }

  getRemainingMap(): Map<string, number> {
    const map = new Map<string, number>();

    this.graph.collectAllNodes().forEach((node) => {
      map.set(node.id, node.remainingMs);
    });

    return map;
  }

  private resolveSound(node: TimerNode): string | undefined {
    let current: TimerNode | undefined = node;

    while (current) {
      if (!current.inheritSound && current.sound) {
        return current.sound;
      }

      current = current.parent;
    }

    return undefined;
  }
}
