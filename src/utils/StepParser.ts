export interface QuestStep {
  title: string;
  tasks: string[];
  xp?: number;
  difficulty?: 'Intern' | 'Junior Dev' | 'Senior Dev' | 'Tech Lead' | 'Unicorn Status';
  questType?: 'Feature Quest' | 'Bug Hunt' | 'Refactor Mission' | 'DevOps Adventure' | 'Growth Hack';
  taskId?: string; // Group identifier for related quests
  timestamp?: number; // When the quest group was created
}

export function parseSteps(input: string): QuestStep[] {
  // Clean up markdown code blocks and any other formatting
  const cleanInput = input
    .replace(/```json\n/g, '') // Remove opening ```json
    .replace(/```\n?/g, '')    // Remove closing ```
    .trim();                   // Remove extra whitespace

  const steps = JSON.parse(cleanInput) as QuestStep[];
  const taskId = crypto.randomUUID();
  const timestamp = Date.now();
  
  // Add taskId and timestamp to each quest in the group
  return steps.map(step => ({
    ...step,
    taskId,
    timestamp
  }));
}
