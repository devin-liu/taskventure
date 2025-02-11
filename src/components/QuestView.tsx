import { QuestCard } from './QuestCard';

interface QuestViewProps {
  quests: any[];
  currentQuestIndex: number;
  questCompletion: { [key: string]: Set<number> };
  onTaskToggle: (questIndex: number, taskIndex: number) => void;
  onNext: () => void;
  onNewQuest: () => void;
}

export const QuestView = ({
  quests,
  currentQuestIndex,
  questCompletion,
  onTaskToggle,
  onNext,
  onNewQuest,
}: QuestViewProps) => {
  const currentQuest = quests[currentQuestIndex];
  const isLastQuest = currentQuestIndex === quests.length - 1;
  const completedTasks = questCompletion[`quest-${currentQuestIndex}`] || new Set();

  // Get all quests from the same task
  const relatedQuests = quests.filter(q => q.taskId === currentQuest.taskId);
  const currentTaskQuestIndex = relatedQuests.findIndex(q => q.title === currentQuest.title);
  
  // Format the timestamp
  const taskDate = currentQuest.timestamp 
    ? new Date(currentQuest.timestamp).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    : '';

  const handleTaskToggle = (taskIndex: number) => {
    onTaskToggle(currentQuestIndex, taskIndex);
  };

  const handleNextQuest = () => {
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto animate-quest-appear">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex flex-col">
          <span className="text-amber-900/70 dark:text-amber-100/70 text-sm font-medium">
            Quest {currentTaskQuestIndex + 1} of {relatedQuests.length}
            {isLastQuest && currentTaskQuestIndex === relatedQuests.length - 1 && " • Final Quest"}
          </span>
          {taskDate && (
            <span className="text-amber-900/50 dark:text-amber-100/50 text-xs">
              Created {taskDate}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewQuest}
            className="px-4 py-2 rounded-lg font-quest text-sm bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 transition-colors duration-200"
          >
            New Quest
          </button>
        </div>
      </div>

      {/* Current Quest */}
      <QuestCard
        quest={currentQuest}
        completedTasks={completedTasks}
        onTaskToggle={handleTaskToggle}
        onNext={handleNextQuest}
        isLastQuest={isLastQuest}
      />
    </div>
  );
};
