import { TimerNode } from './TimerNode';
import { TimerNodeConfig } from '../models/TimerTypes';

export class TimerGraph {
  root: TimerNode;

  constructor(config: TimerNodeConfig) {
    this.root = new TimerNode(config);
  }

  collectAllNodes(): TimerNode[] {
    const nodes: TimerNode[] = [];

    function traverse(node: TimerNode) {
      nodes.push(node);

      node.sequentialChild && traverse(node.sequentialChild);

      node.parallelSiblings.forEach((p) => traverse(p));
    }

    traverse(this.root);

    return nodes;
  }
}
