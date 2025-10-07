
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PuzzleCardProps {
    puzzleText?: string;
    isLoading: boolean;
}

const PuzzleCard: React.FC<PuzzleCardProps> = ({ puzzleText, isLoading }) => {
    return (
        <div className="min-h-[150px] bg-slate-900/70 p-6 rounded-lg flex items-center justify-center text-center border border-slate-700 mb-6">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-300 italic">
                    "{puzzleText}"
                </p>
            )}
        </div>
    );
};

export default PuzzleCard;
