export const getEnvVar = (key: string): string | undefined => {
  // For client-side code, access environment variables through window
  if (typeof window !== 'undefined') {
    return (window as any).__ENV__?.[key];
  }
  return undefined;
};

export const setEnvVar = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    if (!(window as any).__ENV__) {
      (window as any).__ENV__ = {};
    }
    (window as any).__ENV__[key] = value;
  }
};
