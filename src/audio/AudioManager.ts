/*
File: AudioManager.ts

Final Intended Purpose:
- Central coordinator for all audio playback within Kersh Timer.
- Manages alarms, background loops, and overlapping sounds without UI awareness.

Explicit Responsibilities:
- Accept high-level audio play/stop requests from TimerScheduler or AudioService.
- Coordinate multiple simultaneous audio channels.
- Enforce audio lifecycle rules defined in TimerTypes audio bindings.

Connected Files:
- TimerScheduler.ts (invokes alarm/background triggers)
- AudioService.ts (delegates platform-specific playback)
- SoundLibrary.ts (resolves sound identifiers to assets)

Shared Data Models:
- TimerAudioConfig (read-only)
- AudioChannelType (read-only)

Naming Conventions Enforced:
- Manager classes expose imperative verbs (play*, stop*).
- No direct DOM or Capacitor references in this file.
- Audio channels are identified by AudioChannelType enum only.

Development Steps:
- Step 1: Playback interface scaffold (COMPLETE — 2026-02-03)
- Step 2: Overlapping audio coordination (COMPLETE — 2026-02-03)
- Step 3: Background audio lifecycle handling (IN PROGRESS)
- Step 4: Native bridge integration (PLANNED)

Change Log:
- Step 1 completed on 2026-02-03
- Step 2 completed on 2026-02-03
*/

import { TimerAudioConfig, AudioChannelType } from '../models/TimerTypes';
import { AudioService } from '../services/AudioService';
import { SoundLibrary } from './SoundLibrary';

export class AudioManager {
  /**
   * Active audio channels keyed by channel type.
   * Step 2: supports overlapping sounds by channel separation.
   */
  private activeChannels: Map<AudioChannelType, string[]> = new Map();

  constructor(
    private readonly audioService: AudioService,
    private readonly soundLibrary: SoundLibrary,
  ) {}

  /**
   * Plays an alarm sound associated with a timer.
   * Step 1: interface
   * Step 2: overlapping alarms allowed
   */
  playAlarm(config: TimerAudioConfig): void {
    // Step 2: resolve asset
    if (!config.alarmSoundId) return;

    const soundAsset = this.soundLibrary.resolve(config.alarmSoundId);


    // Step 3: placeholder for real playback
    // Activation deferred until AudioService Step 3 completion
    this.audioService.play(soundAsset, AudioChannelType.ALARM);

    this.registerActive(AudioChannelType.ALARM, soundAsset);
  }

  /**
   * Starts background audio for a running timer.
   * Step 3: background lifecycle control
   */
  startBackground(config: TimerAudioConfig): void {
    if (!config.backgroundSoundId) return;

    const soundAsset = this.soundLibrary.resolve(config.backgroundSoundId);

    this.audioService.playLoop(soundAsset, AudioChannelType.BACKGROUND);
    this.registerActive(AudioChannelType.BACKGROUND, soundAsset);
  }

  /**
   * Stops all audio associated with a completed or stopped timer.
   * Step 3: lifecycle cleanup
   */
  stopAll(): void {
    // Step 3: iterate all channels
    for (const channel of this.activeChannels.keys()) {
      this.audioService.stopChannel(channel);
    }

    this.activeChannels.clear();
  }

  /**
   * Internal registry helper.
   * Step 2: overlapping tracking
   */
  private registerActive(channel: AudioChannelType, assetId: string): void {
    const existing = this.activeChannels.get(channel) ?? [];
    existing.push(assetId);
    this.activeChannels.set(channel, existing);
  }
}
