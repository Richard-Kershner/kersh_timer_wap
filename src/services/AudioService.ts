/*
File: AudioService.ts

Final Intended Purpose:
- Abstracts platform-specific audio playback mechanisms.
- Serves as the only layer allowed to touch browser Audio or Capacitor plugins.

Explicit Responsibilities:
- Play one-shot sounds.
- Play looping background sounds.
- Stop sounds by logical audio channel.

Connected Files:
- AudioManager.ts (delegates all playback control)
- Capacitor native audio plugin (PLANNED)

Shared Data Models:
- AudioChannelType (read-only)

Naming Conventions Enforced:
- Service classes expose side-effectful operations only.
- No timer semantics or scheduling logic permitted.

Development Steps:
- Step 1: Interface scaffold (IN PROGRESS)
- Step 2: Web Audio implementation (PLANNED)
- Step 3: Capacitor native bridge (PLANNED)

Change Log:
- File created for Step 3 on 2026-02-06
*/

import { AudioChannelType } from '../models/TimerTypes';

export class AudioService {
  /**
   * Plays a one-shot sound.
   * Step 1: placeholder only
   */
  play(assetId: string, channel: AudioChannelType): void {
    // Step 1: no-op placeholder
    // Step 2: activate HTMLAudioElement or Web Audio API
    console.debug('[AudioService.play]', assetId, channel);
  }

  /**
   * Plays a looping sound.
   * Step 1: placeholder only
   */
  playLoop(assetId: string, channel: AudioChannelType): void {
    // Step 1: no-op placeholder
    console.debug('[AudioService.playLoop]', assetId, channel);
  }

  /**
   * Stops all sounds within a channel.
   * Step 1: placeholder only
   */
  stopChannel(channel: AudioChannelType): void {
    // Step 1: no-op placeholder
    console.debug('[AudioService.stopChannel]', channel);
  }
}
