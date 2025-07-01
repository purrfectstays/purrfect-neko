import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">🍪 Cookie Consent</h3>
            <p className="text-slate-300 text-sm">
              We use essential cookies to provide our service and analytics cookies to improve user experience. 
              You can manage your preferences or learn more in our{' '}
              <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">
                Privacy Policy
              </a>.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};