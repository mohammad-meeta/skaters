import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Level, Category } from '../types';
import { useApp } from '../context';
import { TrickCard } from '../components/TrickCard';
import { ArrowLeft } from 'lucide-react';

export const TrickListScreen: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { logs, tricks } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');

  const level = levelId as Level;
  
  const filteredTricks = useMemo(() => {
    return tricks.filter(t => 
      t.level === level && 
      (selectedCategory === 'ALL' || t.category === selectedCategory)
    );
  }, [level, selectedCategory, tricks]);

  const categories = ['ALL', ...Object.values(Category)];

  // Stats for this level based on Cones
  const levelStats = useMemo(() => {
    let earned = 0;
    let total = 0;
    
    // Get all tricks for this level (ignoring category filter for the progress bar)
    const tricksInLevel = tricks.filter(t => t.level === level);
    
    tricksInLevel.forEach(trick => {
        const maxCones = trick.maxCones || 20;
        total += maxCones;
        
        const userLog = logs[trick.id];
        if (userLog) {
            earned += userLog.cones;
        }
    });

    return { earned, total };
  }, [level, logs, tricks]);

  const progress = levelStats.total > 0 
    ? Math.round((levelStats.earned / levelStats.total) * 100) 
    : 0;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-card rounded-full">
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">سطح {level}</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-card p-4 rounded-xl border border-gray-800">
        <div className="flex justify-between text-sm mb-2 text-gray-400">
            <span>پیشرفت سطح (موانع)</span>
            <span dir="ltr">{progress}% ({levelStats.earned}/{levelStats.total})</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {categories.map((cat) => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors
                    ${selectedCategory === cat 
                        ? 'bg-primary text-black' 
                        : 'bg-card text-gray-400 border border-gray-800'}`}
            >
                {cat === 'ALL' ? 'همه' : cat}
            </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {filteredTricks.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">هیچ حرکتی یافت نشد</div>
        ) : (
            filteredTricks.map(trick => (
                <TrickCard 
                    key={trick.id}
                    trick={trick}
                    log={logs[trick.id]}
                    onClick={() => navigate(`/trick/${trick.id}`)}
                />
            ))
        )}
      </div>
    </div>
  );
};