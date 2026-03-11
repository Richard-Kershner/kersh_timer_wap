import { useState, useEffect } from 'react';

interface Props {
  ms: number;
  onChange: (ms: number) => void;
}

export function DurationEditor({ ms, onChange }: Props) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const total = Math.floor(ms / 1000);

    setHours(Math.floor(total / 3600));
    setMinutes(Math.floor((total % 3600) / 60));
    setSeconds(total % 60);
  }, [ms]);

  function update(h: number, m: number, s: number) {
    const totalMs = (h * 3600 + m * 60 + s) * 1000;

    onChange(totalMs);
  }

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <input
        style={{ width: '3ch', textAlign: 'center' }}
        type="number"
        value={hours}
        onChange={(e) => {
          const v = Number(e.target.value);
          setHours(v);
          update(v, minutes, seconds);
        }}
      />

      <span>:</span>

      <input
        style={{ width: '3ch', textAlign: 'center' }}
        type="number"
        value={minutes}
        onChange={(e) => {
          const v = Number(e.target.value);
          setMinutes(v);
          update(hours, v, seconds);
        }}
      />

      <span>:</span>

      <input
        style={{ width: '3ch', textAlign: 'center' }}
        type="number"
        value={seconds}
        onChange={(e) => {
          const v = Number(e.target.value);
          setSeconds(v);
          update(hours, minutes, v);
        }}
      />
    </div>
  );
}
