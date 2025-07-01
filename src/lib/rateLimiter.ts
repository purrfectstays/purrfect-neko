interface RateLimitEntry {
  count: number;
  windowStart: number;
  lastRequest: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
}

class RateLimiter {
  private storage = new Map<string, RateLimitEntry>();
  private configs = new Map<string, RateLimitConfig>();

  constructor() {
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Configure rate limiting for a specific endpoint/action
   */
  configure(action: string, config: RateLimitConfig): void {
    this.configs.set(action, config);
  }

  /**
   * Check if a request is allowed
   */
  isAllowed(identifier: string, action: string): { allowed: boolean; retryAfter?: number; remaining?: number } {
    const config = this.configs.get(action);
    if (!config) {
      // If no config exists, allow by default
      return { allowed: true };
    }

    const key = `${action}:${identifier}`;
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      // First request
      this.storage.set(key, {
        count: 1,
        windowStart: now,
        lastRequest: now,
      });
      return { 
        allowed: true, 
        remaining: config.maxRequests - 1 
      };
    }

    // Check if we're in a new window
    if (now - entry.windowStart >= config.windowMs) {
      // Reset for new window
      this.storage.set(key, {
        count: 1,
        windowStart: now,
        lastRequest: now,
      });
      return { 
        allowed: true, 
        remaining: config.maxRequests - 1 
      };
    }

    // Check if blocked
    const blockDuration = config.blockDurationMs || config.windowMs;
    if (entry.count >= config.maxRequests) {
      const blockedUntil = entry.lastRequest + blockDuration;
      if (now < blockedUntil) {
        return {
          allowed: false,
          retryAfter: Math.ceil((blockedUntil - now) / 1000), // Return seconds
        };
      } else {
        // Block period expired, reset
        this.storage.set(key, {
          count: 1,
          windowStart: now,
          lastRequest: now,
        });
        return { 
          allowed: true, 
          remaining: config.maxRequests - 1 
        };
      }
    }

    // Increment count
    entry.count++;
    entry.lastRequest = now;
    this.storage.set(key, entry);

    return { 
      allowed: true, 
      remaining: config.maxRequests - entry.count 
    };
  }

  /**
   * Get current rate limit status
   */
  getStatus(identifier: string, action: string): { count: number; remaining: number; resetTime: number } | null {
    const config = this.configs.get(action);
    if (!config) return null;

    const key = `${action}:${identifier}`;
    const entry = this.storage.get(key);
    
    if (!entry) {
      return {
        count: 0,
        remaining: config.maxRequests,
        resetTime: Date.now() + config.windowMs,
      };
    }

    return {
      count: entry.count,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.windowStart + config.windowMs,
    };
  }

  /**
   * Reset rate limit for a specific identifier and action
   */
  reset(identifier: string, action: string): void {
    const key = `${action}:${identifier}`;
    this.storage.delete(key);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      const action = key.split(':')[0];
      const config = this.configs.get(action);
      
      if (config && now - entry.windowStart > config.windowMs * 2) {
        this.storage.delete(key);
      }
    }
  }

  /**
   * Get a user identifier (IP would be ideal, but we'll use a combination of factors)
   */
  static getClientIdentifier(): string {
    // In a real app, you'd want to use IP address from the server
    // For client-side, we'll use a combination of available data
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
    ].join('|');

    // Create a simple hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

// Configure rate limits for different actions
rateLimiter.configure('registration', {
  maxRequests: 3, // Allow 3 registration attempts
  windowMs: 15 * 60 * 1000, // Per 15 minutes
  blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes after limit
});

rateLimiter.configure('email_verification', {
  maxRequests: 5, // Allow 5 verification attempts
  windowMs: 10 * 60 * 1000, // Per 10 minutes
  blockDurationMs: 15 * 60 * 1000, // Block for 15 minutes
});

rateLimiter.configure('quiz_submission', {
  maxRequests: 2, // Allow 2 quiz submissions
  windowMs: 60 * 60 * 1000, // Per hour
  blockDurationMs: 2 * 60 * 60 * 1000, // Block for 2 hours
});

rateLimiter.configure('contact_form', {
  maxRequests: 5, // Allow 5 contact form submissions
  windowMs: 60 * 60 * 1000, // Per hour
  blockDurationMs: 60 * 60 * 1000, // Block for 1 hour
});

export { rateLimiter, RateLimiter };