import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserLog, UserState, Level, Trick, Category } from './types';
import { POINTS_PER_LEVEL, TRICKS_DATA, SHOP_ITEMS } from './constants';

interface AppContextType {
  logs: Record<string, UserLog>;
  totalScore: number;
  pointsPerLevel: Record<Level, number>;
  redeemedItems: string[];
  userName: string;
  tricks: Trick[];
  saveLog: (log: UserLog, level: Level) => void;
  redeemItem: (itemId: string, cost: number) => boolean;
  getBadges: () => UserLog[];
  updateUserName: (name: string) => void;
  installPrompt: any;
  handleInstallClick: () => void;
  // Admin functions
  addTrick: (trick: Trick) => void;
  updateTrick: (trick: Trick) => void;
  deleteTrick: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'skatemaster_data_v3'; // Bumped version

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    let parsed = saved ? JSON.parse(saved) : null;
    
    // Initialize tricks: Check if saved, otherwise load from constants and assign defaults
    let initialTricks: Trick[] = [];
    if (parsed && parsed.tricks && parsed.tricks.length > 0) {
        initialTricks = parsed.tricks;
    } else {
        // Seed from constant data and set default maxCones
        initialTricks = TRICKS_DATA.map(t => ({
            ...t,
            maxCones: t.category === Category.SITTING ? 14 : 20
        }));
    }

    if (!parsed) {
        parsed = { logs: {}, redeemedItems: [], userName: 'بازیکن' };
    }
    
    // Recalculate points based on current logs and current tricks (in case tricks changed points logic)
    // Initialize points buckets
    const points: Record<Level, number> = {
        [Level.A]: 0,
        [Level.B]: 0,
        [Level.C]: 0,
        [Level.D]: 0,
        [Level.E]: 0
    };

    // 1. Calculate Earned Points
    if (parsed.logs) {
        Object.values(parsed.logs as Record<string, UserLog>).forEach(log => {
            const trick = initialTricks.find(t => t.id === log.trickId);
            if (trick) {
                points[trick.level] += (log.cones * POINTS_PER_LEVEL[trick.level]);
            }
        });
    }

    // 2. Deduct Spent Points
    if (parsed.redeemedItems) {
        (parsed.redeemedItems as string[]).forEach(itemId => {
            const item = SHOP_ITEMS.find(i => i.id === itemId);
            if (item) {
                points[item.requiredBadgeLevel] -= item.cost;
            }
        });
    }

    const total = Object.values(points).reduce((a: number, b: number) => a + b, 0);

    return {
        logs: parsed.logs || {},
        redeemedItems: parsed.redeemedItems || [],
        pointsPerLevel: points,
        totalScore: total,
        userName: parsed.userName || 'بازیکن',
        tricks: initialTricks
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // PWA Install Logic
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      setInstallPrompt(null);
    });
  };

  const saveLog = (log: UserLog, level: Level) => {
    setState(prev => {
      const existingLog = prev.logs[log.trickId];
      const previousCones = existingLog ? existingLog.cones : 0;
      
      const pointMultiplier = POINTS_PER_LEVEL[level];
      const scoreDiff = (log.cones - previousCones) * pointMultiplier;

      const newPointsPerLevel = { ...prev.pointsPerLevel };
      newPointsPerLevel[level] = (newPointsPerLevel[level] || 0) + scoreDiff;

      const newTotalScore = Object.values(newPointsPerLevel).reduce((a: number, b: number) => a + b, 0);
      
      return {
        ...prev,
        logs: { ...prev.logs, [log.trickId]: log },
        pointsPerLevel: newPointsPerLevel,
        totalScore: newTotalScore
      };
    });
  };

  const redeemItem = (itemId: string, cost: number) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return false;

    const level = item.requiredBadgeLevel;
    const availablePoints = state.pointsPerLevel[level];

    if (availablePoints >= cost && !state.redeemedItems.includes(itemId)) {
      setState(prev => {
        const newPointsPerLevel = { ...prev.pointsPerLevel };
        newPointsPerLevel[level] -= cost;
        return {
            ...prev,
            pointsPerLevel: newPointsPerLevel,
            totalScore: Object.values(newPointsPerLevel).reduce((a: number, b: number) => a + b, 0),
            redeemedItems: [...prev.redeemedItems, itemId]
        };
      });
      return true;
    }
    return false;
  };

  const updateUserName = (name: string) => {
      setState(prev => ({ ...prev, userName: name }));
  };

  const getBadges = () => {
    return (Object.values(state.logs) as UserLog[]).filter(log => log.isMastered);
  };

  // --- Admin Functions ---

  const addTrick = (trick: Trick) => {
    setState(prev => ({
        ...prev,
        tricks: [...prev.tricks, trick]
    }));
  };

  const updateTrick = (updatedTrick: Trick) => {
    setState(prev => ({
        ...prev,
        tricks: prev.tricks.map(t => t.id === updatedTrick.id ? updatedTrick : t)
    }));
  };

  const deleteTrick = (id: string) => {
    setState(prev => {
        // Remove logs associated with this trick to clean up points? 
        // For simplicity, we keep the logs but the trick disappears from lists.
        // A full cleanup would require recalculating scores.
        return {
            ...prev,
            tricks: prev.tricks.filter(t => t.id !== id)
        };
    });
  };

  return (
    <AppContext.Provider value={{ 
      logs: state.logs, 
      totalScore: state.totalScore, 
      pointsPerLevel: state.pointsPerLevel,
      redeemedItems: state.redeemedItems,
      userName: state.userName,
      tricks: state.tricks,
      saveLog, 
      redeemItem,
      getBadges,
      updateUserName,
      installPrompt,
      handleInstallClick,
      addTrick,
      updateTrick,
      deleteTrick
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};