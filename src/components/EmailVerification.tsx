import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import UnifiedEmailVerificationService from '../services/unifiedEmailVerificationService';

const EmailVerification: React.FC = () => {
  const { setCurrentStep, user, verificationToken, setUser } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = async () => {
    if (inputCode === verificationToken) {
      setIsVerifying(true);
      try {
        // For cattery owners, they're already verified - just proceed to quiz
        if (user?.userType === 'cattery-owner') {
          // Update user state to verified (should already be true)
          setUser({
            ...user,
            isVerified: true
          });

          // Navigate directly to quiz
          setCurrentStep('quiz');
        } else {
          // For cat parents, verify the user in the database
          if (user) {
            await UnifiedEmailVerificationService.verifyUser(user.id, verificationToken);
            
            // Update user state to verified
            setUser({
              ...user,
              isVerified: true
            });

            // Navigate to quiz
            setCurrentStep('quiz');
          }
        }
      } catch (error) {
        setError('Verification failed. Please try again.');
        setIsVerifying(false);
      }
    } else {
      setError('Incorrect code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-zinc-800 rounded-xl p-8 border border-green-500/30">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Enter Verification Code
        </h2>
        
        <div className="bg-green-500/20 border-2 border-green-500/60 rounded-xl p-4 mb-6">
          <p className="text-green-300 text-sm font-semibold text-center">
            Your verification code:
          </p>
          <p className="text-2xl font-bold text-green-100 text-center mt-2 tracking-wider">
            {verificationToken}
          </p>
          {user?.userType === 'cattery-owner' && (
            <p className="text-green-300 text-xs text-center mt-2">
              ✅ No email verification needed for cattery owners
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter the code above"
            className="w-full px-4 py-4 bg-zinc-700/80 border-2 border-zinc-500 rounded-xl text-white placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-center text-xl font-mono tracking-wider"
            maxLength={6}
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/40 rounded-xl p-3 mb-4">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        <button
          onClick={handleVerification}
          disabled={inputCode.length !== 6 || isVerifying}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isVerifying ? 'Verifying...' : 'START QUIZ'}
        </button>

        <button
          onClick={() => setCurrentStep('landing')}
          className="w-full bg-zinc-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Back to Landing Page
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;