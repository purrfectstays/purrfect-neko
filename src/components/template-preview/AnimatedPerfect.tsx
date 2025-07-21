import React, { useState, useEffect, memo } from 'react';

/**
 * Animated text cycling component that displays rotating words
 * with smooth transitions
 */
const AnimatedPerfect: React.FC = memo(() => {
  const words = ['Perfect', 'Premium', 'Trusted', 'Quality', 'Caring', 'Expert'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span 
      className={`transition-all duration-300 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-bold ${
        isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
      }`}
    >
      {words[currentWordIndex]}
    </span>
  );
});

AnimatedPerfect.displayName = 'AnimatedPerfect';

export default AnimatedPerfect;