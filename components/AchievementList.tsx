import React from 'react';
import { Achievement } from '../types';
import { achievementsMap } from '../services/achievementService';

interface AchievementListProps {
    unlockedIds: string[];
    allAchievements: Achievement[]; // Pass all achievements to maintain order
}

const AchievementList: React.FC<AchievementListProps> = ({ unlockedIds, allAchievements }) => {
    const unlockedSet = new Set(unlockedIds);

    if (unlockedIds.length === 0) {
        return null; // Don't render anything if no achievements are unlocked
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Achievements</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
                {allAchievements.map(achievement => {
                    const isUnlocked = unlockedSet.has(achievement.id);
                    return (
                        <div
                            key={achievement.id}
                            className={`relative group p-2 rounded-full border transition-all duration-300
                                ${isUnlocked ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-700/50 border-slate-600'}`}
                        >
                            <span className={`text-2xl transition-opacity duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-20'}`}>
                                {achievement.icon}
                            </span>
                             {isUnlocked && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                    <p className="font-bold">{achievement.name}</p>
                                    <p className="text-slate-300">{achievement.description}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementList;
