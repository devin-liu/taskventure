import { useEffect, useState, useCallback, useRef } from 'react';
import { useXPTracker } from '../hooks/useXPTracker';
import { QuestComplexity } from '../constants/gameConstants';

interface QuestRewardsProps {
  show: boolean;
  onClose: () => void;
  questTitle: string;
  complexity: QuestComplexity;
  xpReward: number;
  onNext?: () => void;
  isLastQuest?: boolean;
}

export const QuestRewards = ({ 
  show, 
  onClose, 
  questTitle, 
  complexity,
  xpReward,
  onNext, 
  isLastQuest = false 
}: QuestRewardsProps) => {
  const [showReward, setShowReward] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isCountingComplete, setIsCountingComplete] = useState(false);
  const { addXP } = useXPTracker();
  const [currentXP, setCurrentXP] = useState(0);
  const targetXP = xpReward;
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
            addXP(questTitle, complexity, targetXP);
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
  }, [show, targetXP, addXP, questTitle, complexity, startFadeOut]);

  if (!showReward) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black/50 ${
        isFading ? 'animate-rewards-fadeout' : ''
      }`}
      onClick={startFadeOut}
    >
      <div 
        className="bg-parchment-50 dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full transform scale-100 animate-rewards-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-quest text-amber-900 dark:text-amber-400 mb-6 text-center">
          Quest Complete!
        </h2>
        
        <div className="text-center mb-8">
          <div className="text-lg font-quest text-amber-900 dark:text-amber-400">
            {questTitle}
          </div>
          <div className="text-sm text-amber-900/70 dark:text-amber-400/70 mt-1">
            {complexity} Difficulty
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-500/10 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-quest text-amber-900 dark:text-amber-400">Experience Gained:</span>
              <span className="font-quest text-amber-900 dark:text-amber-400">
                +{currentXP} XP
              </span>
            </div>
            <div className="h-2 bg-amber-200/50 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-300 ease-out"
                style={{ width: `${(currentXP / targetXP) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {isCountingComplete && !isLastQuest && (
          <button
            onClick={() => {
              if (onNext) {
                startFadeOut();
                setTimeout(onNext, 500);
              }
            }}
            className="mt-6 w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-quest transition-colors"
          >
            Next Quest
          </button>
        )}
      </div>
    </div>
  );
};
