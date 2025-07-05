import { supabase } from '../../lib/supabaseClient';

// Pattern: Interface definitions for all data types
interface ExampleUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  is_verified: boolean;
  metadata?: Record<string, any>;
}

interface CreateUserData {
  email: string;
  name: string;
  metadata?: Record<string, any>;
}

interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

// Pattern: Service class with static methods
export class ExampleSupabaseService {
  // Pattern: Configuration validation
  private static isConfigured(): boolean {
    return !!(
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  // Pattern: Error handling helper
  private static handleError(error: any, operation: string): string {
    console.error(`${operation} error:`, error);

    // Pattern: CORS error detection
    if (error.message?.includes('Failed to fetch')) {
      return 'Connection error. Please check your internet connection.';
    }

    // Pattern: User-friendly error messages
    if (error.code === '23505') {
      return 'This email is already registered.';
    }

    if (error.code === 'PGRST301') {
      return 'Authentication required.';
    }

    return `Unable to ${operation}. Please try again.`;
  }

  // Pattern: Create operation with validation
  static async createUser(
    data: CreateUserData
  ): Promise<ServiceResponse<ExampleUser>> {
    try {
      // Pattern: Configuration check
      if (!this.isConfigured()) {
        throw new Error('Supabase not configured');
      }

      // Pattern: Input validation
      if (!data.email || !data.name) {
        return {
          data: null,
          error: 'Email and name are required'
        };
      }

      // Pattern: Supabase insert with type safety
      const { data: user, error } = await supabase
        .from('example_users')
        .insert({
          email: data.email.toLowerCase().trim(),
          name: data.name.trim(),
          created_at: new Date().toISOString(),
          is_verified: false,
          metadata: data.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      return {
        data: user,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error, 'create user')
      };
    }
  }

  // Pattern: Read operation with nullable return
  static async getUserByEmail(
    email: string
  ): Promise<ExampleUser | null> {
    try {
      if (!this.isConfigured()) {
        console.error('Supabase not configured');
        return null;
      }

      // Pattern: Query with filters
      const { data, error } = await supabase
        .from('example_users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error) {
        // Pattern: Handle not found gracefully
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Pattern: Update operation with partial data
  static async updateUser(
    id: string,
    updates: Partial<Omit<ExampleUser, 'id' | 'created_at'>>
  ): Promise<ServiceResponse<ExampleUser>> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Supabase not configured');
      }

      // Pattern: Update with returning data
      const { data, error } = await supabase
        .from('example_users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error, 'update user')
      };
    }
  }

  // Pattern: List operation with filters
  static async listUsers(
    filters?: {
      is_verified?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<ExampleUser[]> {
    try {
      if (!this.isConfigured()) {
        return [];
      }

      // Pattern: Build query dynamically
      let query = supabase
        .from('example_users')
        .select('*')
        .order('created_at', { ascending: false });

      // Pattern: Optional filters
      if (filters?.is_verified !== undefined) {
        query = query.eq('is_verified', filters.is_verified);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(
          filters.offset, 
          filters.offset + (filters.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('List users error:', error);
      return [];
    }
  }

  // Pattern: Delete operation
  static async deleteUser(id: string): Promise<ServiceResponse<null>> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase
        .from('example_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        data: null,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error, 'delete user')
      };
    }
  }

  // Pattern: Aggregate operation
  static async getUserStats(): Promise<{
    total: number;
    verified: number;
    unverified: number;
  }> {
    try {
      if (!this.isConfigured()) {
        return { total: 0, verified: 0, unverified: 0 };
      }

      // Pattern: Multiple queries for stats
      const [totalResult, verifiedResult] = await Promise.all([
        supabase
          .from('example_users')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('example_users')
          .select('*', { count: 'exact', head: true })
          .eq('is_verified', true)
      ]);

      const total = totalResult.count || 0;
      const verified = verifiedResult.count || 0;

      return {
        total,
        verified,
        unverified: total - verified
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return { total: 0, verified: 0, unverified: 0 };
    }
  }

  // Pattern: Real-time subscription
  static subscribeToUsers(
    callback: (user: ExampleUser) => void
  ): () => void {
    if (!this.isConfigured()) {
      return () => {};
    }

    const channel = supabase
      .channel('example_users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'example_users'
        },
        (payload) => {
          if (payload.new) {
            callback(payload.new as ExampleUser);
          }
        }
      )
      .subscribe();

    // Pattern: Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Pattern: Transaction-like operation
  static async verifyUser(
    email: string,
    token: string
  ): Promise<ServiceResponse<ExampleUser>> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Supabase not configured');
      }

      // Pattern: Multiple related operations
      // 1. Verify token
      const { data: tokenData, error: tokenError } = await supabase
        .from('verification_tokens')
        .select('*')
        .eq('email', email)
        .eq('token', token)
        .single();

      if (tokenError || !tokenData) {
        return {
          data: null,
          error: 'Invalid verification token'
        };
      }

      // 2. Update user
      const { data: user, error: updateError } = await supabase
        .from('example_users')
        .update({ is_verified: true })
        .eq('email', email)
        .select()
        .single();

      if (updateError) throw updateError;

      // 3. Delete used token
      await supabase
        .from('verification_tokens')
        .delete()
        .eq('id', tokenData.id);

      return {
        data: user,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error, 'verify user')
      };
    }
  }
}

export default ExampleSupabaseService;