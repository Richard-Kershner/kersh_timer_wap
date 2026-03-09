/*
===============================================================================
AudioManager
Supports overlapping alarm playback.
===============================================================================
*/

class AudioManager {
  private active: HTMLAudioElement[] = [];

  play(soundFile?: string) {
    if (!soundFile || soundFile === 'none') return;

    const audio = new Audio(`/sounds/${soundFile}`);

    audio.addEventListener('ended', () => {
      this.active = this.active.filter((a) => a !== audio);
    });

    audio.play().catch(() => {});

    this.active.push(audio);
  }

  stopAll() {
    for (const a of this.active) {
      a.pause();
      a.currentTime = 0;
    }

    this.active = [];
  }
}

export const audioManager = new AudioManager();
