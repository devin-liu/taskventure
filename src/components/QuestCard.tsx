import { useEffect, useState, useRef } from 'react';
import type { Quest, QuestStep } from '../types/quest';
import { QuestRewards } from './QuestRewards';
import { QUEST_COMPLEXITY } from '../constants/gameConstants';

interface QuestCardProps {
  quest: Quest;
  index: number;
  completedTasks: Set<number>;
  onTaskToggle: (taskIndex: number) => void;
  onNext?: () => void;
  isLastQuest?: boolean;
}

export const QuestCard = ({ quest, index, completedTasks, onTaskToggle, onNext, isLastQuest = false }: QuestCardProps) => {
  const progress = (completedTasks.size / quest.tasks.length) * 100;
  const [showRewards, setShowRewards] = useState(false);
  const isInitialRender = useRef(true);
  const hasShownRewardsForCompletion = useRef(false);

  useEffect(() => {
    // Only show rewards if this isn't the initial render and progress just hit 100%
    if (!isInitialRender.current && progress === 100 && !hasShownRewardsForCompletion.current) {
      setShowRewards(true);
      hasShownRewardsForCompletion.current = true;
    }
    
    // After initial render, mark it as done
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }

    // Reset rewards state and tracking when progress changes to non-100%
    if (progress !== 100) {
      setShowRewards(false);
      hasShownRewardsForCompletion.current = false;
    }
  }, [progress]);

  return (
    <div className="bg-parchment-50 dark:bg-gray-800 rounded-lg p-6 shadow-lg relative overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-amber-200/50 dark:bg-gray-700 w-full">
        <div 
          className="h-full bg-amber-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Quest header */}
      <div className="mb-4">
        <h3 className="text-xl font-quest text-amber-900 dark:text-amber-400">
          {quest.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={`
            px-2 py-0.5 rounded text-xs font-medium
            ${quest.complexity === 'TRIVIAL' ? 'bg-gray-100 text-gray-700' :
              quest.complexity === 'EASY' ? 'bg-green-100 text-green-700' :
              quest.complexity === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
              quest.complexity === 'HARD' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'}
          `}>
            {quest.complexity}
          </span>
          <span className="text-sm text-amber-900/70 dark:text-amber-400/70">
            {completedTasks.size}/{quest.tasks.length} tasks
          </span>
          <span className="ml-auto px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1">
            <span className="font-quest">+{quest.xpReward.toLocaleString()}</span>
            <span className="opacity-75">XP</span>
          </span>
        </div>
      </div>

      <div className="p-4 border-b border-amber-100 dark:border-gray-700">
        <ul className="space-y-4">
          {quest.tasks.map((task, taskIndex) => (
            <li
              key={taskIndex}
              className="flex items-start gap-3 group hover:bg-amber-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={completedTasks.has(taskIndex)}
                onChange={() => onTaskToggle(taskIndex)}
                className="mt-1 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className={`text-amber-900 dark:text-amber-100 ${
                completedTasks.has(taskIndex) ? 'line-through opacity-50' : ''
              }`}>
                {task}
              </span>
            </li>
          ))}
        </ul>

        {progress === 100 && (
          <div className="mt-6 text-center">
            <div className="inline-block bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black px-6 py-2 rounded-full text-sm font-quest animate-quest-complete">
              Quest Complete!
            </div>
          </div>
        )}
      </div>

      {/* Quest rewards modal */}
      {showRewards && (
        <QuestRewards
          show={showRewards}
          onClose={() => setShowRewards(false)}
          questTitle={quest.title}
          complexity={quest.complexity}
          xpReward={quest.xpReward}
          onNext={onNext}
          isLastQuest={isLastQuest}
        />
      )}
    </div>
  );
};
