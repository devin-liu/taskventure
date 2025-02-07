import { useState, useEffect } from 'react';
import { getEnvVar } from '../config/env';

const STORAGE_KEY = 'taskventure_api_keys';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: { [key: string]: string }) => void;
}

export const ApiKeyModal = ({ isOpen, onClose, onSave }: ApiKeyModalProps) => {
  const [openRouterKey, setOpenRouterKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Try to load the key from multiple sources
      const loadSavedKey = () => {
        try {
          // First check localStorage
          const savedKeys = localStorage.getItem(STORAGE_KEY);
          if (savedKeys) {
            const parsedKeys = JSON.parse(savedKeys);
            if (parsedKeys.NEXT_PUBLIC_OPENROUTER_API_KEY) {
              setOpenRouterKey(parsedKeys.NEXT_PUBLIC_OPENROUTER_API_KEY);
              return;
            }
          }

          // Then check environment variable
          const envKey = getEnvVar('NEXT_PUBLIC_OPENROUTER_API_KEY');
          if (envKey) {
            setOpenRouterKey(envKey);
          }
        } catch (error) {
          console.error('Failed to load saved API key:', error);
        }
      };

      loadSavedKey();
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
      const keys = {
        NEXT_PUBLIC_OPENROUTER_API_KEY: openRouterKey.trim()
      };
      
      // Save to localStorage immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
      
      // Notify parent component
      onSave(keys);
      onClose();
    } catch (error) {
      console.error('Failed to save API key:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Configure API Keys</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OpenRouter API Key
            </label>
            <input
              type="password"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your OpenRouter API key"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get your API key from{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                OpenRouter
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!openRouterKey.trim()}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
              openRouterKey.trim() 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};
