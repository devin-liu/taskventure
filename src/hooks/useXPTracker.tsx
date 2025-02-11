import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QuestComplexity } from '../constants/gameConstants';

interface XPHistoryEntry {
  questTitle: string;
  xpGained: number;
  timestamp: string;
  level: number;
  complexity: QuestComplexity;
}

interface XPContextType {
  totalXP: number;
  currentLevel: number;
  xpHistory: XPHistoryEntry[];
  addXP: (questTitle: string, complexity: QuestComplexity, xpAmount: number) => void;
  xpToNextLevel: number;
  percentToNextLevel: number;
}

const XPContext = createContext<XPContextType | undefined>(undefined);

export const useXPTracker = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXPTracker must be used within an XPProvider');
  }
  return context;
};

interface XPProviderProps {
  children: ReactNode;
}

// XP table similar to RuneScape's progression system
const XP_TABLE: number[] = Array.from({ length: 100 }, (_, level) => {
  return Math.floor(1/8 * Math.pow(level, 3) + 75 * level + 100);
});

export const XPProvider: React.FC<XPProviderProps> = ({ children }) => {
  const [totalXP, setTotalXP] = useState(0);
  const [xpHistory, setXPHistory] = useState<XPHistoryEntry[]>([]);

  // Calculate level based on XP using RuneScape-like progression
  const calculateLevel = (xp: number): number => {
    let level = 1;
    while (level < XP_TABLE.length && xp >= XP_TABLE[level - 1]) {
      level++;
    }
    return Math.min(level, 99); // Cap at level 99
  };

  // Calculate XP needed for next level
  const calculateXPToNextLevel = (currentXP: number): number => {
    const level = calculateLevel(currentXP);
    if (level >= 99) return 0;
    return XP_TABLE[level - 1] - currentXP;
  };

  // Calculate percentage progress to next level
  const calculatePercentToNextLevel = (currentXP: number): number => {
    const level = calculateLevel(currentXP);
    if (level >= 99) return 100;
    
    const currentLevelXP = level > 1 ? XP_TABLE[level - 2] : 0;
    const nextLevelXP = XP_TABLE[level - 1];
    const xpIntoLevel = currentXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    
    return Math.min(100, Math.floor((xpIntoLevel / xpNeededForLevel) * 100));
  };

  const addXP = (questTitle: string, complexity: QuestComplexity, xpAmount: number) => {
    const newTotalXP = totalXP + xpAmount;
    const newLevel = calculateLevel(newTotalXP);
    
    setTotalXP(newTotalXP);
    setXPHistory(prev => [
      {
        questTitle,
        xpGained: xpAmount,
        timestamp: new Date().toISOString(),
        level: newLevel,
        complexity
      },
      ...prev
    ]);
  };

  // Load XP data from localStorage on mount
  useEffect(() => {
    const savedXP = localStorage.getItem('taskventure_xp');
    if (savedXP) {
      const { totalXP: savedTotalXP, history } = JSON.parse(savedXP);
      setTotalXP(savedTotalXP);
      setXPHistory(history);
    }
  }, []);

  // Save XP data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('taskventure_xp', JSON.stringify({
      totalXP,
      history: xpHistory
    }));
  }, [totalXP, xpHistory]);

  const value: XPContextType = {
    totalXP,
    currentLevel: calculateLevel(totalXP),
    xpHistory,
    addXP,
    xpToNextLevel: calculateXPToNextLevel(totalXP),
    percentToNextLevel: calculatePercentToNextLevel(totalXP)
  };

  return <XPContext.Provider value={value}>{children}</XPContext.Provider>;
};
