import React, { useState } from 'react';
import { useApp } from '../context';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, Medal, User, Edit3, Check, Settings } from 'lucide-react';
import { Level } from '../types';

export const ProfileScreen: React.FC = () => {
  const { totalScore, getBadges, userName, updateUserName, tricks } = useApp();
  const navigate = useNavigate();
  const badges = getBadges();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSaveName = () => {
      if (tempName.trim()) {
          updateUserName(tempName.trim());
          setIsEditingName(false);
      }
  };

  // Calculate stats by level using tricks from context
  const statsData = Object.values(Level).map(level => {
    const total = tricks.filter(t => t.level === level).length;
    const mastered = badges.filter(log => {
       const trick = tricks.find(t => t.id === log.trickId);
       return trick?.level === level;
    }).length;

    return { name: `Level ${level}`, value: mastered, total: total };
  });

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e'];

  const totalMastered = badges.length;
  const totalTricks = tricks.length;

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">پروفایل من</h1>
        <button onClick={() => navigate('/admin')} className="p-2 bg-gray-900 rounded-full border border-gray-700 text-gray-400 hover:text-white">
            <Settings size={20} />
        </button>
      </div>

      <div className="bg-card p-4 rounded-2xl border border-gray-800 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <User size={32} />
        </div>
        <div className="flex-1">
            <span className="text-xs text-gray-400 block mb-1">نام بازیکن</span>
            
            {isEditingName ? (
                <div className="flex items-center gap-2">
                    <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white w-full outline-none focus:border-primary"
                        autoFocus
                    />
                    <button onClick={handleSaveName} className="p-1.5 bg-green-600 rounded text-white">
                        <Check size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{userName}</h2>
                    <button onClick={() => setIsEditingName(true)} className="p-1 text-gray-500 hover:text-white">
                        <Edit3 size={16} />
                    </button>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card p-4 rounded-xl border border-gray-800 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-1">امتیاز کل</span>
            <span className="text-2xl font-black text-primary">{totalScore}</span>
        </div>
        <div className="bg-card p-4 rounded-xl border border-gray-800 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-1">حرکات تکمیل شده</span>
            <span className="text-2xl font-black text-white">{totalMastered} <span className="text-sm text-gray-500">/ {totalTricks}</span></span>
        </div>
      </div>

      <div className="bg-card p-4 rounded-xl border border-gray-800 mb-6 h-64">
        <h3 className="text-sm font-bold mb-2">توزیع مهارت‌ها</h3>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={statsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {statsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                />
            </PieChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Medal className="text-yellow-500" />
        نشان‌ها (Badges)
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {badges.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center py-4">هنوز نشانی دریافت نکرده‌اید.</p>
        ) : (
            badges.map((log) => {
                const trick = tricks.find(t => t.id === log.trickId);
                if (!trick) return null;
                
                let badgeColor = '';
                switch(trick.level) {
                    case Level.A: badgeColor = 'text-red-500 border-red-500'; break;
                    case Level.B: badgeColor = 'text-orange-500 border-orange-500'; break;
                    case Level.C: badgeColor = 'text-yellow-500 border-yellow-500'; break;
                    case Level.D: badgeColor = 'text-blue-500 border-blue-500'; break;
                    case Level.E: badgeColor = 'text-green-500 border-green-500'; break;
                }

                return (
                    <div key={log.trickId} className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 bg-gray-900/50 ${badgeColor}`}>
                        <Award size={32} className="mb-2 opacity-80" />
                        <span className="text-[10px] font-bold text-center leading-tight">{trick.name}</span>
                        <span className="text-[9px] mt-1 opacity-60 font-mono">Lvl {trick.level}</span>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};