import { useState } from 'react'
import { QuestCard } from './components/QuestCard'
import { parseSteps } from './utils/StepParser'
import type { QuestStep } from './utils/StepParser'

function App() {
  const [input, setInput] = useState('')
  const [quests, setQuests] = useState<QuestStep[]>([])

  const handleLaunchQuest = () => {
    const parsedQuests = parseSteps(input)
    setQuests(parsedQuests)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Taskventure
        </h1>
        
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
            Launch Quest
          </button>
        </div>

        <div className="space-y-6">
          {quests.map((quest, index) => (
            <QuestCard key={index} quest={quest} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
