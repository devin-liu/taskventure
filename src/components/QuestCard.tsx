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
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 py-2 px-4 border-b border-amber-600/50">
        <div className="flex items-center justify-between">
          <h3 className="font-quest text-black text-lg">
            Quest {index + 1}
          </h3>
          <span className="text-xs font-medium bg-black/10 rounded-full px-3 py-1">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      <div className="p-4 border-b border-amber-100 dark:border-gray-700">
        <h4 className="font-quest text-2xl text-amber-900 dark:text-amber-400 leading-tight">
          {quest.title}
        </h4>
      </div>

      <div className="p-4">
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
    </div>
  );
};
