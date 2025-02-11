import { useState, useCallback, useEffect } from 'react';
import { setEnvVar } from '../config/env';

interface ApiKeys {
  [key: string]: string;
}

const STORAGE_KEY = 'taskventure_api_keys';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasKeys, setHasKeys] = useState(false);

  // Load API keys from localStorage on initial mount
  useEffect(() => {
    const loadApiKeys = () => {
      try {
        const savedKeys = localStorage.getItem(STORAGE_KEY);
        if (savedKeys) {
          const parsedKeys = JSON.parse(savedKeys);
          setApiKeys(parsedKeys);
          
          // Set environment variable if key exists
          if (parsedKeys.NEXT_PUBLIC_OPENROUTER_API_KEY) {
            setEnvVar('NEXT_PUBLIC_OPENROUTER_API_KEY', parsedKeys.NEXT_PUBLIC_OPENROUTER_API_KEY);
            setHasKeys(true);
          }
        }
      } catch (error) {
        console.error('Failed to load API keys from localStorage:', error);
      }
    };

    loadApiKeys();
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSaveKeys = useCallback((newKeys: ApiKeys) => {
    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newKeys));
      
      // Update state
      setApiKeys(newKeys);
      setHasKeys(!!newKeys.NEXT_PUBLIC_OPENROUTER_API_KEY);
      
      // Update environment variable
      if (newKeys.NEXT_PUBLIC_OPENROUTER_API_KEY) {
        setEnvVar('NEXT_PUBLIC_OPENROUTER_API_KEY', newKeys.NEXT_PUBLIC_OPENROUTER_API_KEY);
      }
    } catch (error) {
      console.error('Failed to save API keys:', error);
      throw new Error('Failed to save API keys. Please try again.');
    }
  }, []);

  return {
    apiKeys,
    hasKeys,
    isModalOpen,
    openModal,
    closeModal,
    handleSaveKeys,
  };
};
