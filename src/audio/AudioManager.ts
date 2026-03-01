class AudioManager {
  private current?: HTMLAudioElement;

  play(soundFile: string) {
    if (!soundFile) return;

    if (this.current) {
      this.current.pause();
      this.current = undefined;
    }

    const audio = new Audio(`/sounds/${soundFile}`);
    audio.play().catch(() => {});
    this.current = audio;
  }

  stop() {
    if (this.current) {
      this.current.pause();
      this.current = undefined;
    }
  }
}

export const audioManager = new AudioManager();
