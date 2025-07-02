import React from 'react';
import { useApp } from '../context/AppContext';

const EmailVerification: React.FC = () => {
  const { setCurrentStep } = useApp();

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-zinc-800 rounded-xl p-8 border border-indigo-500/30">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Check Your Email
        </h2>
        <p className="text-zinc-300 mb-6 text-center">
          We've sent a verification link to your email address. Please click the link to verify your account.
        </p>
        <button
          onClick={() => setCurrentStep('landing')}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Landing Page
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;