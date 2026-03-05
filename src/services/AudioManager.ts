class AudioManager {
  private current?: HTMLAudioElement;

  play(sound?: string | 'none') {
    if (!sound || sound === 'none') return;

    this.stop();

    const audio = new Audio(`/sounds/${sound}`);
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
}

export const audioManager = new AudioManager();
