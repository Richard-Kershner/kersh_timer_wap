/*
===============================================================================
FILE: src/services/AudioManager.ts

Step 13 — Clean Centralized Audio Manager

Responsibilities:
• Handles all alarm playback
• Supports "none" (silent alarms)
• Prevents overlapping audio
• Centralizes sound path resolution
===============================================================================
*/

class AudioManager {
  private current?: HTMLAudioElement;

  play(sound?: string | 'none') {
    /* No sound selected */
    if (!sound || sound === 'none') return;

    /* Stop previous sound */
    this.stop();

    const src = this.resolveSoundPath(sound);

    const audio = new Audio(src);

    audio.play().catch(() => {});

    this.current = audio;
  }

  stop() {
    if (this.current) {
      this.current.pause();
      this.current.currentTime = 0;
      this.current = undefined;
    }
  }

  private resolveSoundPath(sound: string) {
    /* Built-in sounds */

    if (!sound.startsWith('blob:') && !sound.startsWith('http')) {
      return `/sounds/${sound}`;
    }

    /* Imported sounds later */

    return sound;
  }
}

export const audioManager = new AudioManager();
