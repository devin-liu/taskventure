import React from 'react';
import { QuestCard } from './QuestCard';
import type { QuestStep } from '../utils/StepParser';

interface QuestViewProps {
  quests: QuestStep[];
  currentQuestIndex: number;
  questCompletion: { [key: string]: Set<number> };
  onTaskToggle: (questIndex: number, taskIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onNewQuest: () => void;
}

export const QuestView = ({
  quests,
  currentQuestIndex,
  questCompletion,
  onTaskToggle,
  onNext,
  onPrevious,
  onNewQuest,
}: QuestViewProps) => {
  const currentQuest = quests[currentQuestIndex];
  const isLastQuest = currentQuestIndex === quests.length - 1;
  const isFirstQuest = currentQuestIndex === 0;
  const completedTasks = questCompletion[`quest-${currentQuestIndex}`] || new Set();
  const progress = (completedTasks.size / currentQuest.tasks.length) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-quest-appear">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onPrevious}
            disabled={isFirstQuest}
            className={`
              px-4 py-2 rounded-lg font-quest text-sm
              ${isFirstQuest
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-amber-500/10 text-amber-900 hover:bg-amber-500/20'
              }
              transition-colors duration-200
            `}
          >
            Previous Quest
          </button>
          <span className="text-amber-900/50 dark:text-amber-100/50 text-sm">
            Quest {currentQuestIndex + 1} of {quests.length}
          </span>
        </div>
        <button
          onClick={onNewQuest}
          className="px-4 py-2 rounded-lg font-quest text-sm bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 transition-colors duration-200"
        >
          New Quest
        </button>
      </div>

      {/* Current Quest */}
      <QuestCard
        quest={currentQuest}
        index={currentQuestIndex}
        completedTasks={completedTasks}
        onTaskToggle={(taskIndex) => onTaskToggle(currentQuestIndex, taskIndex)}
      />

      {/* Next Quest Button */}
      {progress === 100 && !isLastQuest && (
        <div className="mt-6 text-center">
          <button
            onClick={onNext}
            className="inline-block bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black px-6 py-2 rounded-full text-sm font-quest hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 transition-colors duration-200"
          >
            Continue to Next Quest
          </button>
        </div>
      )}
    </div>
  );
};
