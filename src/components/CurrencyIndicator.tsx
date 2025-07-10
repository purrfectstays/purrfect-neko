import React, { useState, useEffect } from 'react';
import { Globe, Info } from 'lucide-react';
import { CurrencyService } from '../services/currencyService';
import { GeolocationService, LocationData } from '../services/geolocationService';

interface CurrencyIndicatorProps {
  location?: LocationData;
  className?: string;
  showTooltip?: boolean;
}

const CurrencyIndicator: React.FC<CurrencyIndicatorProps> = ({ 
  location,
  className = '',
  showTooltip = true 
}) => {
  const [currencyInfo, setCurrencyInfo] = useState<{
    currency: any;
    isSupported: boolean;
    displayName: string;
    country: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTooltipContent, setShowTooltipContent] = useState(false);

  useEffect(() => {
    const loadCurrencyInfo = async () => {
      try {
        setLoading(true);
        
        // Get location if not provided
        const userLocation = location || await GeolocationService.getUserLocation();
        const currency = CurrencyService.getCurrencyForCountry(userLocation.countryCode);
        const isSupported = CurrencyService.isCurrencySupported(userLocation.countryCode);
        
        setCurrencyInfo({
          currency,
          isSupported,
          displayName: CurrencyService.getCurrencyDisplayName(userLocation.countryCode),
          country: userLocation.country
        });
      } catch (error) {
        console.error('Failed to load currency info:', error);
        setCurrencyInfo({
          currency: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
          isSupported: false,
          displayName: 'US Dollar (USD)',
          country: 'Unknown'
        });
      } finally {
        setLoading(false);
      }
    };

    loadCurrencyInfo();
  }, [location]);

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse bg-slate-600 rounded w-4 h-4"></div>
        <div className="animate-pulse bg-slate-600 rounded w-16 h-4"></div>
      </div>
    );
  }

  if (!currencyInfo) {
    return null;
  }

  const { currency, isSupported, displayName, country } = currencyInfo;

  return (
    <div className={`relative flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <Globe className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-medium text-slate-300">
          {currency.symbol} {currency.code}
        </span>
        
        {showTooltip && (
          <button
            onMouseEnter={() => setShowTooltipContent(true)}
            onMouseLeave={() => setShowTooltipContent(false)}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <Info className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Status indicator */}
      <div className={`w-2 h-2 rounded-full ${
        isSupported ? 'bg-green-400' : 'bg-yellow-400'
      }`} />

      {/* Tooltip */}
      {showTooltip && showTooltipContent && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm z-50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Currency:</span>
              <span className="text-white font-medium">{displayName}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="text-white">{country}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={`font-medium ${
                isSupported ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {isSupported ? 'Live rates' : 'Estimated'}
              </span>
            </div>
            
            {!isSupported && (
              <div className="mt-2 pt-2 border-t border-slate-600 text-xs text-slate-400">
                Prices shown in USD. Local currency support coming soon.
              </div>
            )}
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

export default CurrencyIndicator;