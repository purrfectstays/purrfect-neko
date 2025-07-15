/**
 * Configuration Management Utility
 * Centralizes all environment variable handling and validation
 */

// Environment variable validation
export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  app: {
    url: string;
    siteUrl: string;
    nodeEnv: string;
  };
  email: {
    // Email service handled by secure Edge Functions
  };
  analytics: {
    gaMeasurementId?: string;
  };
}

// Default configuration values
const DEFAULT_CONFIG: Partial<AppConfig> = {
  app: {
    url: 'http://localhost:5173',
    siteUrl: 'http://localhost:5173',
    nodeEnv: 'development',
  },
};

/**
 * Validates and loads configuration from environment variables
 */
export function loadConfig(): AppConfig {
  const config: AppConfig = {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    app: {
      url: import.meta.env.VITE_APP_URL || DEFAULT_CONFIG.app!.url!,
      siteUrl: import.meta.env.SITE_URL || import.meta.env.VITE_APP_URL || DEFAULT_CONFIG.app!.siteUrl!,
      nodeEnv: import.meta.env.NODE_ENV || DEFAULT_CONFIG.app!.nodeEnv!,
    },
    email: {
      // Email service handled by secure Edge Functions
    },
    analytics: {
      gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
    },
  };

  return config;
}

/**
 * Validates required configuration values
 */
export function validateConfig(config: AppConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate Supabase configuration
  if (!config.supabase.url) {
    errors.push('VITE_SUPABASE_URL is required');
  } else if (!config.supabase.url.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://');
  }

  if (!config.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }

  // Validate App configuration
  if (!config.app.url) {
    errors.push('VITE_APP_URL is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if configuration is valid for production environment
 */
export function isProductionReady(config: AppConfig): boolean {
  const { isValid } = validateConfig(config);
  
  // Additional production checks
  const hasCustomDomain = config.app.url !== DEFAULT_CONFIG.app!.url;
  const hasAnalytics = Boolean(config.analytics.gaMeasurementId);
  
  return isValid && hasCustomDomain && hasAnalytics;
}

/**
 * Get configuration with validation
 */
export function getConfig(): AppConfig {
  const config = loadConfig();
  const validation = validateConfig(config);
  
  if (!validation.isValid) {
    console.error('Configuration validation failed:', validation.errors);
    throw new Error(`Configuration invalid: ${validation.errors.join(', ')}`);
  }
  
  return config;
}

/**
 * Get configuration without throwing errors (for graceful degradation)
 */
export function getConfigSafe(): { config: AppConfig | null; errors: string[] } {
  try {
    const config = loadConfig();
    const validation = validateConfig(config);
    
    return {
      config: validation.isValid ? config : null,
      errors: validation.errors,
    };
  } catch (error) {
    return {
      config: null,
      errors: [error instanceof Error ? error.message : 'Unknown configuration error'],
    };
  }
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  try {
    const config = loadConfig();
    return Boolean(config.supabase.url && config.supabase.anonKey);
  } catch {
    return false;
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  const config = loadConfig();
  
  return {
    isDevelopment: config.app.nodeEnv === 'development',
    isProduction: config.app.nodeEnv === 'production',
    isLocalhost: config.app.url.includes('localhost'),
    allowedOrigins: [
      'https://purrfectstays.org',
      'https://www.purrfectstays.org',
      'https://purrfect-landingpage.netlify.app',
      'https://purrfect-stays.netlify.app',
      ...(config.app.nodeEnv === 'development' ? ['http://localhost:5173', 'http://localhost:3000'] : []),
    ],
  };
}

// Export singleton instance
export const config = getConfigSafe();
export const { isDevelopment, isProduction, isLocalhost, allowedOrigins } = getEnvironmentConfig();