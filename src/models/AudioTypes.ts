/*
File: AudioTypes.ts

Purpose:
- Defines audio configuration and playback models.

Connected Files:
- audio/AudioManager.ts
- audio/SoundLibrary.ts

Shared Data:
- AudioConfig
- SoundRef

Development Steps:
- Step 1: Base interfaces
- Step 2: Playback flags
- Step 3: Platform extensions

Change Log:
- Step 1 completed on 2026-02-03
*/

export interface SoundRef {
  id: string;
  uri: string;
}

export interface AudioConfig {
  alarmSound?: SoundRef;
  backgroundSound?: SoundRef;
  loopBackground?: boolean;
}
