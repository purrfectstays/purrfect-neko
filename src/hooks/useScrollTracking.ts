import { useEffect } from 'react';

export const useScrollTracking = () => {
  useEffect(() => {
    const handleScroll = () => {
      // Basic scroll tracking - can be expanded later
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};