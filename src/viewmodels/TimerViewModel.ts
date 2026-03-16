/*
===============================================================================
FILE: src/viewmodels/TimerViewModel.ts

Purpose
• Runtime view helpers
• Skin inheritance resolution
• Future UI helpers (active node state, formatting, etc.)
===============================================================================
*/

import { TimerNodeConfig, AlarmSkinType } from '../models/TimerTypes';

export function resolveSkin(
  node: TimerNodeConfig,
  parentSkin?: AlarmSkinType,
): AlarmSkinType | undefined {
  if (!node.inheritSkin && node.skin) {
    return node.skin;
  }

  if (parentSkin) {
    return parentSkin;
  }

  return node.skin;
}
