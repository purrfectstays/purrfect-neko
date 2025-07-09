import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';
import { supabase } from '../lib/supabase';

const EmailVerificationHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentStep } = useApp();
  const [status, setStatus] = useState<'verifying' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      console.log('🔗 EmailVerificationHandler - Token from URL:', token ? `${token.substring(0, 8)}...` : 'none');
      
      if (!token) {
        console.error('❌ No token found in URL');
        setStatus('error');
        setErrorMessage('Invalid verification link. No token provided.');
        return;
      }

      // Clean and validate token
      const cleanToken = token.trim();
      if (!cleanToken) {
        console.error('❌ Empty token after cleaning');
        setStatus('error');
        setErrorMessage('Invalid verification token format.');
        return;
      }

      try {
        console.log('🔐 Verifying email via Supabase client...');
        
        // Use Supabase invoke to call the Edge Function
        // This handles all authentication and CORS issues automatically
        const { data, error } = await supabase.functions.invoke('verify-email', {
          body: { token: cleanToken },
          method: 'POST', // Use POST to send token in body instead of URL
        });
        
        console.log('📡 Verification response:', { data, error });
        
        if (error) {
          throw new Error(error.message || 'Verification failed');
        }
        
        // Handle the response based on what the Edge Function returns
        if (data?.redirectUrl) {
          console.log('🔄 Redirecting to:', data.redirectUrl);
          window.location.href = data.redirectUrl;
          return;
        }
        
        if (data?.success) {
          console.log('✅ Verification successful');
          // Navigate to the verification result page
          const params = new URLSearchParams({
            success: 'true',
            user_id: data.user_id || '',
            user_type: data.user_type || '',
            name: data.name || '',
            email: data.email || '',
          });
          navigate(`/verify-result?${params.toString()}`, { replace: true });
          return;
        }
        
        // If we get here, something unexpected happened
        throw new Error('Unexpected response from verification service');
        
      } catch (error) {
        console.error('❌ Verification failed:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to process verification. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/', { replace: true });
    setCurrentStep('registration');
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {status === 'verifying' && (
            <>
              <LoadingSpinner size="lg" text="Verifying Your Email" className="mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Verifying Your Email</h2>
              <p className="text-slate-300">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Verification Failed</h2>
              <p className="text-slate-300 mb-6">
                {errorMessage}
              </p>
              <button
                onClick={handleRetry}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationHandler;