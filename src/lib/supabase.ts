import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Secure debug logging (development only)
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Config Status:', {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey
  });
}

// Enhanced validation with better error messages
const validateSupabaseConfig = () => {
  const errors: string[] = [];
  
  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is missing');
  } else if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    errors.push(`VITE_SUPABASE_URL appears invalid: ${supabaseUrl}`);
  }
  
  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is missing');
  } else if ((!supabaseAnonKey.startsWith('eyJ') && !supabaseAnonKey.startsWith('sb_publishable_')) || supabaseAnonKey.length < 40) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be truncated or invalid');
  }
  
  if (errors.length > 0) {
    console.error('Supabase configuration errors:', errors);
    if (import.meta.env.PROD) {
      throw new Error(`Supabase configuration invalid: ${errors.join(', ')}`);
    }
  }
  
  return errors.length === 0;
};

const isConfigValid = validateSupabaseConfig();

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 2,
      },
    },
  }
);

// Connection test disabled to prevent 401 errors on empty database
// Re-enable after users are properly migrated to new database
if (isConfigValid && supabaseUrl && supabaseAnonKey) {
  console.log('✅ Supabase client initialized successfully (connection test disabled)');
} else {
  console.warn('Supabase configuration invalid - client may not work properly');
}

// Export configuration status for other modules
export const isSupabaseConfigured = isConfigValid;