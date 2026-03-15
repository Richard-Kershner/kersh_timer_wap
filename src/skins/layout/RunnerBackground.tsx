export function CircleAlarmSkin(remainingMs: number, durationMs: number) {
  const percent = durationMs === 0 ? 0 : remainingMs / durationMs;

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent);

  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 10, fontSize: 24 }}>{seconds}s</div>

      <svg width="150" height="150">
        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke="#ddd"
          strokeWidth="10"
          fill="none"
        />

        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke="gold"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 75 75)"
        />
      </svg>
    </div>
  );
}
