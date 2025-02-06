export interface QuestStep {
  title: string;
  tasks: string[];
}

export const parseSteps = (input: string): QuestStep[] => {
  const stepRegex = /<step>([\s\S]*?)<\/step>/g;
  const steps: QuestStep[] = [];
  let match;

  while ((match = stepRegex.exec(input)) !== null) {
    const content = match[1].trim();
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    // First non-empty line is the title
    const title = lines[0];
    // Remaining lines are tasks
    const tasks = lines.slice(1);

    steps.push({
      title,
      tasks
    });
  }

  return steps;
};
