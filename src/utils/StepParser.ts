export interface QuestStep {
  title: string;
  tasks: string[];
  xp?: number;
  difficulty?: 'Intern' | 'Junior Dev' | 'Senior Dev' | 'Tech Lead' | 'Unicorn Status';
  questType?: 'Feature Quest' | 'Bug Hunt' | 'Refactor Mission' | 'DevOps Adventure' | 'Growth Hack';
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

export const parseSteps = (input: string): QuestStep[] => {
  const stepRegex = /<step>([\s\S]*?)<\/step>/g;
  const steps: QuestStep[] = [];
  let match;

  while ((match = stepRegex.exec(input)) !== null) {
    const content = match[1].trim();
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) continue;

    // First non-empty line is the title
    const title = lines[0];
    // Remaining lines are tasks
    const tasks = lines.slice(1).map(task => task.startsWith('- ') ? task.slice(2) : task);

    // Generate quest metadata
    const metadata = generateQuestMetadata(title);

    steps.push({
      title,
      tasks,
      ...metadata
    });
  }

  return steps;
};
