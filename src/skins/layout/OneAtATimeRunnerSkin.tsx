import { TimerNodeConfig } from '../../models/TimerTypes';
import { AlarmSkinRegistry } from '../alarm/AlarmSkinRegistry';

function findActiveNode(
  node: TimerNodeConfig,
  remaining: Map<string, number>,
): TimerNodeConfig | undefined {
  const remainingMs = remaining.get(node.id);

  if (remainingMs !== undefined && remainingMs > 0) {
    return node;
  }

  if (node.sequentialChild) {
    return findActiveNode(node.sequentialChild, remaining);
  }

  return undefined;
}

export const OneAtATimeRunnerSkin = {
  renderRunner(root: TimerNodeConfig, remaining: Map<string, number>) {
    const active = findActiveNode(root, remaining);

    if (!active) return null;

    const remainingMs = remaining.get(active.id) ?? 0;

    const durationMs = active.durationMs;

    const skinType = active.skin ?? 'CIRCLE';

    const Skin = AlarmSkinRegistry[skinType];

    return <div style={{ padding: 40 }}>{Skin(remainingMs, durationMs)}</div>;
  },
};
