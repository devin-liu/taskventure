import { useState, useEffect } from 'react'
import { QuestInput } from './components/QuestInput'
import { QuestView } from './components/QuestView'
import { ApiKeyModal } from './components/ApiKeyModal'
import { Toast } from './components/Toast'
import { XPTracker } from './components/XPTracker'
import { TaskVentureLogo } from './components/TaskVentureLogo'
import { parseSteps } from './utils/StepParser'
import { generateGameQuests } from './utils/OpenRouterClient'
import { useApiKeys } from './hooks/useApiKeys'
import { useQuestStorage } from './hooks/useQuestStorage'
import { XPProvider } from './hooks/useXPTracker.tsx'
import { Analytics } from '@vercel/analytics/react'

const CURRENT_QUEST_INDEX_KEY = 'taskventure_current_quest_index';

interface ToastState {
  message: string;
  type: 'error' | 'success' | 'info';
}

type ViewState = 'input' | 'quest';

export default function App() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const { hasKeys, isModalOpen, openModal, closeModal, handleSaveKeys } = useApiKeys()
  const { quests, setQuests, questCompletion, saveQuestCompletion } = useQuestStorage()
  
  // Initialize view state based on whether there are existing quests
  const [viewState, setViewState] = useState<ViewState>(quests.length > 0 ? 'quest' : 'input')
  
  // Initialize currentQuestIndex from localStorage or default to 0
  const [currentQuestIndex, setCurrentQuestIndex] = useState(() => {
    const saved = localStorage.getItem(CURRENT_QUEST_INDEX_KEY);
    if (saved !== null) {
      const index = parseInt(saved, 10);
      // Ensure the loaded index is valid
      return index < quests.length ? index : 0;
    }
    return 0;
  });

  // Save currentQuestIndex to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CURRENT_QUEST_INDEX_KEY, currentQuestIndex.toString());
  }, [currentQuestIndex]);

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ message, type });
  };

  const handleLaunchQuest = async () => {
    if (!hasKeys) {
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

  const handleNewQuest = () => {
    setViewState('input');
    setInput('');
  };

  return (
    <XPProvider>
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* XP Tracker */}
        <XPTracker />
        
        {/* Header */}
        <header className="border-b border-amber-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
            <TaskVentureLogo width={32} height={32} className="hover:animate-logo-float" />
          </div>
        </header>

        <div className="container mx-auto py-8 px-4">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-pixel text-amber-900 dark:text-amber-400 mb-2">
              TaskVenture
            </h1>
            <p className="text-sm text-amber-800/80 dark:text-amber-400/80">
              Transform your coding tasks into epic quests
            </p>
          </header>

          {viewState === 'input' ? (
            <QuestInput
              input={input}
              setInput={setInput}
              onSubmit={handleLaunchQuest}
              isLoading={isLoading}
            />
          ) : (
            <QuestView
              quests={quests}
              currentQuestIndex={currentQuestIndex}
              questCompletion={questCompletion}
              onTaskToggle={handleTaskToggle}
              onNewQuest={handleNewQuest}
              onNext={handleNextQuest}
            />
          )}
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
      <Analytics />
    </XPProvider>
  )
}
