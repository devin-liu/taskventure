import { useState } from 'react'
import { QuestCard } from './components/QuestCard'
import { ApiKeyModal } from './components/ApiKeyModal'
import { Toast } from './components/Toast'
import { parseSteps } from './utils/StepParser'
import { generateGameQuests } from './utils/OpenRouterClient'
import { useApiKeys } from './hooks/useApiKeys'
import { useQuestStorage } from './hooks/useQuestStorage'
import type { QuestStep } from './utils/StepParser'

const STORAGE_KEY = 'taskventure_api_keys';

interface ToastState {
  message: string;
  type: 'error' | 'success' | 'info';
}

function App() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const { apiKeys, hasKeys, isModalOpen, openModal, closeModal, handleSaveKeys } = useApiKeys()
  const { quests, setQuests, questCompletion, saveQuestCompletion } = useQuestStorage()

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ message, type });
  };

  const handleLaunchQuest = async () => {
    const savedKeys = localStorage.getItem(STORAGE_KEY);
    const apiKey = savedKeys ? JSON.parse(savedKeys).NEXT_PUBLIC_OPENROUTER_API_KEY : null;
    
    if (!apiKey) {
      showToast('Please configure your OpenRouter API key first', 'error');
      openModal();
      return;
    }

    if (!input.trim()) {
      showToast('Please enter some tasks to transform', 'error');
      return;
    }

    try {
      setIsLoading(true)
      const gamifiedQuests = await generateGameQuests(input)
      const parsedQuests = parseSteps(gamifiedQuests)
      
      // Add new quests to existing ones
      const updatedQuests = [...quests, ...parsedQuests];
      setQuests(updatedQuests);
      
      // Clear input after successful generation
      setInput('');
      showToast('Successfully generated your epic quests!', 'success');
    } catch (error) {
      console.error('Failed to generate quests:', error)
      showToast(error instanceof Error ? error.message : 'Failed to generate quests', 'error');
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskToggle = (questIndex: number, taskIndex: number) => {
    const questId = `quest-${questIndex}`;
    const currentCompleted = questCompletion[questId] || new Set();
    const newCompleted = new Set(currentCompleted);

    if (newCompleted.has(taskIndex)) {
      newCompleted.delete(taskIndex);
    } else {
      newCompleted.add(taskIndex);
    }

    saveQuestCompletion(questId, newCompleted);
  };

  return (
    <div className="min-h-screen bg-parchment-100 dark:bg-gray-900">
      {/* RuneScape-style Header */}
      <div className="bg-gradient-to-b from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 py-4 px-4 shadow-md border-b-4 border-amber-700/50">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/scroll.svg" alt="Scroll" className="w-8 h-8" />
              <h1 className="font-runescape text-3xl text-black dark:text-white">
                Taskventure
              </h1>
            </div>
            <button
              onClick={openModal}
              className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Configure API Key
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto py-8 px-4">
        {/* Input Area */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-amber-200/50 dark:border-gray-700 shadow-sm">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 py-2 px-4 border-b border-amber-600/50">
            <h2 className="font-runescape text-black text-lg">New Quest</h2>
          </div>
          
          <div className="p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your tasks in plain text. We'll transform them into epic quests!"
              className="w-full h-32 p-4 rounded-lg bg-parchment-50 dark:bg-gray-900 text-amber-900 dark:text-amber-100 border border-amber-200/50 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all duration-200 placeholder-amber-700/50 dark:placeholder-amber-400/50"
            />
            <button
              onClick={handleLaunchQuest}
              disabled={isLoading}
              className={`
                mt-4 w-full py-3 px-6 rounded-lg font-runescape text-base
                transition-all duration-200
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : hasKeys 
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-black shadow-sm hover:shadow' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }
              `}
            >
              {isLoading 
                ? 'Summoning Epic Quests...' 
                : hasKeys 
                  ? 'Begin Your Quest' 
                  : 'Configure API Key to Begin Your Journey'}
            </button>
          </div>
        </div>

        {/* Quest List */}
        <div className="space-y-6">
          {quests.map((quest, index) => (
            <QuestCard 
              key={index} 
              quest={quest} 
              index={index}
              completedTasks={questCompletion[`quest-${index}`] || new Set()}
              onTaskToggle={(taskIndex) => handleTaskToggle(index, taskIndex)}
            />
          ))}
        </div>
      </main>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveKeys}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default App
