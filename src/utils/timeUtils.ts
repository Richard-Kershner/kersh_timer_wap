/*
===============================================================================
FILE: src/utils/timeUtils.ts
Time conversion helpers
===============================================================================
*/

export function msToHMS(ms: number) {
  const total = Math.floor(ms / 1000);

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return { hours, minutes, seconds };
}

export function hmsToMs(h: number, m: number, s: number) {
  return (h * 3600 + m * 60 + s) * 1000;
}

export function formatHMS(ms: number) {
  const { hours, minutes, seconds } = msToHMS(ms);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
