import { useEffect, useState } from 'react';
import type { QuestStep } from '../utils/StepParser';

interface QuestCardProps {
  quest: QuestStep;
  index: number;
  completedTasks: Set<number>;
  onTaskToggle: (taskIndex: number) => void;
}

export const QuestCard = ({ quest, index, completedTasks, onTaskToggle }: QuestCardProps) => {
  const progress = (completedTasks.size / quest.tasks.length) * 100;

  return (
    <div className="relative bg-parchment-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-amber-200/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
      {/* RuneScape Quest Header */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 py-2 px-4 border-b border-amber-600/50">
        <div className="flex items-center justify-between">
          <h3 className="font-runescape text-black text-lg">
            Quest {index + 1}
          </h3>
          <span className="text-xs font-medium bg-black/10 rounded-full px-3 py-1">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      {/* Mission Title */}
      <div className="p-4 border-b border-amber-100 dark:border-gray-700">
        <h4 className="font-runescape text-xl text-amber-900 dark:text-amber-400">
          {quest.title}
        </h4>
      </div>

      {/* Task List */}
      <div className="p-4">
        <ul className="space-y-3">
          {quest.tasks.map((task, taskIndex) => (
            <li 
              key={taskIndex}
              onClick={() => onTaskToggle(taskIndex)}
              className="flex items-start space-x-3 group cursor-pointer"
            >
              {/* RuneScape-style Checkbox */}
              <div 
                className={`
                  flex-shrink-0 w-5 h-5 mt-0.5 border-2 rounded
                  ${completedTasks.has(taskIndex)
                    ? 'bg-amber-500 border-amber-600'
                    : 'border-amber-400/50 group-hover:border-amber-500'
                  }
                  transition-colors duration-200
                `}
              >
                {completedTasks.has(taskIndex) && (
                  <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Task Text */}
              <span 
                className={`
                  text-base
                  ${completedTasks.has(taskIndex)
                    ? 'text-amber-800/50 dark:text-amber-500/50 line-through'
                    : 'text-amber-900 dark:text-amber-100'
                  }
                  group-hover:text-amber-700 dark:group-hover:text-amber-300
                  transition-colors duration-200
                `}
              >
                {task}
              </span>
            </li>
          ))}
        </ul>

        {/* Quest Complete Banner */}
        {progress === 100 && (
          <div className="mt-6 text-center">
            <div className="inline-block bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black px-6 py-2 rounded-full text-sm font-runescape animate-quest-complete">
              Quest Complete!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
