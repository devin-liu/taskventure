import { getEnvVar } from '../config/env';

const STORAGE_KEY = 'taskventure_api_keys';

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
      role: string;
      refusal: null | string;
    };
  }[];
}

export const generateGameQuests = async (input: string): Promise<string> => {
  const savedKeys = localStorage.getItem(STORAGE_KEY);
  const OPENROUTER_API_KEY = savedKeys ? JSON.parse(savedKeys).NEXT_PUBLIC_OPENROUTER_API_KEY : null;
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  const systemMessage = {
    role: "system",
    content: "You are a fun and quirky game master that transforms boring tasks into exciting startup-themed quests. Use Silicon Valley humor and startup culture references. Return an array of quest objects in JSON format, where each quest has a title and an array of tasks. Add startup-themed emojis to titles."
  };

  const userPrompt = {
    role: "user",
    content: `Transform these tasks into fun startup-themed quests:

${input}

Return the quests in this JSON format:
[
  {
    "title": "Fun Startup-Themed Title 🚀",
    "tasks": [
      "Subtask with startup humor",
      "Another subtask",
      "More subtasks..."
    ]
  }
]`
  };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Taskventure'
      },
      body: JSON.stringify({
        model: 'openai/o1-mini',
        messages: [systemMessage, userPrompt],
        temperature: 0.9,
        max_tokens: 2000,
        presence_penalty: 0.5,
        frequency_penalty: 0.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to generate quests: ${errorData.error?.message || response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content || content.trim() === '') {
      throw new Error('The AI model returned an empty response. Please try again with a different task description.');
    }

    if (!content.includes('<step>')) {
      // If the model didn't use the correct format, try to format it ourselves
      const lines = content.split('\n').filter(line => line.trim());
      let formattedContent = '';
      let currentStep = [];
      
      for (let line of lines) {
        if (line.toLowerCase().includes('mission:') || line.match(/^[0-9]+\./)) {
          // If we have a previous step, close it
          if (currentStep.length > 0) {
            formattedContent += '<step>\n' + currentStep.join('\n') + '\n</step>\n\n';
            currentStep = [];
          }
          currentStep.push(line.replace(/^[0-9]+\./, 'Mission:'));
        } else if (line.trim().startsWith('-')) {
          currentStep.push(line);
        }
      }
      
      // Add the last step
      if (currentStep.length > 0) {
        formattedContent += '<step>\n' + currentStep.join('\n') + '\n</step>\n';
      }
      
      return formattedContent || content; // Fall back to original content if formatting fails
    }
    
    return content;
  } catch (error) {
    console.error('Failed to generate quests:', error);
    throw error;
  }
};
