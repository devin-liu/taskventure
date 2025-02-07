import { useState } from 'react'
import { QuestCard } from './components/QuestCard'
import { QuestInput } from './components/QuestInput'
import { QuestView } from './components/QuestView'
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

type ViewState = 'input' | 'quest';

function App() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const { apiKeys, hasKeys, isModalOpen, openModal, closeModal, handleSaveKeys } = useApiKeys()
  const { quests, setQuests, questCompletion, saveQuestCompletion } = useQuestStorage()
  
  // Initialize view state based on whether there are existing quests
  const [viewState, setViewState] = useState<ViewState>(quests.length > 0 ? 'quest' : 'input')
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0)

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
      
      // Clear input and switch to quest view
      setInput('');
      setCurrentQuestIndex(updatedQuests.length - parsedQuests.length);
      setViewState('quest');
      
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

  const handleNextQuest = () => {
    if (currentQuestIndex < quests.length - 1) {
      setCurrentQuestIndex(currentQuestIndex + 1);
    }
  };

  const handlePreviousQuest = () => {
    if (currentQuestIndex > 0) {
      setCurrentQuestIndex(currentQuestIndex - 1);
    }
  };

  const handleNewQuest = () => {
    setViewState('input');
    setInput('');
  };

  return (
    <div className="min-h-screen bg-parchment-100 dark:bg-gray-900">
      {/* App Header */}
      <div className="bg-gradient-to-b from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 py-4 px-4 shadow-md border-b-4 border-amber-700/50">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/scroll.svg" alt="Scroll" className="w-8 h-8" />
              <h1 className="font-quest text-3xl text-black dark:text-white">
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
        {viewState === 'input' ? (
          <QuestInput
            input={input}
            onInputChange={setInput}
            onSubmit={handleLaunchQuest}
            isLoading={isLoading}
            hasKeys={hasKeys}
          />
        ) : quests.length > 0 ? (
          <QuestView
            quests={quests}
            currentQuestIndex={currentQuestIndex}
            questCompletion={questCompletion}
            onTaskToggle={handleTaskToggle}
            onNext={handleNextQuest}
            onPrevious={handlePreviousQuest}
            onNewQuest={handleNewQuest}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-amber-900/70 dark:text-amber-100/70">
              No quests available. Start your adventure by creating a new quest!
            </p>
            <button
              onClick={handleNewQuest}
              className="mt-4 px-6 py-2 bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 rounded-lg font-quest transition-colors duration-200"
            >
              Create New Quest
            </button>
          </div>
        )}
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
