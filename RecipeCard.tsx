
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
          {recipe.title}
        </h3>
        <span className="bg-slate-700 text-xs px-2 py-1 rounded-lg text-slate-300">
          {recipe.time} | {recipe.difficulty}
        </span>
      </div>
      
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {recipe.description}
      </p>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-200 mb-2 border-r-2 border-emerald-500 pr-2">مواد لازم:</h4>
        <ul className="grid grid-cols-2 gap-1 text-xs text-slate-400">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
              {ing}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-200 mb-2 border-r-2 border-amber-500 pr-2">طرز تهیه:</h4>
        <div className="space-y-2">
          {recipe.instructions.map((step, idx) => (
            <div key={idx} className="flex gap-2 text-sm text-slate-300 leading-relaxed">
              <span className="text-emerald-500 font-bold">{idx + 1}.</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
