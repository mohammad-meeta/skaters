import React from 'react';
import { useApp } from '../context';
import { SHOP_ITEMS } from '../constants';
import { Lock, Check, AlertCircle, ShoppingBag, Zap, Disc, Footprints, Shield, Sticker, Package } from 'lucide-react';
import { Level } from '../types';

export const ShopScreen: React.FC = () => {
  const { totalScore, pointsPerLevel, redeemItem, redeemedItems, getBadges } = useApp();
  const badges = getBadges();

  const handleBuy = (itemId: string, cost: number, name: string, level: Level) => {
    if (confirm(`آیا مطمئن هستید که می‌خواهید "${name}" را با ${cost} امتیاز از سطح ${level} دریافت کنید؟`)) {
        redeemItem(itemId, cost);
    }
  };

  const getLevelColor = (level: Level) => {
      switch(level) {
          case Level.A: return 'text-red-500 border-red-500/30 bg-red-500/10';
          case Level.B: return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
          case Level.C: return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
          case Level.D: return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
          case Level.E: return 'text-green-500 border-green-500/30 bg-green-500/10';
      }
  };

  const getItemIcon = (id: string) => {
    // Simple mapping of IDs to icons
    switch(id) {
        case 's1': return <Zap size={40} className="text-yellow-400" />;
        case 's2': return <Disc size={40} className="text-gray-400" />;
        case 's3': return <Footprints size={40} className="text-blue-400" />;
        case 's4': return <Disc size={40} className="text-red-400" />; // Frame/Wheel
        case 's5': return <Package size={40} className="text-orange-400" />;
        case 's6': return <ShoppingBag size={40} className="text-purple-400" />;
        case 's7': return <Disc size={40} className="text-green-400" />;
        case 's8': return <Sticker size={40} className="text-pink-400" />;
        case 's9': return <Shield size={40} className="text-indigo-400" />;
        default: return <ShoppingBag size={40} />;
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <header className="mb-6 sticky top-0 bg-black/95 backdrop-blur pt-4 z-20">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">فروشگاه جوایز</h1>
            <div className="text-gray-400 text-xs">مجموع: {totalScore}</div>
        </div>
        
        {/* Points Breakdown */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {Object.values(Level).map(lvl => (
                <div key={lvl} className={`flex flex-col items-center min-w-[70px] px-2 py-1.5 rounded-lg border ${getLevelColor(lvl)}`}>
                    <span className="text-[10px] font-bold opacity-70">سطح {lvl}</span>
                    <span className="text-lg font-black">{pointsPerLevel[lvl]}</span>
                </div>
            ))}
        </div>
      </header>

      <div className="grid gap-6">
        {SHOP_ITEMS.map((item) => {
            const isRedeemed = redeemedItems.includes(item.id);
            const levelPoints = pointsPerLevel[item.requiredBadgeLevel];
            const canAfford = levelPoints >= item.cost;
            
            return (
                <div key={item.id} className={`flex flex-col bg-card rounded-xl overflow-hidden border ${isRedeemed ? 'border-green-500/50' : 'border-gray-800'}`}>
                    <div className="flex h-32">
                        <div className="w-1/3 relative bg-gray-900 flex items-center justify-center">
                            {getItemIcon(item.id)}
                            <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg font-bold">
                                Lvl {item.requiredBadgeLevel}
                            </div>
                        </div>
                        <div className="w-2/3 p-3 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-base leading-tight mb-1">{item.name}</h3>
                                <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                            </div>
                            
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-bold text-sm">
                                    {item.cost} <span className="text-xs font-normal opacity-70">امتیاز {item.requiredBadgeLevel}</span>
                                </span>
                                
                                {isRedeemed ? (
                                    <span className="flex items-center gap-1 text-green-500 text-xs font-bold">
                                        <Check size={14} /> دریافت شد
                                    </span>
                                ) : (
                                    <button
                                        disabled={!canAfford}
                                        onClick={() => handleBuy(item.id, item.cost, item.name, item.requiredBadgeLevel)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1
                                            ${canAfford 
                                                ? 'bg-white text-black hover:bg-gray-200 active:scale-95' 
                                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        {!canAfford && <Lock size={12} />} دریافت
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Warning if not enough specific points */}
                    {!canAfford && !isRedeemed && (
                        <div className="bg-red-900/10 border-t border-red-900/30 px-3 py-1.5 flex items-center gap-2">
                             <AlertCircle size={12} className="text-red-400" />
                             <span className="text-[10px] text-red-300">
                                نیاز به {item.cost - levelPoints} امتیاز دیگر از سطح {item.requiredBadgeLevel} دارید.
                             </span>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};