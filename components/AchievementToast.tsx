import React, { useState, useEffect } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
    achievement?: Achievement;
    onDone: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDone }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                // Wait for fade-out animation to finish before calling onDone
                setTimeout(onDone, 500); 
            }, 4000); // Display for 4 seconds

            return () => clearTimeout(timer);
        }
    }, [achievement, onDone]);

    if (!achievement) {
        return null;
    }

    return (
        <div
            className={`fixed top-5 right-5 w-80 bg-slate-800 border border-purple-500 rounded-xl shadow-2xl p-4 flex items-center gap-4 transition-all duration-500 ease-in-out z-50
                ${visible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}
            role="alert"
            aria-live="assertive"
        >
            <div className="text-4xl">{achievement.icon}</div>
            <div>
                <h3 className="font-bold text-white">Achievement Unlocked!</h3>
                <p className="text-sm text-slate-300">{achievement.name}</p>
            </div>
        </div>
    );
};

export default AchievementToast;
