import React, { useState, useEffect } from 'react';
import { CurrencyService } from '../services/currencyService';
import { GeolocationService } from '../services/geolocationService';
import CurrencyDisplay from './CurrencyDisplay';
import CurrencyIndicator from './CurrencyIndicator';

const CurrencyDemo: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const userLocation = await GeolocationService.getUserLocation();
        setLocation(userLocation);
        setSelectedCountry(userLocation.countryCode);
      } catch (error) {
        console.error('Failed to load location:', error);
      }
    };

    loadLocation();
  }, []);

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'EU', name: 'European Union', flag: '🇪🇺' }
  ];

  const mockLocation = { 
    country: countries.find(c => c.code === selectedCountry)?.name || 'Unknown',
    countryCode: selectedCountry,
    region: 'Demo Region',
    city: 'Demo City'
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Currency Conversion Demo
          </h1>
          <p className="text-slate-300 mb-6">
            See how pricing adapts to different regions automatically
          </p>
          
          <CurrencyIndicator location={location} className="justify-center mb-6" />
        </div>

        {/* Country Selector */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Test Different Regions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country.code)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedCountry === country.code
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="text-2xl mb-1">{country.flag}</div>
                <div className="text-xs">{country.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cat Parent Pricing */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Cat Parent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">🐾 Pepper (Growth)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly:</span>
                  <CurrencyDisplay usdAmount={3.99} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Annual:</span>
                  <CurrencyDisplay usdAmount={38} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly total:</span>
                  <CurrencyDisplay usdAmount={47.88} location={mockLocation} className="text-slate-400 line-through" />
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">You save:</span>
                  <CurrencyDisplay usdAmount={9.88} location={mockLocation} className="text-green-400 font-semibold" />
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">🐾 Chicken (Premium)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly:</span>
                  <CurrencyDisplay usdAmount={7.99} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Annual:</span>
                  <CurrencyDisplay usdAmount={77} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly total:</span>
                  <CurrencyDisplay usdAmount={95.88} location={mockLocation} className="text-slate-400 line-through" />
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">You save:</span>
                  <CurrencyDisplay usdAmount={18.88} location={mockLocation} className="text-green-400 font-semibold" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cattery Owner Pricing */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Cattery Owner Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-3">🐾 Truffle (Starter)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly:</span>
                  <CurrencyDisplay usdAmount={15} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Annual:</span>
                  <CurrencyDisplay usdAmount={144} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">You save:</span>
                  <CurrencyDisplay usdAmount={36} location={mockLocation} className="text-green-400 font-semibold" />
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">🐾 Pepper (Growth)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly:</span>
                  <CurrencyDisplay usdAmount={29} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Annual:</span>
                  <CurrencyDisplay usdAmount={278} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">You save:</span>
                  <CurrencyDisplay usdAmount={70} location={mockLocation} className="text-green-400 font-semibold" />
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">🐾 Chicken (Premium)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly:</span>
                  <CurrencyDisplay usdAmount={59} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Annual:</span>
                  <CurrencyDisplay usdAmount={566} location={mockLocation} className="text-white font-semibold" />
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">You save:</span>
                  <CurrencyDisplay usdAmount={142} location={mockLocation} className="text-green-400 font-semibold" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Ranges Demo */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Budget Ranges (Localized)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-300 mb-3">Cat Parent Budget</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Under:</span>
                  <CurrencyDisplay usdAmount={50} location={mockLocation} className="text-slate-300" />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mid-range:</span>
                  <span className="text-slate-300">
                    <CurrencyDisplay usdAmount={100} location={mockLocation} className="text-slate-300" /> - <CurrencyDisplay usdAmount={200} location={mockLocation} className="text-slate-300" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Premium:</span>
                  <span className="text-slate-300">
                    Over <CurrencyDisplay usdAmount={300} location={mockLocation} className="text-slate-300" />
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-300 mb-3">Cattery Marketing Budget</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Small budget:</span>
                  <span className="text-slate-300">
                    Under <CurrencyDisplay usdAmount={50} location={mockLocation} className="text-slate-300" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medium budget:</span>
                  <span className="text-slate-300">
                    <CurrencyDisplay usdAmount={50} location={mockLocation} className="text-slate-300" /> - <CurrencyDisplay usdAmount={150} location={mockLocation} className="text-slate-300" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">High budget:</span>
                  <span className="text-slate-300">
                    Over <CurrencyDisplay usdAmount={300} location={mockLocation} className="text-slate-300" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDemo;