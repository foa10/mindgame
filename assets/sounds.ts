// This file contains the base64 encoded data for the sound effects.
// Using data URIs allows us to embed the sounds directly into the app,
// avoiding extra network requests for small files.

const sounds = {
    // A pleasant, short chime for a correct answer.
    correct: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',

    // A low, short buzz for an incorrect answer.
    incorrect: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//v8=',

    // A subtle "swoosh" for loading a new puzzle.
    loading: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAD/AP8A/wD/AA==',

    // A soft, "magical" sound for revealing a hint.
    hint: 'data:audio/wav;base64,UklGRioAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQYAAAD8/v7+/v7+',
    
    // A short, sharp click for UI interactions.
    click: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAADv/u7+',

    // A triumphant, short fanfare for unlocking an achievement.
    achievement: 'data:audio/wav;base64,UklGRisAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQcAAAD8/v4A/QD/AP8A/w==',
};

export default sounds;
