import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Level } from '../types';
import { useApp } from '../context';
import { Trophy, Star, Download } from 'lucide-react';

const levels = Object.values(Level);

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { totalScore, installPrompt, handleInstallClick } = useApp();

  const handleLevelClick = (level: Level) => {
    navigate(`/level/${level}`);
  };

  const getLevelColor = (level: Level) => {
    switch(level) {
      case Level.A: return 'from-red-600 to-red-900 border-red-500';
      case Level.B: return 'from-orange-600 to-orange-900 border-orange-500';
      case Level.C: return 'from-yellow-600 to-yellow-900 border-yellow-500';
      case Level.D: return 'from-blue-600 to-blue-900 border-blue-500';
      case Level.E: return 'from-green-600 to-green-900 border-green-500';
      default: return 'from-gray-700 to-gray-900';
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            تمرین اسکیت
          </h1>
          <p className="text-gray-400 text-sm">سطح خود را انتخاب کنید</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-700">
          <Trophy size={16} className="text-yellow-400" />
          <span className="font-bold text-yellow-400">{totalScore}</span>
        </div>
      </header>

      {/* PWA Install Button */}
      {installPrompt && (
        <button 
          onClick={handleInstallClick}
          className="w-full mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-3 flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
        >
          <Download className="text-white animate-bounce" size={20} />
          <div className="text-right">
             <span className="block font-bold text-sm">نصب اپلیکیشن</span>
             <span className="block text-[10px] text-gray-200">برای دسترسی سریع‌تر و آفلاین نصب کنید</span>
          </div>
        </button>
      )}

      <div className="grid gap-4">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => handleLevelClick(level)}
            className={`relative overflow-hidden w-full h-24 rounded-2xl border-l-4 shadow-lg transition-transform active:scale-95 group`}
          >
             <div className={`absolute inset-0 bg-gradient-to-r opacity-20 group-hover:opacity-30 ${getLevelColor(level)}`}></div>
             <div className="absolute inset-0 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-white/10 text-xl font-black text-white`}>
                        {level}
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold text-white">سطح {level}</h2>
                        <span className="text-xs text-gray-400">برای مشاهده حرکات ضربه بزنید</span>
                    </div>
                </div>
                <Star className="text-white/20 group-hover:text-white/40 transition-colors" size={32} />
             </div>
          </button>
        ))}
      </div>
    </div>
  );
};