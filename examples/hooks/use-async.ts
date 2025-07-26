import { useState, useEffect, useCallback, useRef } from 'react';

// Pattern: Generic async state interface
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Pattern: Hook options interface
interface UseAsyncOptions<T = unknown> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// Pattern: Generic async hook with proper typing
export function useAsync<T = unknown>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
): AsyncState<T> & { execute: () => Promise<void>; reset: () => void } {
  const { immediate = true, onSuccess, onError } = options;
  
  // Pattern: State management with proper typing
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null
  });

  // Pattern: Ref to track mounted state
  const isMountedRef = useRef(true);
  
  // Pattern: Ref to store latest async function
  const asyncFunctionRef = useRef(asyncFunction);
  asyncFunctionRef.current = asyncFunction;

  // Pattern: Execute function with error handling
  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await asyncFunctionRef.current();
      
      // Pattern: Check if component is still mounted
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
        onSuccess?.(result);
      }
    } catch (error) {
      if (isMountedRef.current) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: errorObj });
        onError?.(errorObj);
      }
    }
  }, [onSuccess, onError]);

  // Pattern: Reset function
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  // Pattern: Effect for immediate execution
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  // Pattern: Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { ...state, execute, reset };
}

// Pattern: Specialized hook for API calls
interface ApiCallOptions<T> extends UseAsyncOptions<T> {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

export function useApiCall<T = unknown>(
  url: string,
  options: ApiCallOptions<T> = {}
): AsyncState<T> & { 
  execute: (overrideParams?: Record<string, unknown>) => Promise<void>;
  reset: () => void;
} {
  const { 
    params = {}, 
    headers = {}, 
    method = 'GET', 
    body,
    ...asyncOptions 
  } = options;

  // Pattern: Build URL with query params
  const buildUrl = useCallback((baseUrl: string, queryParams: Record<string, unknown>) => {
    const url = new URL(baseUrl, window.location.origin);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  }, []);

  // Pattern: Fetch wrapper
  const fetchData = useCallback(async (overrideParams?: Record<string, unknown>) => {
    const finalParams = { ...params, ...overrideParams };
    const finalUrl = buildUrl(url, method === 'GET' ? finalParams : {});
    
    const response = await fetch(finalUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }, [url, method, headers, body, params, buildUrl]);

  // Pattern: Use the generic hook with the fetch function
  const asyncState = useAsync(() => fetchData(), asyncOptions);

  // Pattern: Override execute to accept params
  const executeWithParams = useCallback(
    (overrideParams?: Record<string, unknown>) => {
      // Create new function with override params and execute it
      const newFetchFunction = () => fetchData(overrideParams);
      return useAsync(newFetchFunction, { immediate: true }).execute();
    },
    [fetchData]
  );

  return { ...asyncState, execute: executeWithParams };
}

// Pattern: Debounced async hook
export function useDebouncedAsync<T = unknown>(
  asyncFunction: () => Promise<T>,
  delay: number = 500,
  options: UseAsyncOptions<T> = {}
): AsyncState<T> & { 
  execute: () => void;
  cancel: () => void;
  reset: () => void;
} {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const timeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  // Pattern: Debounced execute
  const execute = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({ ...prev, loading: true }));

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await asyncFunction();
        
        if (isMountedRef.current) {
          setState({ data: result, loading: false, error: null });
          options.onSuccess?.(result);
        }
      } catch (error) {
        if (isMountedRef.current) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          setState({ data: null, loading: false, error: errorObj });
          options.onError?.(errorObj);
        }
      }
    }, delay);
  }, [asyncFunction, delay, options]);

  // Pattern: Cancel pending execution
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Pattern: Reset state
  const reset = useCallback(() => {
    cancel();
    setState({ data: null, loading: false, error: null });
  }, [cancel]);

  // Pattern: Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { ...state, execute, cancel, reset };
}

// Pattern: Polling hook
export function usePolling<T = unknown>(
  asyncFunction: () => Promise<T>,
  interval: number = 5000,
  options: UseAsyncOptions<T> & { enabled?: boolean } = {}
): AsyncState<T> & { 
  start: () => void;
  stop: () => void;
  reset: () => void;
} {
  const { enabled = true } = options;
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const intervalRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  // Pattern: Execute function
  const execute = useCallback(async () => {
    try {
      const result = await asyncFunction();
      
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
        options.onSuccess?.(result);
      }
    } catch (error) {
      if (isMountedRef.current) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: errorObj });
        options.onError?.(errorObj);
      }
    }
  }, [asyncFunction, options]);

  // Pattern: Start polling
  const start = useCallback(() => {
    // Initial execution
    setState(prev => ({ ...prev, loading: true }));
    execute();

    // Set up interval
    intervalRef.current = setInterval(execute, interval);
  }, [execute, interval]);

  // Pattern: Stop polling
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // Pattern: Reset
  const reset = useCallback(() => {
    stop();
    setState({ data: null, loading: false, error: null });
  }, [stop]);

  // Pattern: Auto-start if enabled
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }

    return stop;
  }, [enabled, start, stop]);

  // Pattern: Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stop();
    };
  }, [stop]);

  return { ...state, start, stop, reset };
}

export default useAsync;