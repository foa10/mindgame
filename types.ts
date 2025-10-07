export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'General' | 'Math' | 'Wordplay' | 'Riddle';

export interface Puzzle {
  puzzle: string;
  answer: string;
  hint: string;
}

export interface GameStats {
  puzzlesAttempted: number;
  puzzlesSolved: number;
  highScore: number;
  winStreak: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or SVG path
}
