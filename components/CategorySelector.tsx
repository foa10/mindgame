import React from 'react';
import { Category } from '../types';

interface CategorySelectorProps {
    currentCategory: Category;
    onCategoryChange: (category: Category) => void;
    disabled: boolean;
}

const categories: Category[] = ['General', 'Math', 'Wordplay', 'Riddle'];

const CategorySelector: React.FC<CategorySelectorProps> = ({ currentCategory, onCategoryChange, disabled }) => {
    
    const getButtonClass = (cat: Category) => {
        const base = 'px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 w-24';
        if (disabled) {
            return `${base} cursor-not-allowed bg-slate-700 text-slate-500`;
        }
        if (cat === currentCategory) {
            return `${base} bg-sky-600 text-white shadow-lg focus:ring-sky-500`;
        }
        return `${base} bg-slate-700 text-slate-300 hover:bg-slate-600`;
    };

    return (
        <div className="flex items-center justify-center gap-2 p-1 bg-slate-800/70 rounded-lg border border-slate-700">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={getButtonClass(cat)}
                    disabled={disabled || cat === currentCategory}
                    aria-pressed={cat === currentCategory}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategorySelector;