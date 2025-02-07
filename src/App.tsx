import { useState } from 'react'
import { QuestCard } from './components/QuestCard'
import { ApiKeyModal } from './components/ApiKeyModal'
import { Toast } from './components/Toast'
import { parseSteps } from './utils/StepParser'
import { generateGameQuests } from './utils/OpenRouterClient'
import { useApiKeys } from './hooks/useApiKeys'
import type { QuestStep } from './utils/StepParser'

const STORAGE_KEY = 'taskventure_api_keys';

interface ToastState {
  message: string;
  type: 'error' | 'success' | 'info';
}

function App() {
  const [input, setInput] = useState('')
  const [quests, setQuests] = useState<QuestStep[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const { apiKeys, hasKeys, isModalOpen, openModal, closeModal, handleSaveKeys } = useApiKeys()

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
      // Generate gamified quests from plain text input
      const gamifiedQuests = await generateGameQuests(input)
      // Parse the generated quest steps
      const parsedQuests = parseSteps(gamifiedQuests)
      setQuests(parsedQuests)
      showToast('Successfully generated your epic quests!', 'success');
    } catch (error) {
      console.error('Failed to generate quests:', error)
      showToast(error instanceof Error ? error.message : 'Failed to generate quests', 'error');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Taskventure
          </h1>
          <button
            onClick={openModal}
            className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Configure API Keys
          </button>
        </div>
        
        <div className="mb-8">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your tasks in plain text. We'll transform them into epic startup quests!"
            className="w-full h-48 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleLaunchQuest}
            disabled={isLoading}
            className={`mt-4 w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isLoading 
              ? 'Generating Epic Quests...' 
              : hasKeys 
                ? 'Transform into Quests' 
                : 'Configure API Keys to Start'}
          </button>
        </div>

        <div className="space-y-6">
          {quests.map((quest, index) => (
            <QuestCard key={index} quest={quest} index={index} />
          ))}
        </div>
      </div>

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
