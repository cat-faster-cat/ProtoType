class BgmService {
  private audio: HTMLAudioElement | null = null;
  private static instance: BgmService;

  private constructor() {}

  public static getInstance(): BgmService {
    if (!BgmService.instance) {
      BgmService.instance = new BgmService();
    }
    return BgmService.instance;
  }

  enablePlayback(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.audio && !this.audio.paused) {
        resolve();
        return;
      }
      // Play a short, silent audio clip to unlock audio playback on the browser.
      const unlockAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      unlockAudio.volume = 0;
      unlockAudio.play()
        .then(() => {
          console.log("Audio playback enabled.");
          resolve();
        })
        .catch((error: unknown) => {
          console.error("Failed to enable audio playback:", error);
          reject(error);
        });
    });
  }

  playPersistent(src: string, volume: number = 1.0, loop: boolean = true) {
    if (this.audio && this.audio.src.includes(src)) {
        if(this.audio.paused) {
            this.audio.play().catch(e => console.error("BGMの再生に失敗しました:", e));
        }
        return;
    }

    if (this.audio) {
      this.audio.pause();
    }

    this.audio = new Audio(src);
    this.audio.loop = loop;
    this.audio.volume = volume;
    this.audio.play().catch((e: unknown) => {
      console.error(`Failed to play ${src}:`, e);
    });
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}

export const bgmService = BgmService.getInstance();
