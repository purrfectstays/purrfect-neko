import React, { useState, useEffect } from 'react';
import { CurrencyService, CurrencyInfo } from '../services/currencyService';
import { GeolocationService, LocationData } from '../services/geolocationService';
import { useApp } from '../context/AppContext';

interface CurrencyDisplayProps {
  usdAmount: number;
  showOriginal?: boolean;
  className?: string;
  location?: LocationData;
  useContextCurrency?: boolean; // New prop to use currency from context
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  usdAmount, 
  showOriginal = false, 
  className = '',
  location,
  useContextCurrency = true // Default to using context currency
}) => {
  const { selectedCurrency } = useApp();
  const [localizedPrice, setLocalizedPrice] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocalizedPrice = async () => {
      try {
        setLoading(true);
        setError(null);

        let userCurrency: CurrencyInfo;
        
        if (useContextCurrency) {
          // Use currency from context
          userCurrency = selectedCurrency;
        } else {
          // Auto-detect based on location
          const userLocation = location || await GeolocationService.getUserLocation();
          userCurrency = CurrencyService.getCurrencyForCountry(userLocation.countryCode);
        }
        
        setCurrency(userCurrency);

        // Convert price
        const convertedAmount = await CurrencyService.convertFromUSD(usdAmount, userCurrency.code);
        const formattedPrice = CurrencyService.formatPrice(convertedAmount, userCurrency);
        
        setLocalizedPrice(formattedPrice);
      } catch (err) {
        setError('Failed to load localized pricing');
        console.error('Currency conversion error:', err);
        
        // Fallback to USD
        setCurrency({ code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 });
        setLocalizedPrice(`$${usdAmount}`);
      } finally {
        setLoading(false);
      }
    };

    loadLocalizedPrice();
  }, [usdAmount, location, useContextCurrency, selectedCurrency]);

  if (loading) {
    return (
      <span className={`inline-block animate-pulse bg-slate-600 rounded text-transparent ${className}`}>
        ${usdAmount}
      </span>
    );
  }

  if (error) {
    return (
      <span className={`text-red-400 ${className}`} title={error}>
        ${usdAmount}
      </span>
    );
  }

  return (
    <span className={className}>
      {localizedPrice}
      {showOriginal && currency?.code !== 'USD' && (
        <span className="text-slate-400 text-sm ml-1">
          (${usdAmount} USD)
        </span>
      )}
    </span>
  );
};

export default CurrencyDisplay;