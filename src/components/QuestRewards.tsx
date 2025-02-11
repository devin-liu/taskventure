import { useEffect, useState, useCallback, useRef } from 'react';
import { useXPTracker } from '../hooks/useXPTracker.tsx';

interface QuestRewardsProps {
  show: boolean;
  onClose: () => void;
  questTitle: string;
  onNext?: () => void;
  isLastQuest?: boolean;
}

export const QuestRewards = ({ show, onClose, questTitle, onNext, isLastQuest = false }: QuestRewardsProps) => {
  const [showReward, setShowReward] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isCountingComplete, setIsCountingComplete] = useState(false);
  const { addXP } = useXPTracker();
  const [currentXP, setCurrentXP] = useState(0);
  const targetXP = Math.floor(Math.random() * 50) + 50; // Random XP between 50-100
  const hasAddedXP = useRef(false);

  const startFadeOut = useCallback((force: boolean = false) => {
    if (!force && !isCountingComplete) return; // Only allow auto-dismiss after counting is complete
    if (isFading) return; // Prevent multiple fade-outs
    
    setIsFading(true);
    setTimeout(() => {
      setShowReward(false);
      onClose();
    }, 500);
  }, [isFading, isCountingComplete, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        startFadeOut(true); // Force close on ESC
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [startFadeOut]);

  useEffect(() => {
    let xpInterval: NodeJS.Timeout;
    let fadeTimeout: NodeJS.Timeout;

    if (show) {
      // Reset states when showing
      setShowReward(true);
      setIsFading(false);
      setCurrentXP(0);
      setIsCountingComplete(false);
      hasAddedXP.current = false;
      
      let accumulatedXP = 0;
      
      xpInterval = setInterval(() => {
        if (accumulatedXP < targetXP) {
          accumulatedXP += 1;
          setCurrentXP(accumulatedXP);
        } else {
          clearInterval(xpInterval);
          // Add XP to the global tracker only once
          if (!hasAddedXP.current) {
            addXP(questTitle, targetXP);
            hasAddedXP.current = true;
          }
          setIsCountingComplete(true);
          
          // Start fade out animation after 1.5s if not manually dismissed
          fadeTimeout = setTimeout(() => {
            startFadeOut();
          }, 1500);
        }
      }, 30);
    }

    // Cleanup function
    return () => {
      clearInterval(xpInterval);
      clearTimeout(fadeTimeout);
      setShowReward(false);
      setIsFading(false);
      setCurrentXP(0);
      setIsCountingComplete(false);
    };
  }, [show, targetXP, addXP, questTitle, startFadeOut]);

  if (!showReward) return null;

  return (
    // Add onClick handler to the overlay
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black/50 ${
        isFading ? 'animate-rewards-fadeout' : ''
      }`}
      onClick={startFadeOut}
    >
      {/* Add onClick with stopPropagation to prevent card clicks from closing */}
      <div 
        className={`bg-parchment-50 dark:bg-gray-800 p-6 rounded-lg shadow-xl transform ${
          isFading ? '' : 'animate-rewards-popup'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-quest text-2xl text-amber-900 dark:text-amber-400">
              Quest Rewards!
            </h3>
            <button
              onClick={() => startFadeOut(true)} // Force close on button click
              className="text-amber-900/50 dark:text-amber-400/50 hover:text-amber-900 dark:hover:text-amber-400 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Close rewards"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 animate-spin-slow flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-parchment-50 dark:bg-gray-800 flex items-center justify-center">
                  <span className="font-quest text-3xl text-amber-900 dark:text-amber-400">
                    {currentXP}
                  </span>
                </div>
              </div>
              <span className="absolute -top-2 -right-2 bg-amber-500 text-black px-2 py-1 rounded-full text-sm font-quest animate-bounce">
                XP
              </span>
            </div>
            <div className="text-center">
              <div className="text-sm text-amber-900/70 dark:text-amber-400/70 font-medium mb-1">
                Quest Complete:
              </div>
              <div className="text-amber-900 dark:text-amber-400 font-quest">
                {questTitle}
              </div>
            </div>
            {isCountingComplete && (
              <div className="flex flex-col items-center gap-3">
                {!isLastQuest && onNext && (
                  <button
                    onClick={() => {
                      onNext();
                      startFadeOut(true); // Force close on next quest
                    }}
                    className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black px-6 py-2 rounded-full text-sm font-quest hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 transition-colors duration-200"
                  >
                    Continue to Next Quest
                  </button>
                )}
                <div className="text-sm text-amber-900/70 dark:text-amber-400/70">
                  {isLastQuest ? "You've completed all quests!" : "Press ESC to close"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
