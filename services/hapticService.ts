// This file contains a service for providing haptic feedback (vibrations)
// on devices that support the navigator.vibrate API.

// Defines distinct vibration patterns for different feedback types.
const patterns = {
    // A short, crisp vibration for a correct answer.
    success: [100],
    // Two short bursts for an incorrect answer.
    error: [75, 50, 75],
    // A slightly longer, single pulse for revealing a hint.
    hint: [200],
    // A very short, sharp tap for simple button clicks.
    click: [50],
};

type HapticPattern = keyof typeof patterns;

class HapticService {
    private isSupported: boolean = false;

    constructor() {
        // Check for browser support on instantiation.
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            this.isSupported = true;
        }
    }

    /**
     * Triggers a specific haptic feedback pattern if the device supports it.
     * @param pattern - The name of the feedback pattern to trigger.
     */
    trigger(pattern: HapticPattern) {
        if (this.isSupported) {
            try {
                // The Vibration API is often tied to system-level sound/vibration settings.
                // If a user's phone is on silent, this may not fire.
                navigator.vibrate(patterns[pattern]);
            } catch (error) {
                // This could happen in a restrictive iframe or other edge cases.
                console.warn("Haptic feedback failed to trigger:", error);
            }
        }
    }
}

// Export a singleton instance of the service so the check for support
// only happens once and the same instance is used throughout the app.
export const hapticService = new HapticService();
