import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Admin client for server-side operations that bypass RLS
// This should ONLY be used for trusted operations like email verification
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Only create admin client if service role key is available
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// Helper function to check if admin client is available
export const hasAdminAccess = () => !!supabaseAdmin;

// Admin-only operations
export const adminOperations = {
  // Verify email bypassing RLS
  async verifyUserEmail(userId: string, token: string) {
    if (!supabaseAdmin) {
      throw new Error('Admin access not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('waitlist_users')
      .update({
        is_verified: true,
        verification_token: null,
      })
      .eq('id', userId)
      .eq('verification_token', token)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },
};