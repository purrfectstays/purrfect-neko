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
  } else if (supabaseAnonKey.length < 100) {
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

// Enhanced connection test with CORS error detection
if (isConfigValid && supabaseUrl && supabaseAnonKey) {
  supabase
    .from('waitlist_users')
    .select('count', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
          console.error('🚨 CORS Configuration Required!');
          console.error('Please add the following origins to your Supabase CORS settings:');
          console.error('- http://localhost:5173 (for development)');
          console.error('- https://purrfectstays.org (for production)');
          console.error('');
          console.error('Steps to fix:');
          console.error('1. Go to your Supabase Dashboard');
          console.error('2. Navigate to Project Settings → API');
          console.error('3. Scroll down to CORS section');
          console.error('4. Add the origins listed above');
          console.error('');
          const projectId = supabaseUrl.split('.')[0].replace('https://', '');
          console.error(`Supabase Dashboard: https://supabase.com/dashboard/project/${projectId}/settings/api`);
        } else {
          console.warn('Supabase connection test failed:', error.message);
        }
      } else {
        console.log('✅ Supabase connection successful');
      }
    })
    .catch((error) => {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('🚨 CORS Error Detected!');
        console.error('This is likely a CORS configuration issue in your Supabase project.');
        console.error('');
        console.error('Quick Fix:');
        const projectId = supabaseUrl.split('.')[0].replace('https://', '');
        console.error(`1. Open: https://supabase.com/dashboard/project/${projectId}/settings/api`);
        console.error('2. Scroll to CORS section');
        console.error('3. Add: http://localhost:5173');
        console.error('4. Add: https://purrfectstays.org');
        console.error('5. Save changes');
      } else {
        console.warn('Supabase connection test error:', error);
      }
    });
} else {
  console.warn('Skipping Supabase connection test due to invalid configuration');
}

// Export configuration status for other modules
export const isSupabaseConfigured = isConfigValid;