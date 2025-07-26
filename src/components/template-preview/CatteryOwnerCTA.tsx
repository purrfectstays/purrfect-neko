import React, { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * Call-to-action component for cattery owners to register
 * as partners on the platform
 */
const CatteryOwnerCTA: React.FC = memo(() => {
  const { setCurrentStep } = useApp();

  const handleCatteryRegistration = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to cattery registration page
    setCurrentStep('registration');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCatteryRegistration(e);
    }
  };

  return (
    <div className="bg-purple-600/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400 shadow-2xl shadow-purple-400/20">
      <div className="space-y-6 text-center">
        <h3 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">
          Register as a Cattery Owner
        </h3>
        
        <p className="text-lg text-purple-100 mb-6">
          Join our partner network and connect with quality cat parents in your area
        </p>
        
        <button
          type="button"
          onClick={handleCatteryRegistration}
          onKeyDown={handleKeyDown}
          className="w-full bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xl font-bold py-5 rounded-full hover:from-purple-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-400/30 flex items-center justify-center space-x-3"
        >
          <span>BECOME A PARTNER</span>
          <ArrowRight className="w-6 h-6" />
        </button>
        
        <p className="text-sm text-purple-200">
          🚀 Early partners get reduced fees • Priority placement • Founding benefits
        </p>
      </div>
    </div>
  );
});

CatteryOwnerCTA.displayName = 'CatteryOwnerCTA';

export default CatteryOwnerCTA;