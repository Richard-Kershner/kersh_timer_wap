import { TimerGraph } from './TimerGraph';
import { TimerNode } from './TimerNode';
import { audioManager } from '../services/AudioManager';

export class TimerScheduler {
  graph: TimerGraph;
  activeNodes: Set<TimerNode> = new Set();

  interval?: number;

  constructor(graph: TimerGraph) {
    this.graph = graph;
  }

  start() {
    this.activeNodes.clear();

    const root = this.graph.root;

    this.activateNode(root);

    this.interval = window.setInterval(() => this.tick(), 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    audioManager.stopAll();
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

    /* play alarm */

    const sound = this.resolveSound(node);

    if (sound) {
      audioManager.play(sound);
    }


    /* start sequential child */

    if (node.sequentialChild) {
      this.activateNode(node.sequentialChild);
    }
  }

  getRemainingMap(): Map<string, number> {
    const map = new Map<string, number>();

    this.graph.collectAllNodes().forEach((n) => {
      map.set(n.id, n.remainingMs);
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

