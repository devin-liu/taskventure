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
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
          {index + 1}
        </div>
        <h2 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">{quest.title}</h2>
      </div>
      
      <div className="mb-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-2">
        {quest.tasks.map((task, taskIndex) => (
          <li key={taskIndex} className="flex items-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={completedTasks.has(taskIndex)}
                onChange={() => toggleTask(taskIndex)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className={`text-gray-700 dark:text-gray-300 ${
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
