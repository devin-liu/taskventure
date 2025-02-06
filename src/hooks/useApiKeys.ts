import { useState, useEffect } from 'react';
import type { ApiKeys } from '../components/ApiKeyModal';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasKeys, setHasKeys] = useState(false);

  useEffect(() => {
    // Load keys from localStorage on mount
    const savedKeys = localStorage.getItem('api_keys');
    if (savedKeys) {
      const keys = JSON.parse(savedKeys);
      setApiKeys(keys);
      setHasKeys(!!keys.openai || !!keys.openrouter);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSaveKeys = (keys: ApiKeys) => {
    setApiKeys(keys);
    setHasKeys(!!keys.openai || !!keys.openrouter);
  };

  return {
    apiKeys,
    hasKeys,
    isModalOpen,
    openModal,
    closeModal,
    handleSaveKeys,
  };
};
