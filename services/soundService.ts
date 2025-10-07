
import sounds from '../assets/sounds';

class SoundService {
  private audio: HTMLAudioElement;
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
        this.audio = new Audio();
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  play(soundName: keyof typeof sounds) {
    if (!this.isEnabled || !this.audio) return;
    
    // Set a short timeout to allow the browser to process the user interaction,
    // which can help prevent audio playback issues.
    setTimeout(() => {
        this.audio.src = sounds[soundName];
        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Autoplay was prevented.
                console.warn("Sound playback was prevented by the browser:", error);
            });
        }
    }, 50);
  }
}

// Export a singleton instance
export const soundService = new SoundService();
