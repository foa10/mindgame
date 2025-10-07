import React from 'react';
import { GameStats } from '../types';

interface StatsDisplayProps {
    stats: GameStats;
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-center shadow-lg w-32">
        <p className="text-2xl font-bold text-white">{value}</p>
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{label}</span>
    </div>
);


const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
    const { puzzlesAttempted, puzzlesSolved, highScore } = stats;

    const winRate = puzzlesAttempted > 0 
        ? Math.round((puzzlesSolved / puzzlesAttempted) * 100)
        : 0;
    
    if (puzzlesAttempted === 0) {
        return null; // Don't show stats until the first puzzle is attempted
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-4">
            <StatItem label="Attempted" value={puzzlesAttempted} />
            <StatItem label="Solved" value={puzzlesSolved} />
            <StatItem label="Win Rate" value={`${winRate}%`} />
            <StatItem label="High Score" value={highScore} />
        </div>
    );
};

export default StatsDisplay;
