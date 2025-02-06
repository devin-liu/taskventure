import { useState, useEffect } from 'react';

export interface ApiKeys {
  openai?: string;
  openrouter?: string;
}

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: ApiKeys) => void;
}

export const ApiKeyModal = ({ isOpen, onClose, onSave }: ApiKeyModalProps) => {
  const [keys, setKeys] = useState<ApiKeys>({
    openai: '',
    openrouter: ''
  });

  useEffect(() => {
    // Load saved keys from localStorage when modal opens
    if (isOpen) {
      const savedKeys = localStorage.getItem('api_keys');
      if (savedKeys) {
        setKeys(JSON.parse(savedKeys));
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('api_keys', JSON.stringify(keys));
    onSave(keys);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          API Keys Configuration
        </h2>
        
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="openai-key" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              OpenAI API Key
            </label>
            <input
              id="openai-key"
              type="password"
              value={keys.openai || ''}
              onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              placeholder="sk-..."
            />
          </div>

          <div>
            <label 
              htmlFor="openrouter-key" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              OpenRouter API Key
            </label>
            <input
              id="openrouter-key"
              type="password"
              value={keys.openrouter || ''}
              onChange={(e) => setKeys({ ...keys, openrouter: e.target.value })}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
              placeholder="sk-or-..."
            />
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Save Keys
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Your API keys are stored securely in your browser's local storage and are never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
};
