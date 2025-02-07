import { useState, useEffect } from 'react';
import type { QuestStep } from '../utils/StepParser';

const QUESTS_STORAGE_KEY = 'taskventure_quests';
const QUEST_COMPLETION_KEY = 'taskventure_quest_completion';

interface QuestCompletion {
  [questId: string]: Set<number>;
}

export const useQuestStorage = () => {
  const [quests, setQuests] = useState<QuestStep[]>([]);
  const [questCompletion, setQuestCompletion] = useState<QuestCompletion>({});

  // Load quests and completion status from localStorage on mount
  useEffect(() => {
    const savedQuests = localStorage.getItem(QUESTS_STORAGE_KEY);
    const savedCompletion = localStorage.getItem(QUEST_COMPLETION_KEY);

    if (savedQuests) {
      setQuests(JSON.parse(savedQuests));
    }

    if (savedCompletion) {
      // Convert the saved completion data back to Sets
      const parsedCompletion = JSON.parse(savedCompletion);
      const completionWithSets = Object.entries(parsedCompletion).reduce(
        (acc, [questId, completedTasks]) => ({
          ...acc,
          [questId]: new Set(completedTasks),
        }),
        {}
      );
      setQuestCompletion(completionWithSets);
    }
  }, []);

  // Save quests to localStorage whenever they change
  const saveQuests = (newQuests: QuestStep[]) => {
    setQuests(newQuests);
    localStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(newQuests));
  };

  // Save completion status to localStorage
  const saveQuestCompletion = (questId: string, completedTasks: Set<number>) => {
    const newCompletion = {
      ...questCompletion,
      [questId]: completedTasks,
    };
    setQuestCompletion(newCompletion);

    // Convert Sets to arrays for JSON storage
    const completionForStorage = Object.entries(newCompletion).reduce(
      (acc, [id, tasks]) => ({
        ...acc,
        [id]: Array.from(tasks),
      }),
      {}
    );
    localStorage.setItem(QUEST_COMPLETION_KEY, JSON.stringify(completionForStorage));
  };

  return {
    quests,
    setQuests: saveQuests,
    questCompletion,
    saveQuestCompletion,
  };
};
