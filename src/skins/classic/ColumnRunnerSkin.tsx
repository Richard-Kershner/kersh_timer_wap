/*
===============================================================================
FILE: src/skins/classic/ColumnRunnerSkin.tsx

Column-aligned runtime timer skin

Responsibilities
• Render timer nodes in column grid
• Display name + remaining time
• Show timers before start using duration fallback
• Support parallel timers via TimerColumnGrid
===============================================================================
*/

import React from 'react';
import { TimerSkin } from '../TimerSkin';
import { TimerColumnGrid } from './TimerColumnGrid';
import { TimerNodeConfig } from '../../models/TimerTypes';
import { formatHMS } from '../../utils/timeUtils';
import { resolveSkin } from '../../viewmodels/TimerViewModel';

interface RunnerProps {
  root: TimerNodeConfig;
  remaining: Map<string, number>;
}

export const ColumnRunnerSkin: TimerSkin = {
  renderRunner(root: TimerNodeConfig, remaining: Map<string, number>) {
    return (
      <div style={{ width: '100%' }}>
        {/* Alarm Name */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          {root.name}
        </div>

        <TimerColumnGrid
          root={root}
          renderNode={(node: TimerNodeConfig) => {
            const remainingTime =
              remaining.get(node.id) ?? node.durationMs ?? 0;

            const skin = resolveSkin(node);

            return (
              <div
                style={{
                  border: '1px solid #aaa',
                  borderRadius: 6,
                  padding: 10,
                  textAlign: 'center',
                  background: '#f5f5f5',
                  minWidth: 120,
                }}
              >
                {/* Node Name */}
                <div
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 6,
                  }}
                >
                  {node.name}
                </div>

                {/* Timer Display */}
                <div
                  style={{
                    fontSize: 20,
                    fontFamily: 'monospace',
                  }}
                >
                  {formatHMS(remainingTime)}
                </div>

                {/* Skin indicator (diagnostic / future use) */}
                {skin && skin !== 'NONE' && (
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 4,
                      opacity: 0.6,
                    }}
                  >
                    skin: {skin}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    );
  },

  renderEditor() {
    throw new Error('Editor not implemented in runner skin');
  },
};
