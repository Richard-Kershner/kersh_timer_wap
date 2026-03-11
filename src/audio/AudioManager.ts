/*
===============================================================================
FILE: src/services/AudioManager.ts

Step 15 — Multi-Channel Audio Manager

Responsibilities:
• Handles all alarm playback
• Supports overlapping sounds
• Supports "none" (silent alarms)
• Centralizes sound path resolution
• Allows global stop
===============================================================================
*/

class AudioManager {
  /* Active audio instances */
  private active: Set<HTMLAudioElement> = new Set();

  play(sound?: string | 'none') {
    /* No sound selected */
    if (!sound || sound === 'none') return;

    const src = this.resolveSoundPath(sound);

    const audio = new Audio(src);

    /* Track instance */
    this.active.add(audio);

    /* Remove when finished */
    audio.addEventListener('ended', () => {
      this.active.delete(audio);
    });

    audio.addEventListener('error', () => {
      this.active.delete(audio);
    });

    /* Start playback */
    audio.play().catch(() => {
      this.active.delete(audio);
    });
  }

  stopAll() {
    for (const audio of this.active) {
      audio.pause();
      audio.currentTime = 0;
    }

    this.active.clear();
  }

  stop() {
    this.stopAll();
  }

  private resolveSoundPath(sound: string): string {
    /* Built-in local sounds */

    if (
      !sound.startsWith('blob:') &&
      !sound.startsWith('http') &&
      !sound.startsWith('/')
    ) {
      return `/sounds/${sound}`;
    }

    /* Imported / user selected files */

    return sound;
  }
}

export const audioManager = new AudioManager();