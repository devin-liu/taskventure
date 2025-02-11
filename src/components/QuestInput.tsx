import React from 'react';

interface QuestInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const QuestInput = ({ input, setInput, onSubmit, isLoading }: QuestInputProps) => {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-amber-200/50 dark:border-gray-700 shadow-sm animate-quest-appear">
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 py-2 px-4 border-b border-amber-600/50">
        <h2 className="font-quest text-black text-lg">Begin Your Adventure</h2>
      </div>
      
      <div className="p-6">
        <p className="text-amber-900/70 dark:text-amber-100/70 mb-4 text-sm">
          Share your tasks, and watch as they transform into an epic quest line!
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your tasks in plain text. We'll transform them into epic quests!"
          className="w-full h-32 p-4 rounded-lg bg-parchment-50 dark:bg-gray-900 text-amber-900 dark:text-amber-100 border border-amber-200/50 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all duration-200 placeholder-amber-700/50 dark:placeholder-amber-400/50"
        />
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={`
            mt-4 w-full py-3 px-6 rounded-lg font-quest text-base
            transition-all duration-200
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-black shadow-sm hover:shadow'
            }
          `}
        >
          {isLoading ? 'Summoning Epic Quests...' : 'Begin Your Quest'}
        </button>
      </div>
    </div>
  );
};
