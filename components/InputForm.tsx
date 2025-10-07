
import React from 'react';

interface InputFormProps {
    guess: string;
    onGuessChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    isPuzzleSolved: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ guess, onGuessChange, onSubmit, isSubmitting, isPuzzleSolved }) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
                type="text"
                value={guess}
                onChange={onGuessChange}
                placeholder="What's your answer?"
                disabled={isSubmitting || isPuzzleSolved}
                className="w-full flex-grow px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Your guess for the puzzle"
            />
            <button
                type="submit"
                disabled={isSubmitting || isPuzzleSolved || !guess.trim()}
                className="bg-purple-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                    </>
                ) : 'Submit Guess'}
            </button>
        </form>
    );
};

export default InputForm;
