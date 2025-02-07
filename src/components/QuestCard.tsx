import { useState } from 'react';
import type { QuestStep } from '../utils/StepParser';

interface QuestCardProps {
  quest: QuestStep;
  index: number;
}

export const QuestCard = ({ quest, index }: QuestCardProps) => {
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  
  const toggleTask = (taskIndex: number) => {
    const newCompletedTasks = new Set(completedTasks);
    if (completedTasks.has(taskIndex)) {
      newCompletedTasks.delete(taskIndex);
    } else {
      newCompletedTasks.add(taskIndex);
    }
    setCompletedTasks(newCompletedTasks);
  };

  const progress = (completedTasks.size / quest.tasks.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4 transform hover:scale-102 transition-transform duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{quest.title}</h2>
            <div className="flex items-center mt-1 space-x-4">
              {quest.questType && (
                <span className="text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                  {quest.questType}
                </span>
              )}
              {quest.difficulty && (
                <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {quest.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>
        {quest.xp && (
          <div className="flex items-center">
            <span className="text-yellow-600 dark:text-yellow-400 font-bold">
              +{quest.xp} XP
            </span>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-400">
                Quest Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-400">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {quest.tasks.map((task, taskIndex) => (
          <li key={taskIndex} className="flex items-center">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={completedTasks.has(taskIndex)}
                onChange={() => toggleTask(taskIndex)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className={`text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 ${
                completedTasks.has(taskIndex) ? 'line-through text-gray-400' : ''
              }`}>
                {task}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
