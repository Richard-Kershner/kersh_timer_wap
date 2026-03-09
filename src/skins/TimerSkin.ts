/*
===============================================================================
FILE: src/skins/TimerSkin.ts
Skin interface for timer rendering.
===============================================================================
*/

import type { ReactElement } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';

export interface TimerSkin {
  renderNode(node: TimerNodeConfig, remainingMs: number): ReactElement;
}
