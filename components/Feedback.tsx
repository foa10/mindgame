import React from 'react';

interface FeedbackProps {
    message: string;
    isCorrect: boolean | null;
}

const Feedback: React.FC<FeedbackProps> = ({ message, isCorrect }) => {
    const baseClasses = 'font-semibold transition-all duration-300 ease-in-out';
    
    const colorClass = isCorrect === true 
        ? 'text-green-400' 
        : isCorrect === false 
        ? 'text-red-400' 
        : 'text-slate-400';

    // Apply animation classes based on whether a message exists.
    // This creates a fade-in and scale-up effect.
    const animationClasses = message
        ? 'opacity-100 transform scale-100'
        : 'opacity-0 transform scale-95';

    return (
        // This outer div reserves space and centers the feedback message,
        // ensuring no layout shift when the message appears or disappears.
        <div className="h-6 mt-4 flex items-center justify-center">
            <p className={`${baseClasses} ${colorClass} ${animationClasses}`}>
                {message}
            </p>
        </div>
    );
};

export default Feedback;
