import React from 'react';
import { useTimerEngine } from '../hooks/useTimerEngine';
import { TimerState } from '../models/TimerTypes';

export type VisualSkin = 'DIGITAL' | 'LINEAR' | 'RADIAL';

interface Props {
  skin: VisualSkin;
}

export const TimerVisualizer: React.FC<Props> = ({ skin }) => {
  const { runtimeState, progress } = useTimerEngine();

  const percent = Math.floor(progress * 100);

  if (skin === 'DIGITAL') {
    return <div style={{ fontSize: '3rem' }}>{percent}%</div>;
  }

  if (skin === 'LINEAR') {
    return (
      <div style={{ width: 400 }}>
        <div style={{ height: 20, background: '#ddd' }}>
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              background: '#4caf50',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    );
  }

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
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
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
      />
    </svg>
  );
};
