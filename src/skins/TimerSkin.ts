/*
===============================================================================
FILE: src/skins/TimerSkin.ts
Defines pluggable skins for timer rendering.
===============================================================================
*/

import type { ReactElement } from 'react';
import { TimerNodeConfig } from '../models/TimerTypes';

export interface TimerSkin {
  /* Runtime view */
  renderRunner(
    root: TimerNodeConfig,
    remaining: Map<string, number>,
  ): ReactElement;

  /* Editor view */
  renderEditor(
    root: TimerNodeConfig,
    onChange: (node: TimerNodeConfig) => void,
  ): ReactElement;
}
