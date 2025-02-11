import { useEffect, useState } from 'react';

interface QuestRewardsProps {
  show: boolean;
  onClose: () => void;
}

export const QuestRewards = ({ show, onClose }: QuestRewardsProps) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (show) {
      setShowReward(true);
      const baseXP = Math.floor(Math.random() * 50) + 50; // Random XP between 50-100
      let accumulatedXP = 0;
      
      const interval = setInterval(() => {
        if (accumulatedXP < baseXP) {
          accumulatedXP += 1;
          setXp(accumulatedXP);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setShowReward(false);
            onClose();
          }, 3000);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [show]);

  if (!showReward) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-parchment-50 dark:bg-gray-800 p-6 rounded-lg shadow-xl transform animate-rewards-popup">
        <div className="text-center">
          <h3 className="font-quest text-2xl text-amber-900 dark:text-amber-400 mb-4">
            Quest Rewards!
          </h3>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 animate-spin-slow flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-parchment-50 dark:bg-gray-800 flex items-center justify-center">
                  <span className="font-quest text-3xl text-amber-900 dark:text-amber-400">
                    {xp}
                  </span>
                </div>
              </div>
              <span className="absolute -top-2 -right-2 bg-amber-500 text-black px-2 py-1 rounded-full text-sm font-quest animate-bounce">
                XP
              </span>
            </div>
            <div className="text-amber-900 dark:text-amber-100 font-quest">
              Level {level}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
