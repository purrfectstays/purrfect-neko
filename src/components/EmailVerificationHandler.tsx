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
      console.log('📋 All URL params:', Object.fromEntries(searchParams.entries()));
      
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
        console.log('🔐 Verifying email token:', cleanToken);
        console.log('🔍 Token length:', cleanToken.length);
        console.log('🔍 Token format check:', /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(cleanToken));
        
        const result = await UnifiedEmailVerificationService.verifyEmail(cleanToken);
        console.log('✅ Email verification result:', result);
        
        if (!result.success) {
          throw new Error(result.error || 'Verification failed');
        }
        
        const user = result.user!;
        console.log('✅ Email verification successful:', user);
        
        setStatus('success');
        
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.user_type,
          isVerified: true,
          quizCompleted: user.quiz_completed,
          waitlistPosition: user.waitlist_position
        };

        console.log('💾 Saving verified user data:', userData);

        // Set user in context
        setUser(userData);

        // Store user data in localStorage for persistence across routes
        localStorage.setItem('purrfect_verified_user', JSON.stringify(userData));
        
        console.log('✅ User data saved to localStorage');
        console.log('🔍 Verification status in saved data:', userData.isVerified);

        // Redirect to quiz using the URL from the service or default
        setTimeout(() => {
          if (result.redirectUrl) {
            window.location.href = result.redirectUrl;
          } else {
            navigate('/quiz', { replace: true });
          }
        }, 2000);
      } catch (error) {
        console.error('❌ Email verification failed:', error);
        
        // Clear any existing user data on verification failure
        localStorage.removeItem('purrfect_verified_user');
        setUser(null);
        
        setStatus('error');
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unexpected error occurred during verification.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate, setCurrentStep, setUser]);

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