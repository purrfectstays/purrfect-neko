import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EmailVerificationService } from '../services/emailVerificationService';
import { useApp } from '../context/AppContext';

const EmailVerificationHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentStep, setUser } = useApp();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setErrorMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const result = await EmailVerificationService.verifyEmailToken(token);
        
        if (result.success && result.user) {
          setStatus('success');
          
          // Set user in context
          setUser({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            userType: result.user.user_type,
            isVerified: true,
            quizCompleted: false,
            waitlistPosition: null
          });

          // Redirect to quiz based on user type after a short delay
          setTimeout(() => {
            setCurrentStep('quiz');
            navigate('/', { replace: true });
          }, 2000);
        } else {
          setStatus('error');
          setErrorMessage(result.error || 'Verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('An unexpected error occurred during verification.');
        console.error('Verification error:', error);
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
              <div className="w-16 h-16 mx-auto mb-6">
                <div className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
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