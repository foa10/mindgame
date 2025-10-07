import { Achievement, GameStats } from "../types";

// Defines all available achievements in the game.
export const allAchievements: Achievement[] = [
    {
        id: 'FIRST_SOLVE',
        name: 'Novice Riddler',
        description: 'You solved your very first puzzle!',
        icon: '🔰',
    },
    {
        id: 'TEN_SOLVED',
        name: 'Brainiac',
        description: 'You\'ve solved 10 puzzles. Impressive!',
        icon: '🧠',
    },
    {
        id: 'HUNDRED_SOLVED',
        name: 'Master Riddler',
        description: 'You\'ve conquered 100 puzzles. A true legend!',
        icon: '🏆',
    },
    {
        id: 'STREAK_FIVE',
        name: 'On a Roll!',
        description: 'You solved 5 puzzles in a row.',
        icon: '🔥',
    },
    {
        id: 'NO_HINT_WIN',
        name: 'Sharp Mind',
        description: 'You solved a puzzle without using a hint.',
        icon: '💡',
    },
    {
        id: 'HIGH_SCORE_50',
        name: 'Score Keeper',
        description: 'You reached a score of 50!',
        icon: '⭐',
    }
];

// A map for quick lookup of achievement details by ID.
export const achievementsMap = new Map(allAchievements.map(a => [a.id, a]));

/**
 * Checks the current game state against the unlock conditions for all achievements.
 * @param stats - The player's current game statistics.
 * @param score - The player's current score.
 * @param hintTakenThisPuzzle - Whether a hint was used for the most recently solved puzzle.
 * @param unlockedIds - A Set containing the IDs of already unlocked achievements.
 * @returns An array of newly unlocked achievements.
 */
export const checkAchievements = (
    stats: GameStats,
    score: number,
    hintTakenThisPuzzle: boolean,
    unlockedIds: Set<string>
): Achievement[] => {
    const newlyUnlocked: Achievement[] = [];

    const check = (id: string, condition: boolean) => {
        if (!unlockedIds.has(id) && condition) {
            const achievement = achievementsMap.get(id);
            if (achievement) {
                newlyUnlocked.push(achievement);
            }
        }
    };

    // Check individual achievement conditions
    check('FIRST_SOLVE', stats.puzzlesSolved >= 1);
    check('TEN_SOLVED', stats.puzzlesSolved >= 10);
    check('HUNDRED_SOLVED', stats.puzzlesSolved >= 100);
    check('STREAK_FIVE', stats.winStreak >= 5);
    check('NO_HINT_WIN', !hintTakenThisPuzzle);
    check('HIGH_SCORE_50', score >= 50);

    return newlyUnlocked;
};
