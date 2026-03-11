/*
===============================================================================
Column-aligned runtime timer skin
===============================================================================
*/

import { TimerSkin } from '../TimerSkin';
import { TimerColumnGrid } from './TimerColumnGrid';
import { TimerNodeConfig } from '../../models/TimerTypes';
import { formatHMS } from '../../utils/timeUtils';

export const ColumnRunnerSkin: TimerSkin = {
  renderRunner(root, remaining) {
    return (
      <TimerColumnGrid
        root={root}
        renderNode={(node: TimerNodeConfig) => {
          const time = remaining.get(node.id) ?? node.durationMs ?? 0;

          return (
            <div
              style={{
                border: '1px solid #aaa',
                padding: 10,
                textAlign: 'center',
                background: '#f5f5f5',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{node.name}</div>

              <div style={{ fontSize: 18 }}>{formatHMS(time)}</div>
            </div>
          );
        }}
      />
    );
  },

  renderEditor() {
    throw new Error('Editor not implemented here');
  },
};
