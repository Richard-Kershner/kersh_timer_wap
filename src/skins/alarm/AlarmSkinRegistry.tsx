import { AlarmSkinType } from '../../models/TimerTypes';
import { CircleAlarmSkin } from './CircleAlarmSkin';
import { NoneAlarmSkin } from './NoneAlarmSkin';

export const AlarmSkinRegistry: Record<
  AlarmSkinType,
  (remainingMs: number, durationMs: number) => React.ReactElement | null
> = {
  NONE: () => NoneAlarmSkin(),
  CIRCLE: (remainingMs, durationMs) => CircleAlarmSkin(remainingMs, durationMs),
};
