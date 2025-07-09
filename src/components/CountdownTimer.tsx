import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import UnifiedEmailVerificationService from '../services/unifiedEmailVerificationService';
import { isSupabaseConfigured } from '../lib/supabase';

const CountdownTimer: React.FC = () => {
  const { waitlistCount, setWaitlistCount } = useApp();
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 30
  });
  const [stats, setStats] = useState({
    totalUsers: waitlistCount,
    verifiedUsers: 0,
    completedQuizzes: 0
  });
  const [, setIsOffline] = useState(!isSupabaseConfigured);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'offline' | 'error' | 'connecting' | 'cors-error'>('connecting');
  const [retryCount, setRetryCount] = useState(0);
  const [lastSuccessfulFetch, setLastSuccessfulFetch] = useState<Date | null>(null);
  const [corsErrorDetected, setCorsErrorDetected] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Skip fetching if Supabase is not configured
    if (!isSupabaseConfigured) {
      setConnectionStatus('offline');
      setIsOffline(true);
      console.warn('Supabase not configured, using fallback data');
      return;
    }

    let isMounted = true;
    let currentController: AbortController | null = null;

    // Fetch real waitlist stats with enhanced error handling
    const fetchStats = async () => {
      // Don't start new request if component is unmounted
      if (!isMounted) return;

      try {
        setConnectionStatus('connecting');
        
        // Create a new AbortController for this request
        currentController = new AbortController();
        
        // Set up timeout that properly handles cleanup
        const timeoutId = setTimeout(() => {
          if (currentController && !currentController.signal.aborted) {
            currentController.abort();
          }
        }, 30000); // 30 second timeout
        
        const waitlistStats = await UnifiedEmailVerificationService.getWaitlistStats(currentController.signal);
        
        // Clear the timeout since the request completed successfully
        clearTimeout(timeoutId);
        
        // Only update state if component is still mounted and we got valid data
        if (isMounted && waitlistStats.totalUsers >= 0) {
          setStats(waitlistStats);
          setWaitlistCount(waitlistStats.completedQuizzes);
          setConnectionStatus('connected');
          setIsOffline(false);
          setRetryCount(0);
          setCorsErrorDetected(false);
          setLastSuccessfulFetch(new Date());
        }
      } catch (error: unknown) {
        // Only handle errors if component is still mounted
        if (!isMounted) return;

        // Handle AbortError silently - it's expected behavior for timeouts/cleanup
        const errorString = String(error).toLowerCase();
        const isAbortError = (
          error instanceof Error && error.name === 'AbortError' ||
          errorString.includes('aborterror') ||
          errorString.includes('aborted') ||
          errorString.includes('signal is aborted')
        );
        
        if (isAbortError) {
          // Silently handle abort errors - don't log or change status for these
          return;
        } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          // CORS error detected
          console.error('🚨 CORS Error detected in CountdownTimer!');
          setConnectionStatus('cors-error');
          setCorsErrorDetected(true);
        } else {
          console.error('Failed to fetch waitlist stats:', error);
          setConnectionStatus('error');
        }
        
        setIsOffline(true);
        setRetryCount(prev => prev + 1);
        
        // Keep existing stats when offline, but show error state
        // Don't update stats to preserve last known good values
      } finally {
        // Clean up the controller reference
        currentController = null;
      }
    };

    // Initial fetch
    fetchStats();
    
    // Set up retry logic with exponential backoff
    const getRetryInterval = () => {
      const baseInterval = 30000; // 30 seconds
      const maxInterval = 300000; // 5 minutes
      const backoffMultiplier = Math.min(Math.pow(2, retryCount), 10);
      return Math.min(baseInterval * backoffMultiplier, maxInterval);
    };

    // Refresh stats with dynamic interval based on connection status
    const interval = setInterval(() => {
      if (!isMounted) return;
      
      if (connectionStatus === 'connected') {
        fetchStats();
      } else if ((connectionStatus === 'error' || connectionStatus === 'cors-error') && retryCount < 10) {
        // Retry with exponential backoff, but limit total retries
        fetchStats();
      }
    }, getRetryInterval());

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(interval);
      
      // Abort any ongoing request when component unmounts
      if (currentController && !currentController.signal.aborted) {
        currentController.abort();
      }
    };
  }, [setWaitlistCount, retryCount, connectionStatus]);

  const getStatusMessage = () => {
    if (!isSupabaseConfigured) {
      return '⚙️ Configuration required';
    }
    
    switch (connectionStatus) {
      case 'connecting':
        return '🔄 Connecting...';
      case 'connected':
        return lastSuccessfulFetch 
          ? `✅ Live data (${lastSuccessfulFetch.toLocaleTimeString()})`
          : '✅ Live data';
      case 'offline':
        return '📡 Reconnecting...';
      case 'cors-error':
        return '🚨 CORS configuration needed';
      case 'error':
        return retryCount > 5 
          ? '⚠️ Connection issues (check CORS settings)'
          : `⚠️ Retrying... (${retryCount}/10)`;
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'text-blue-400';
      case 'connected':
        return 'text-green-400';
      case 'offline':
        return 'text-amber-400';
      case 'cors-error':
        return 'text-red-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-zinc-500';
    }
  };

  const getCorsFixInstructions = () => {
    if (!corsErrorDetected) return null;

    return (
      <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-xs text-red-300">
        <div className="font-semibold mb-2">🚨 CORS Configuration Required</div>
        <div className="space-y-1 text-red-200">
          <div>1. Open your Supabase Dashboard</div>
          <div>2. Go to Project Settings → API</div>
          <div>3. Scroll to CORS section</div>
          <div>4. Add: <code className="bg-red-800/50 px-1 rounded">http://localhost:5173</code></div>
          <div>5. Add: <code className="bg-red-800/50 px-1 rounded">https://purrfectstays.org</code></div>
          <div>6. Save changes and refresh this page</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-800/30">
      <div className="text-center mb-4">
        <h3 className="font-manrope font-bold text-xl text-white mb-2">
          Join Our Growing Community
        </h3>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
          <span className="text-2xl font-bold text-white">{stats.completedQuizzes}</span>
        </div>
        <p className="font-manrope text-sm text-zinc-400">
          People have completed the waitlist
        </p>
        <div className="mt-2 text-xs text-zinc-500">
          {stats.totalUsers} registered • {stats.verifiedUsers} verified
        </div>
        <div className="mt-1 text-xs">
          <span className={getStatusColor()}>
            {getStatusMessage()}
          </span>
        </div>
        {connectionStatus === 'error' && retryCount > 3 && !corsErrorDetected && (
          <div className="mt-2 text-xs text-amber-400 bg-amber-900/20 rounded px-2 py-1">
            💡 Tip: Check CORS settings in Supabase Dashboard
          </div>
        )}
        {getCorsFixInstructions()}
      </div>
      
      <div className="grid grid-cols-4 gap-4 text-center">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="bg-zinc-700/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-indigo-400 font-manrope">
              {value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-zinc-400 font-manrope capitalize">
              {unit}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-zinc-400 font-manrope">
          ⏰ Building towards our launch goal
        </p>
        {!isSupabaseConfigured && (
          <p className="text-xs text-amber-400 font-manrope mt-1">
            ⚙️ Database configuration needed for live updates
          </p>
        )}
        {connectionStatus === 'error' && isSupabaseConfigured && !corsErrorDetected && (
          <p className="text-xs text-red-400 font-manrope mt-1">
            🔧 Network connectivity issues detected
          </p>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;