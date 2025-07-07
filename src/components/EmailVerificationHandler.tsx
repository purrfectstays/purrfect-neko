import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UnifiedEmailVerificationService from '../services/unifiedEmailVerificationService';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

const EmailVerificationHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentStep, setUser } = useApp();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      console.log('🔗 Full URL:', window.location.href);
      console.log('🎫 Token from URL:', token);
      
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
        console.log('🔐 Redirecting to Edge Function for verification...');
        
        // Redirect to Edge Function for server-side verification
        const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-email`;
        const verificationUrl = `${edgeFunctionUrl}?token=${encodeURIComponent(cleanToken)}&redirect_url=${encodeURIComponent(window.location.origin)}`;
        
        console.log('🔗 Redirecting to:', verificationUrl);
        
        // Redirect immediately to Edge Function
        window.location.href = verificationUrl;
        
      } catch (error) {
        console.error('❌ Verification redirect failed:', error);
        setStatus('error');
        setErrorMessage('Failed to process verification. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

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

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Email Verified! 🎉</h2>
              <p className="text-slate-300 mb-6">
                Great! Your email has been verified successfully. 
                Redirecting you to your personalized quiz...
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
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