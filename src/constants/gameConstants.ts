export const QUEST_COMPLEXITY = {
  TRIVIAL: { multiplier: 1, baseXP: 50 },
  EASY: { multiplier: 2, baseXP: 100 },
  MEDIUM: { multiplier: 3, baseXP: 250 },
  HARD: { multiplier: 4, baseXP: 500 },
  MASTER: { multiplier: 5, baseXP: 1000 }
} as const;

export type QuestComplexity = keyof typeof QUEST_COMPLEXITY;
