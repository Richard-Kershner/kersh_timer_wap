/*
File: TimerVisualizer.tsx

Final Intended Purpose:
- Presentation-only visualization layer for timer runtime.
- Renders digital, linear, or radial views.
- Reacts to engine runtime state only.
- Does NOT mutate engine or trigger transitions.

Explicit Responsibilities:
- Read runtimeState from useTimerEngine.
- Render visual representation.
- Accept selected skin mode.
- Remain strictly UI-only.

Connected Files:
- useTimerEngine.ts
- TimerTypes.ts
- SkinSelector.tsx

Shared Data Models:
- TimerState

Development Steps:
- Step 8: Visualization layer (COMPLETE — 2026-02-16)

Change Log:
- 2026-02-16
  - Created digital, linear, radial visualization modes.
  - Connected to runtimeState.
  - Confirmed no engine mutation.
*/

import React from 'react';
import { useTimerEngine } from '../hooks/useTimerEngine';
import { TimerState } from '../models/TimerTypes';

export type VisualSkin = 'DIGITAL' | 'LINEAR' | 'RADIAL';

interface Props {
  skin: VisualSkin;
}

export const TimerVisualizer: React.FC<Props> = ({ skin }) => {
  const { runtimeState } = useTimerEngine();

  const renderStateLabel = () => {
    switch (runtimeState) {
      case TimerState.IDLE:
        return 'Idle';
      case TimerState.RUNNING:
        return 'Running';
      case TimerState.PAUSED:
        return 'Paused';
      case TimerState.COMPLETED:
        return 'Completed';
      default:
        return '';
    }
  };

  const renderDigital = () => (
    <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
      {renderStateLabel()}
    </div>
  );

  const renderLinear = () => (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div
        style={{
          height: 20,
          background: '#ddd',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width:
              runtimeState === TimerState.RUNNING
                ? '75%'
                : runtimeState === TimerState.COMPLETED
                  ? '100%'
                  : '0%',
            background: '#4caf50',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div style={{ marginTop: 8 }}>{renderStateLabel()}</div>
    </div>
  );

  const renderRadial = () => {
    const percent =
      runtimeState === TimerState.RUNNING
        ? 0.75
        : runtimeState === TimerState.COMPLETED
          ? 1
          : 0;

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeOffset = circumference * (1 - percent);

    return (
      <div style={{ textAlign: 'center' }}>
        <svg width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#ddd"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#2196f3"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div style={{ marginTop: 8 }}>{renderStateLabel()}</div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: 24 }}>
      {skin === 'DIGITAL' && renderDigital()}
      {skin === 'LINEAR' && renderLinear()}
      {skin === 'RADIAL' && renderRadial()}
    </div>
  );
};
