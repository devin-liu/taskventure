import { QuestComplexity } from '../constants/gameConstants';

export type QuestComplexity = keyof typeof QuestComplexity;

export interface Quest {
  id: string;
  title: string;
  tasks: string[];
  complexity: QuestComplexity;
  xpReward: number;
  completed?: boolean;
  currentTask?: number;
}

export interface QuestStep {
  id: string;
  task: string;
  completed: boolean;
}
