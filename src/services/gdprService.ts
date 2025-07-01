import { supabase } from '../lib/supabase';

export interface DataExportRequest {
  email: string;
  requestId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface UserDataExport {
  user: {
    id: string;
    name: string;
    email: string;
    userType: string;
    isVerified: boolean;
    quizCompleted: boolean;
    waitlistPosition: number | null;
    createdAt: string;
    updatedAt: string;
  };
  quizResponses: Array<{
    questionId: string;
    answer: string;
    createdAt: string;
  }>;
  exportMetadata: {
    requestId: string;
    exportDate: string;
    dataVersion: string;
  };
}

class GDPRService {
  async requestDataExport(email: string): Promise<{ success: boolean; requestId?: string; error?: string }> {
    try {
      const requestId = crypto.randomUUID();
      
      // Store data export request
      const { error } = await supabase
        .from('data_export_requests')
        .insert({
          id: requestId,
          email,
          status: 'pending',
          requested_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating data export request:', error);
        return { success: false, error: 'Failed to create export request' };
      }

      // In a real implementation, this would trigger an async job
      // For now, we'll process it immediately
      await this.processDataExport(requestId, email);

      return { success: true, requestId };
    } catch (error) {
      console.error('Error requesting data export:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  async requestDataDeletion(email: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First, verify the user exists
      const { data: user, error: userError } = await supabase
        .from('waitlist_users')
        .select('id, email')
        .eq('email', email)
        .single();

      if (userError || !user) {
        return { success: false, error: 'User not found' };
      }

      // Log the deletion request for compliance
      const { error: logError } = await supabase
        .from('data_deletion_requests')
        .insert({
          id: crypto.randomUUID(),
          user_id: user.id,
          email,
          reason: reason || 'User requested deletion',
          status: 'pending',
          requested_at: new Date().toISOString()
        });

      if (logError) {
        console.error('Error logging deletion request:', logError);
        return { success: false, error: 'Failed to process deletion request' };
      }

      // Delete user data (this will cascade to related tables)
      const { error: deleteError } = await supabase
        .from('waitlist_users')
        .delete()
        .eq('id', user.id);

      if (deleteError) {
        console.error('Error deleting user data:', deleteError);
        return { success: false, error: 'Failed to delete user data' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error requesting data deletion:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  private async processDataExport(requestId: string, email: string): Promise<void> {
    try {
      // Update status to processing
      await supabase
        .from('data_export_requests')
        .update({ status: 'processing' })
        .eq('id', requestId);

      // Fetch user data
      const { data: user, error: userError } = await supabase
        .from('waitlist_users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !user) {
        throw new Error('User not found');
      }

      // Fetch quiz responses
      const { data: quizResponses, error: quizError } = await supabase
        .from('quiz_responses')
        .select('question_id, answer, created_at')
        .eq('user_id', user.id);

      if (quizError) {
        throw new Error('Failed to fetch quiz responses');
      }

      // Create export data
      const exportData: UserDataExport = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.user_type,
          isVerified: user.is_verified,
          quizCompleted: user.quiz_completed,
          waitlistPosition: user.waitlist_position,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        },
        quizResponses: quizResponses || [],
        exportMetadata: {
          requestId,
          exportDate: new Date().toISOString(),
          dataVersion: '1.0'
        }
      };

      // Store the export data (in a real implementation, this would be sent via email)
      await supabase
        .from('data_exports')
        .insert({
          id: crypto.randomUUID(),
          request_id: requestId,
          email,
          export_data: exportData,
          created_at: new Date().toISOString()
        });

      // Update status to completed
      await supabase
        .from('data_export_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', requestId);

    } catch (error) {
      console.error('Error processing data export:', error);
      
      // Update status to failed
      await supabase
        .from('data_export_requests')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', requestId);
    }
  }

  async getConsentStatus(): Promise<{
    analytics: boolean;
    marketing: boolean;
    essential: boolean;
  }> {
    const stored = localStorage.getItem('cookie-consent');
    
    return {
      essential: true, // Always true
      analytics: stored === 'accepted',
      marketing: stored === 'accepted'
    };
  }

  async updateConsent(consent: {
    analytics: boolean;
    marketing: boolean;
  }): Promise<void> {
    const consentString = consent.analytics || consent.marketing ? 'accepted' : 'declined';
    localStorage.setItem('cookie-consent', consentString);
    
    // Store in database for logged-in users
    const user = JSON.parse(localStorage.getItem('purrfect_verified_user') || '{}');
    if (user.email) {
      await supabase
        .from('user_consent')
        .upsert({
          email: user.email,
          analytics_consent: consent.analytics,
          marketing_consent: consent.marketing,
          updated_at: new Date().toISOString()
        });
    }
  }
}

export const gdprService = new GDPRService();