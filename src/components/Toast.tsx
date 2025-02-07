import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-500 text-white';
      case 'success':
        return 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`
        rounded-lg shadow-lg overflow-hidden
        ${getToastStyles()}
      `}>
        <div className="px-4 py-3 font-quest">
          {message}
        </div>
      </div>
    </div>
  );
};
