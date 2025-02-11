import { QUEST_COMPLEXITY } from '../constants/gameConstants';

export type QuestComplexity = keyof typeof QUEST_COMPLEXITY;

export interface Quest {
  id: string;
  title: string;
  tasks: string[];
  complexity: QuestComplexity;
  xpReward: number;
  completed?: boolean;
  currentTask?: number;
  taskId?: string;
  timestamp?: number;
}

export interface QuestStep extends Quest {
  task: string;
  completed: boolean;
}
