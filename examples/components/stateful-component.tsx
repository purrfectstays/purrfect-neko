import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { LoadingSpinner } from '../LoadingSpinner';

// Pattern: Component with complex state management
interface CountdownExampleProps {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
}

// Pattern: Time remaining interface
interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

// Pattern: Connection status enum
type ConnectionStatus = 'connected' | 'connecting' | 'error' | 'offline';

export const CountdownExample: React.FC<CountdownExampleProps> = ({
  targetDate,
  onComplete,
  className = ''
}) => {
  // Pattern: Multiple state hooks with proper typing
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [retryCount, setRetryCount] = useState(0);
  
  // Pattern: Context usage
  const { userEmail } = useApp();

  // Pattern: Calculate time remaining
  const calculateTimeRemaining = useCallback((): TimeRemaining => {
    const total = targetDate.getTime() - new Date().getTime();
    
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / 1000 / 60) % 60),
      seconds: Math.floor((total / 1000) % 60),
      total
    };
  }, [targetDate]);

  // Pattern: Simulated connection check with retry logic
  const checkConnection = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failures
          if (Math.random() > 0.8 && retryCount < 2) {
            reject(new Error('Connection failed'));
          } else {
            resolve(true);
          }
        }, 1000);
      });
      
      setConnectionStatus('connected');
      setRetryCount(0);
    } catch {
      setConnectionStatus('error');
      setRetryCount(prev => prev + 1);
      
      // Pattern: Exponential backoff retry
      if (retryCount < 3) {
        setTimeout(() => {
          checkConnection();
        }, Math.pow(2, retryCount) * 1000);
      } else {
        setConnectionStatus('offline');
      }
    }
  }, [retryCount]);

  // Pattern: Main timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining.total <= 0 && onComplete) {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    // Pattern: Cleanup function
    return () => clearInterval(timer);
  }, [calculateTimeRemaining, onComplete]);

  // Pattern: Connection check effect
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Pattern: Format number with leading zero
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  // Pattern: Connection status indicator
  const renderConnectionStatus = () => {
    const statusConfig = {
      connected: { color: 'text-green-400', icon: '●', text: 'Connected' },
      connecting: { color: 'text-yellow-400', icon: '◐', text: 'Connecting...' },
      error: { color: 'text-red-400', icon: '▲', text: 'Connection Error' },
      offline: { color: 'text-zinc-500', icon: '○', text: 'Offline' }
    };

    const config = statusConfig[connectionStatus];

    return (
      <div className={`flex items-center gap-2 text-sm ${config.color}`}>
        <span className="animate-pulse">{config.icon}</span>
        <span>{config.text}</span>
        {connectionStatus === 'error' && retryCount < 3 && (
          <span className="text-zinc-500">(Retry {retryCount}/3)</span>
        )}
      </div>
    );
  };

  // Pattern: Loading state
  if (!timeRemaining) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Pattern: Completed state
  if (timeRemaining.total <= 0) {
    return (
      <div className={`text-center ${className}`}>
        <h3 className="text-2xl font-bold text-indigo-400 mb-2">
          Time's Up! 🎉
        </h3>
        <p className="text-zinc-400">The countdown has completed</p>
      </div>
    );
  }

  // Pattern: Main render with grid layout
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Connection status */}
      <div className="flex justify-end">
        {renderConnectionStatus()}
      </div>

      {/* Countdown display */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries({
          days: 'Days',
          hours: 'Hours',
          minutes: 'Minutes',
          seconds: 'Seconds'
        }).map(([key, label]) => (
          <div 
            key={key}
            className="text-center bg-zinc-900/50 rounded-lg p-4 
                       border border-zinc-800 hover:border-indigo-500/50 
                       transition-colors duration-300"
          >
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {formatNumber(timeRemaining[key as keyof TimeRemaining])}
            </div>
            <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-wider">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 
                       transition-all duration-1000 ease-linear"
            style={{ 
              width: `${Math.max(0, Math.min(100, 
                (timeRemaining.total / (targetDate.getTime() - Date.now())) * 100
              ))}%` 
            }}
          />
        </div>
      </div>

      {/* Additional info */}
      {userEmail && (
        <div className="text-center text-sm text-zinc-500">
          Counting down for: <span className="text-zinc-300">{userEmail}</span>
        </div>
      )}
    </div>
  );
};

// Pattern: Hook for countdown logic
export const useCountdown = (targetDate: Date) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const total = targetDate.getTime() - new Date().getTime();
      
      if (total <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      setTimeRemaining({
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / 1000 / 60) % 60),
        seconds: Math.floor((total / 1000) % 60),
        total
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeRemaining;
};

export default CountdownExample;