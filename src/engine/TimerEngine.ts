import { TimerNode } from "../timers/TimerNode";
import { TimerNodeConfig } from "../models/TimerTypes";
import { audioManager } from "../audio/AudioManager";

export class TimerEngine {

  root: TimerNode;

  remaining: Map<string, number> = new Map();

  activeNodeIds: Set<string> = new Set();

  private interval?: number;

  constructor(rootConfig: TimerNodeConfig) {

    this.root = new TimerNode(rootConfig);

    this.initializeRemaining(this.root);

  }

  private initializeRemaining(node: TimerNode) {

    this.remaining.set(node.id, node.durationMs);

    if (node.sequentialChild) {
      this.initializeRemaining(node.sequentialChild);
    }

    node.parallelSiblings.forEach(p =>
      this.initializeRemaining(p)
    );

  }

  start() {

    this.computeActiveNodes();

    if (this.interval) return;

    this.interval = window.setInterval(() => {

      const nextActive = new Set<string>();

      this.activeNodeIds.forEach(id => {

        const remaining = this.remaining.get(id) ?? 0;

        if (remaining <= 0) return;

        const updated = remaining - 100;

        if (updated <= 0) {

          this.remaining.set(id, 0);

          audioManager.play();

          const node = this.findNode(this.root, id);

          if (!node) return;

          /* start sequential child */

          if (node.sequentialChild) {

            this.remaining.set(
              node.sequentialChild.id,
              node.sequentialChild.durationMs
            );

            nextActive.add(node.sequentialChild.id);

          }

          /* start parallel siblings */

          else if (node.parallelSiblings.length > 0) {

            node.parallelSiblings.forEach(p => {

              this.remaining.set(p.id, p.durationMs);

              nextActive.add(p.id);

            });

          }

        }

        else {

          this.remaining.set(id, updated);

          nextActive.add(id);

        }

      });

      this.activeNodeIds = nextActive;

      if (this.activeNodeIds.size === 0) {
        this.stop();
      }

    }, 100);

  }

  pause() {

    if (this.interval) {

      clearInterval(this.interval);

      this.interval = undefined;

    }

  }

  stop() {

    this.pause();

    audioManager.stopAll();

  }

  reset() {

    this.stop();

    this.remaining.clear();

    this.initializeRemaining(this.root);

    this.activeNodeIds.clear();

  }

  cancel() {

    this.reset();

  }

  private computeActiveNodes() {

    this.activeNodeIds.clear();

    this.activeNodeIds.add(this.root.id);

  }

  private findNode(node: TimerNode, id: string): TimerNode | undefined {

    if (node.id === id) return node;

    if (node.sequentialChild) {

      const result = this.findNode(node.sequentialChild, id);

      if (result) return result;

    }

    for (const p of node.parallelSiblings) {

      const result = this.findNode(p, id);

      if (result) return result;

    }

    return undefined;

  }

}