
import React, { useState, useEffect, useMemo } from 'react';
import { getRecipeSuggestions } from './services/geminiService';
import { Recipe } from './types';
import RecipeCard from './components/RecipeCard';

const GREETINGS = [
  "امروز وقت یه غذای فوق‌العاده‌ست.",
  "بریم ببینیم توی یخچال چی داریم؟",
  "آماده‌ای برای یه خلق اثر هنری در آشپزخونه؟",
  "بریم سراغ یه دستور پخت عالی و متفاوت.",
  "امروز قراره چی‌کار کنیم؟ بیا یه غذای جدید امتحان کنیم.",
  "همیشه وقت برای پختن یه غذای خوشمزه هست."
];

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('smart_chef_user_name'));
  const [tempName, setTempName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Select a random greeting message once per session
  const randomMessage = useMemo(() => {
    return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      localStorage.setItem('smart_chef_user_name', tempName.trim());
      setUserName(tempName.trim());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const result = await getRecipeSuggestions(ingredients);
      setRecipes(result.recipes);
      // Scroll to results on mobile after search
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  // If name is not set, show onboarding
  if (!userName) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-6">
            <div className="animate-float">
              <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">سلام! خوش اومدی</h2>
          <p className="text-slate-400 text-center mb-8">قبل از اینکه شروع کنیم، اسمت چیه؟</p>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <input
              autoFocus
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="نام شما..."
              className="w-full bg-slate-700 border-2 border-slate-600 rounded-2xl px-6 py-4 text-slate-100 focus:outline-none focus:border-emerald-500 transition-all text-center text-lg"
            />
            <button
              type="submit"
              disabled={!tempName.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              بزن بریم!
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-12 px-4 select-none">
      {/* Animated Header Section */}
      <header className="pt-8 pb-6 flex flex-col items-center text-center">
        <div className="animate-float mb-4">
          <svg 
            className="w-20 h-20 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M15 10a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-l from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">
          آشپز هوشمند
        </h1>
        <div className="max-w-xs md:max-w-md px-2">
          <p className="text-emerald-400 font-medium text-lg mb-1">
            سلام {userName} جان، {randomMessage}
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            مواد اولیه‌ای که در خانه داری رو بنویس تا بهت بگم چه غذای خوشمزه‌ای می‌تونی درست کنی!
          </p>
        </div>
      </header>

      {/* Input Form */}
      <main className="max-w-4xl mx-auto mt-4">
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative group">
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="مثلا: سیب زمینی، تخم مرغ، پیاز، رب گوجه..."
              className="w-full h-36 bg-slate-800 border-2 border-slate-700 rounded-3xl p-6 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-2xl text-base"
            />
            <button
              type="submit"
              disabled={loading || !ingredients.trim()}
              className="absolute bottom-4 left-4 right-4 md:right-auto md:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال بررسی...
                </>
              ) : (
                'چی بپزم؟'
              )}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl text-center mb-8 animate-bounce">
            {error}
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>

        {/* Initial Empty State */}
        {!loading && recipes.length === 0 && !error && (
          <div className="text-center py-16 opacity-30 select-none">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl font-bold">هنوز چیزی جستجو نکردی</p>
            <p className="text-sm mt-1">یخچال رو چک کن و مواد رو اینجا وارد کن!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-slate-800 text-center space-y-2">
        <p className="text-slate-500 text-xs">قدرت گرفته از هوش مصنوعی جمینای</p>
        <p className="text-slate-400 text-sm font-medium">
          ساخته شده توسط <span className="text-emerald-500">علی فرامرزی</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
