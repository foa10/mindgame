import React, { useState, useEffect, useCallback } from 'react';
import { generatePuzzle } from './services/geminiService';
import { Puzzle, Difficulty, Category, GameStats, Achievement } from './types';
import PuzzleCard from './components/PuzzleCard';
import InputForm from './components/InputForm';
import Feedback from './components/Feedback';
import SoundToggle from './components/SoundToggle';
import DifficultySelector from './components/DifficultySelector';
import CategorySelector from './components/CategorySelector';
import StatsDisplay from './components/StatsDisplay';
import AchievementToast from './components/AchievementToast';
import AchievementList from './components/AchievementList';
import { soundService } from './services/soundService';
import { hapticService } from './services/hapticService';
import { checkAchievements, allAchievements } from './services/achievementService';

const App: React.FC = () => {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [userGuess, setUserGuess] = useState<string>('');
    const [feedbackMessage, setFeedbackMessage] = useState<string>('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [hintTaken, setHintTaken] = useState<boolean>(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [category, setCategory] = useState<Category>('General');
    const [scoreAnimation, setScoreAnimation] = useState<{ points: number; key: number; active: boolean }>({ points: 0, key: 0, active: false });
    const [stats, setStats] = useState<GameStats>({ puzzlesAttempted: 0, puzzlesSolved: 0, highScore: 0, winStreak: 0 });
    const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
    const [achievementToastQueue, setAchievementToastQueue] = useState<Achievement[]>([]);


    // Load all settings from localStorage on initial render
    useEffect(() => {
        try {
            const savedScore = localStorage.getItem('logicQuestScore');
            if (savedScore) setScore(parseInt(savedScore, 10));
            
            const savedStats = localStorage.getItem('logicQuestStats');
            if (savedStats) setStats(JSON.parse(savedStats));

            const savedAchievements = localStorage.getItem('logicQuestAchievements');
            if (savedAchievements) setUnlockedAchievements(new Set(JSON.parse(savedAchievements)));

            const savedSoundPref = localStorage.getItem('logicQuestSoundEnabled');
            const soundEnabled = savedSoundPref !== 'false';
            setIsSoundEnabled(soundEnabled);
            soundService.setEnabled(soundEnabled);

            const savedDifficulty = localStorage.getItem('logicQuestDifficulty') as Difficulty | null;
             if (savedDifficulty && ['Easy', 'Medium', 'Hard'].includes(savedDifficulty)) setDifficulty(savedDifficulty);
            
            const savedCategory = localStorage.getItem('logicQuestCategory') as Category | null;
            if (savedCategory && ['General', 'Math', 'Wordplay', 'Riddle'].includes(savedCategory)) setCategory(savedCategory);

        } catch (error) {
            console.error("Failed to load settings from localStorage:", error);
        }
    }, []);

    // Save score to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('logicQuestScore', score.toString());
            if (score > stats.highScore) {
                setStats(prevStats => ({...prevStats, highScore: score}));
            }
        } catch (error) {
            console.error("Failed to save score to localStorage:", error);
        }
    }, [score, stats.highScore]);

     // Save stats to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('logicQuestStats', JSON.stringify(stats));
        } catch (error) {
            console.error("Failed to save stats to localStorage:", error);
        }
    }, [stats]);

    // Save unlocked achievements to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('logicQuestAchievements', JSON.stringify(Array.from(unlockedAchievements)));
        } catch (error) {
            console.error("Failed to save achievements to localStorage:", error);
        }
    }, [unlockedAchievements]);


     // Save sound preference to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('logicQuestSoundEnabled', String(isSoundEnabled));
            soundService.setEnabled(isSoundEnabled);
        } catch (error) {
            console.error("Failed to save sound preference to localStorage:", error);
        }
    }, [isSoundEnabled]);

    // Save difficulty to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('logicQuestDifficulty', difficulty);
        } catch (error) {
            console.error("Failed to save difficulty to localStorage:", error);
        }
    }, [difficulty]);

    // Save category to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('logicQuestCategory', category);
        } catch (error) {
            console.error("Failed to save category to localStorage:", error);
        }
    }, [category]);

    // Effect to handle the score animation lifecycle
    useEffect(() => {
        if (scoreAnimation.active) {
            const timer = setTimeout(() => setScoreAnimation(s => ({ ...s, active: false })), 1200);
            return () => clearTimeout(timer);
        }
    }, [scoreAnimation.key]);


    const fetchNewPuzzle = useCallback(async (level: Difficulty, cat: Category) => {
        setIsLoading(true);
        setUserGuess('');
        setPuzzle(null);
        setShowHint(false);
        setHintTaken(false);
        soundService.play('loading');

        try {
            const newPuzzle = await generatePuzzle(level, cat);
            setPuzzle(newPuzzle);
            setStats(prevStats => ({ ...prevStats, puzzlesAttempted: prevStats.puzzlesAttempted + 1 }));
            setFeedbackMessage('');
            setIsCorrect(null);
        } catch (error) {
            console.error("Failed to generate puzzle:", error);
            const errorMessage = 'Failed to load a new puzzle. Please try again.';
            setFeedbackMessage(errorMessage);
            setIsCorrect(false);
            setTimeout(() => {
                setFeedbackMessage((currentMsg) => currentMsg === errorMessage ? '' : currentMsg);
                setIsCorrect(null);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialDifficulty = (localStorage.getItem('logicQuestDifficulty') as Difficulty) || 'Medium';
        const initialCategory = (localStorage.getItem('logicQuestCategory') as Category) || 'General';
        const attempted = JSON.parse(localStorage.getItem('logicQuestStats') || '{}').puzzlesAttempted || 0;
        if (attempted === 0) {
            fetchNewPuzzle(initialDifficulty, initialCategory);
        } else {
             setIsLoading(false);
        }
    }, [fetchNewPuzzle]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userGuess.trim() || !puzzle || isCorrect) return;

        setIsSubmitting(true);
        const guess = userGuess.trim().toLowerCase();
        const answer = puzzle.answer.trim().toLowerCase();

        setTimeout(() => {
            if (guess === answer) {
                setFeedbackMessage('Correct! You have a brilliant mind.');
                setIsCorrect(true);
                soundService.play('correct');
                hapticService.trigger('success');

                const points = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;
                const earnedPoints = hintTaken ? points : points * 2;
                const newScore = score + earnedPoints;
                setScore(newScore);
                setScoreAnimation({ points: earnedPoints, key: Date.now(), active: true });
                
                const updatedStats = {
                    ...stats,
                    puzzlesSolved: stats.puzzlesSolved + 1,
                    winStreak: stats.winStreak + 1,
                    highScore: Math.max(stats.highScore, newScore),
                };
                setStats(updatedStats);
                
                const newlyUnlocked = checkAchievements(updatedStats, newScore, hintTaken, unlockedAchievements);
                if (newlyUnlocked.length > 0) {
                    setAchievementToastQueue(prev => [...prev, ...newlyUnlocked]);
                    setUnlockedAchievements(prev => new Set([...prev, ...newlyUnlocked.map(a => a.id)]));
                    soundService.play('achievement');
                    hapticService.trigger('success');
                }
            } else {
                setFeedbackMessage('Not quite. Give it another thought!');
                setIsCorrect(false);
                soundService.play('incorrect');
                hapticService.trigger('error');
                setStats(prev => ({ ...prev, winStreak: 0 }));
            }
            setIsSubmitting(false);
        }, 500);
    };
    
    const handleResetProgress = () => {
        if (window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
            soundService.play('click');
            hapticService.trigger('click');
            setScore(0);
            setStats({ puzzlesAttempted: 0, puzzlesSolved: 0, highScore: 0, winStreak: 0 });
            setUnlockedAchievements(new Set());
            fetchNewPuzzle(difficulty, category);
        }
    };

    const handleGetHint = () => {
        if (hintTaken || !puzzle?.hint || score <= 0 || isCorrect) return;
        setShowHint(true);
        setHintTaken(true);
        soundService.play('hint');
        hapticService.trigger('hint');
        setScore(prevScore => Math.max(0, prevScore - 1));
    };
    
    const handleNewPuzzleClick = () => {
        soundService.play('click');
        hapticService.trigger('click');
        fetchNewPuzzle(difficulty, category);
    }

    const handleDifficultyChange = (newDifficulty: Difficulty) => {
        if (newDifficulty === difficulty || isLoading) return;
        soundService.play('click');
        hapticService.trigger('click');
        setDifficulty(newDifficulty);
        fetchNewPuzzle(newDifficulty, category);
    };

    const handleCategoryChange = (newCategory: Category) => {
        if (newCategory === category || isLoading) return;
        soundService.play('click');
        hapticService.trigger('click');
        setCategory(newCategory);
        fetchNewPuzzle(difficulty, newCategory);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center justify-center p-4 font-sans">
             <AchievementToast
                achievement={achievementToastQueue[0]}
                onDone={() => setAchievementToastQueue(prev => prev.slice(1))}
            />
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        Logic Reasoning Quest
                    </h1>
                    <p className="text-lg text-slate-400 mt-2">Challenge your mind with AI-generated riddles.</p>

                    <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <DifficultySelector currentDifficulty={difficulty} onDifficultyChange={handleDifficultyChange} disabled={isLoading}/>
                            <CategorySelector currentCategory={category} onCategoryChange={handleCategoryChange} disabled={isLoading}/>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-center shadow-lg" aria-live="polite">
                                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Score</span>
                                <p className="text-2xl font-bold text-white">{score}</p>
                                <span key={scoreAnimation.key} aria-hidden="true" className={`absolute top-1/2 left-1/2 -translate-x-1/2 text-green-400 font-bold text-lg transition-all duration-700 ease-out pointer-events-none ${scoreAnimation.active ? 'opacity-100 -translate-y-10' : 'opacity-0 -translate-y-6'}`}>
                                    +{scoreAnimation.points}
                                </span>
                            </div>
                            <SoundToggle isEnabled={isSoundEnabled} onToggle={() => setIsSoundEnabled(!isSoundEnabled)} />
                        </div>
                    </div>
                </header>

                <main className="bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-indigo-900/20 border border-slate-700 backdrop-blur-sm">
                    <PuzzleCard puzzleText={puzzle?.puzzle} isLoading={isLoading} />
                    
                    {!isLoading && puzzle && (
                        <>
                            <InputForm guess={userGuess} onGuessChange={(e) => setUserGuess(e.target.value)} onSubmit={handleSubmit} isSubmitting={isSubmitting} isPuzzleSolved={isCorrect === true}/>
                            <div className="mt-4 grid grid-cols-1">
                                {!isCorrect && !hintTaken && (
                                     <button onClick={handleGetHint} disabled={hintTaken || isCorrect === true || score === 0} title={isCorrect ? "Puzzle already solved!" : hintTaken ? "Hint already taken." : score === 0 ? "You need at least 1 point." : "Reveal a hint (costs 1 point)"} className="text-sm w-fit mx-auto text-indigo-400 hover:text-indigo-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:text-slate-500 disabled:cursor-not-allowed">
                                        Need a hint? (Cost: 1 point)
                                    </button>
                                )}
                               <div className={`transition-opacity duration-500 ease-in-out ${showHint ? 'opacity-100' : 'opacity-0'}`}>
                                {showHint && puzzle.hint && (
                                    <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center">
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Hint</p>
                                        <p className="italic text-slate-300 mt-1">"{puzzle.hint}"</p>
                                    </div>
                                )}
                                </div>
                            </div>
                            <Feedback message={feedbackMessage} isCorrect={isCorrect} />
                        </>
                    )}
                     {!isLoading && !puzzle && (
                        <div className="text-center py-10">
                            <p className="text-slate-400 mb-4">Ready to challenge your mind?</p>
                            <button onClick={handleNewPuzzleClick} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300">
                                Start First Puzzle
                            </button>
                        </div>
                    )}
                </main>

                <footer className="text-center mt-8 space-y-6">
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={handleNewPuzzleClick} disabled={isLoading} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {isLoading ? 'Summoning a New Riddle...' : `New ${difficulty} Puzzle`}
                        </button>
                        {(score > 0 || stats.puzzlesAttempted > 0) && (
                            <button onClick={handleResetProgress} className="text-slate-400 hover:text-white hover:bg-slate-700/50 text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                                Reset Progress
                            </button>
                        )}
                    </div>

                    <StatsDisplay stats={stats} />
                    <AchievementList unlockedIds={Array.from(unlockedAchievements)} allAchievements={allAchievements} />
                </footer>
            </div>
        </div>
    );
};

export default App;
