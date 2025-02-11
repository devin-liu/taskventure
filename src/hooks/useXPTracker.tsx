import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface XPHistoryEntry {
  questTitle: string;
  xpGained: number;
  timestamp: string;
  level: number;
}

interface XPContextType {
  totalXP: number;
  currentLevel: number;
  xpHistory: XPHistoryEntry[];
  addXP: (questTitle: string, xpAmount: number) => void;
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

export const XPProvider: React.FC<XPProviderProps> = ({ children }) => {
  const [totalXP, setTotalXP] = useState(0);
  const [xpHistory, setXPHistory] = useState<XPHistoryEntry[]>([]);

  // Calculate level based on XP (example progression curve)
  const calculateLevel = (xp: number) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  };

  const addXP = (questTitle: string, xpAmount: number) => {
    const newTotalXP = totalXP + xpAmount;
    const newLevel = calculateLevel(newTotalXP);
    
    setTotalXP(newTotalXP);
    setXPHistory(prev => [
      {
        questTitle,
        xpGained: xpAmount,
        timestamp: new Date().toISOString(),
        level: newLevel
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
    addXP
  };

  return <XPContext.Provider value={value}>{children}</XPContext.Provider>;
};
