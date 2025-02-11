export interface QuestStep {
  title: string;
  tasks: string[];
  xp?: number;
  difficulty?: 'Intern' | 'Junior Dev' | 'Senior Dev' | 'Tech Lead' | 'Unicorn Status';
  questType?: 'Feature Quest' | 'Bug Hunt' | 'Refactor Mission' | 'DevOps Adventure' | 'Growth Hack';
  taskId?: string; // Group identifier for related quests
  timestamp?: number; // When the quest group was created
}

const generateQuestMetadata = (title: string): Pick<QuestStep, 'xp' | 'difficulty' | 'questType'> => {
  // Generate XP based on task complexity (determined by keywords)
  const complexityKeywords = ['create', 'develop', 'implement', 'design', 'architect'];
  const xpBase = 100;
  const xp = xpBase + (complexityKeywords.some(keyword => 
    title.toLowerCase().includes(keyword)) ? 50 : 0);

  // Determine difficulty based on task keywords
  const difficultyMap = {
    'setup': 'Intern',
    'create': 'Junior Dev',
    'implement': 'Senior Dev',
    'architect': 'Tech Lead',
    'optimize': 'Unicorn Status'
  } as const;

  let difficulty: QuestStep['difficulty'] = 'Junior Dev';
  for (const [keyword, level] of Object.entries(difficultyMap)) {
    if (title.toLowerCase().includes(keyword)) {
      difficulty = level as QuestStep['difficulty'];
      break;
    }
  }

  // Determine quest type based on keywords
  const questTypeMap = {
    'bug': 'Bug Hunt',
    'feature': 'Feature Quest',
    'refactor': 'Refactor Mission',
    'deploy': 'DevOps Adventure',
    'growth': 'Growth Hack'
  } as const;

  let questType: QuestStep['questType'] = 'Feature Quest';
  for (const [keyword, type] of Object.entries(questTypeMap)) {
    if (title.toLowerCase().includes(keyword)) {
      questType = type as QuestStep['questType'];
      break;
    }
  }

  return { xp, difficulty, questType };
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
