import React from 'react';
import { Difficulty } from '../types';

interface DifficultySelectorProps {
    currentDifficulty: Difficulty;
    onDifficultyChange: (difficulty: Difficulty) => void;
    disabled: boolean;
}

const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ currentDifficulty, onDifficultyChange, disabled }) => {
    
    const getButtonClass = (level: Difficulty) => {
        const base = 'px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 w-24';
        if (disabled) {
            return `${base} cursor-not-allowed bg-slate-700 text-slate-500`;
        }
        if (level === currentDifficulty) {
            return `${base} text-white shadow-lg ${
                level === 'Easy' ? 'bg-green-600 focus:ring-green-500' :
                level === 'Medium' ? 'bg-yellow-600 focus:ring-yellow-500' :
                'bg-red-600 focus:ring-red-500'
            }`;
        }
        return `${base} bg-slate-700 text-slate-300 hover:bg-slate-600`;
    };

    return (
        <div className="flex items-center justify-center gap-2 p-1 bg-slate-800/70 rounded-lg border border-slate-700">
            {difficulties.map((level) => (
                <button
                    key={level}
                    onClick={() => onDifficultyChange(level)}
                    className={getButtonClass(level)}
                    disabled={disabled || level === currentDifficulty}
                    aria-pressed={level === currentDifficulty}
                >
                    {level}
                </button>
            ))}
        </div>
    );
};

export default DifficultySelector;
