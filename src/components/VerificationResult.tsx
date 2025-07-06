import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

interface VerificationResultProps {}

const VerificationResult: React.FC<VerificationResultProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentStep, setUser } = useApp();
  const [countdown, setCountdown] = useState(3);

  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const userId = searchParams.get('user_id');
  const userType = searchParams.get('user_type');
  const name = searchParams.get('name');
  const email = searchParams.get('email');

  useEffect(() => {
    if (success && userId && userType && name && email) {
      // Set user data in context
      setUser({
        id: userId,
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
        userType: userType as 'cat-parent' | 'cattery-owner',
        isVerified: true,
      });

      // Start countdown to redirect to quiz
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCurrentStep('quiz');
            navigate('/quiz');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success, userId, userType, name, email, setUser, setCurrentStep, navigate]);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">
            Email Verified Successfully! ✅
          </h1>

          {message ? (
            <p className="text-slate-300 mb-6">
              {decodeURIComponent(message)}
            </p>
          ) : (
            <p className="text-slate-300 mb-6">
              Great! Your email has been verified. You can now continue to the quiz to secure your spot on the waitlist.
            </p>
          )}

          {userId && (
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-400 mb-2">Welcome back!</p>
              <p className="text-white font-medium">{name && decodeURIComponent(name)}</p>
              <p className="text-slate-300 text-sm">{email && decodeURIComponent(email)}</p>
            </div>
          )}

          <div className="mb-6">
            <LoadingSpinner size="sm" />
            <p className="text-slate-400 text-sm mt-2">
              Redirecting to quiz in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentStep('quiz');
              navigate('/quiz');
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Continue to Quiz Now
          </button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-red-700 rounded-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Verification Failed ❌
        </h1>

        <p className="text-slate-300 mb-6">
          {error ? decodeURIComponent(error) : 'There was an error verifying your email. Please try again.'}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => {
              window.location.href = 'mailto:support@purrfectstays.org?subject=Email Verification Issue';
            }}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Contact Support
          </button>
        </div>

        <p className="text-slate-400 text-xs mt-4">
          If you continue to have issues, please contact our support team for assistance.
        </p>
      </div>
    </div>
  );
};

export default VerificationResult;