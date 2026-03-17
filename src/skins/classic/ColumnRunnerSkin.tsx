/*
===============================================================================
FILE: src/skins/classic/ColumnRunnerSkin.tsx
===============================================================================
*/

import React from 'react';
import { TimerSkin } from '../TimerSkin';
import { TimerColumnGrid } from './TimerColumnGrid';
import { TimerNodeConfig } from '../../models/TimerTypes';
import { formatHMS } from '../../utils/timeUtils';
import { resolveSkin } from '../../viewmodels/TimerViewModel';

export const ColumnRunnerSkin: TimerSkin = {

  renderRunner(root: TimerNodeConfig, remaining: Map<string, number>) {

    return (

      <div style={{ width: '100%' }}>

        {/* root title */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 16,
            textAlign: 'center'
          }}
        >
          {root.name}
        </div>

        <TimerColumnGrid
          root={root}

          renderNode={(node: TimerNodeConfig) => {

            // fallback to duration before engine starts
            const time =
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
                  minWidth: 120
                }}
              >

                {/* node name */}
                <div style={{ fontWeight: 'bold', marginBottom: 6 }}>
                  {node.name}
                </div>

                {/* time */}
                <div style={{ fontSize: 20, fontFamily: 'monospace' }}>
                  {formatHMS(time)}
                </div>

                {/* debug skin */}
                {skin && skin !== 'NONE' && (
                  <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>
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
    throw new Error('ColumnRunnerSkin does not implement editor rendering');
  }

};