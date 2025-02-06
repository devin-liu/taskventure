import { useState } from 'react'
import { QuestCard } from './components/QuestCard'
import { ApiKeyModal } from './components/ApiKeyModal'
import { parseSteps } from './utils/StepParser'
import { useApiKeys } from './hooks/useApiKeys'
import type { QuestStep } from './utils/StepParser'

function App() {
  const [input, setInput] = useState('')
  const [quests, setQuests] = useState<QuestStep[]>([])
  const { apiKeys, hasKeys, isModalOpen, openModal, closeModal, handleSaveKeys } = useApiKeys()

  const handleLaunchQuest = () => {
    if (!hasKeys) {
      openModal()
      return
    }
    const parsedQuests = parseSteps(input)
    setQuests(parsedQuests)
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
            placeholder="Enter your quest steps using <step>...</step> blocks"
            className="w-full h-48 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleLaunchQuest}
            className="mt-4 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
          >
            {hasKeys ? 'Launch Quest' : 'Configure API Keys to Start'}
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
    </div>
  )
}

export default App
