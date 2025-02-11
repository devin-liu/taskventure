import { useState } from 'react';
import { useXPTracker } from '../hooks/useXPTracker.tsx';

export const XPTracker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalXP, currentLevel, xpHistory, xpToNextLevel, percentToNextLevel } = useXPTracker();

  return (
    <>
      {/* Persistent XP Indicator */}
      <div 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 flex items-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 px-4 py-2 rounded-full cursor-pointer hover:scale-105 transition-transform shadow-lg"
      >
        <div className="flex flex-col items-end">
          <span className="text-black font-quest text-sm">Level {currentLevel}</span>
          <div className="flex items-center gap-1">
            <span className="text-black/70 text-xs">{totalXP.toLocaleString()} XP</span>
            <span className="text-black/50 text-xs">•</span>
            <span className="text-black/70 text-xs">{percentToNextLevel}%</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
          <span className="font-quest text-black">XP</span>
        </div>
      </div>

      {/* Full Dashboard Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-parchment-50 dark:bg-gray-800 w-full max-w-2xl max-h-[80vh] rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 p-4 flex justify-between items-center">
              <h2 className="font-quest text-2xl text-black">Adventure Stats</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-black/70 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* Current Stats */}
            <div className="p-6 border-b border-amber-200/50 dark:border-gray-700">
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <h3 className="font-quest text-xl text-amber-900 dark:text-amber-400">Current Level</h3>
                  <div className="text-4xl font-quest text-amber-900 dark:text-amber-400">
                    {currentLevel}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-quest text-xl text-amber-900 dark:text-amber-400">Total XP</h3>
                  <div className="text-4xl font-quest text-amber-900 dark:text-amber-400">
                    {totalXP.toLocaleString()}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-quest text-xl text-amber-900 dark:text-amber-400">Progress</h3>
                  <div className="mt-2">
                    <div className="h-4 bg-amber-200/50 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-300 ease-out"
                        style={{ width: `${percentToNextLevel}%` }}
                      />
                    </div>
                    <div className="text-sm text-amber-900/70 dark:text-amber-400/70 mt-1">
                      {xpToNextLevel.toLocaleString()} XP to level {currentLevel < 99 ? currentLevel + 1 : 'MAX'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* History List */}
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              <h3 className="font-quest text-xl text-amber-900 dark:text-amber-400 mb-4">Quest History</h3>
              <div className="space-y-4">
                {xpHistory.map((entry, index) => (
                  <div 
                    key={index}
                    className="bg-amber-50 dark:bg-gray-700/50 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-quest text-amber-900 dark:text-amber-400">
                        {entry.questTitle}
                      </div>
                      <div className="text-sm text-amber-900/70 dark:text-amber-400/70">
                        {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-amber-900/70 dark:text-amber-400/70 text-sm">
                        {entry.complexity}
                      </div>
                      <div className="bg-amber-500/10 px-3 py-1 rounded-full">
                        <span className="font-quest text-amber-900 dark:text-amber-400">
                          +{entry.xpGained.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
