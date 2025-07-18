import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { CurrencyInfo } from '../services/currencyService';

// Currency flag emojis mapping
const currencyFlags: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  JPY: '🇯🇵',
  NZD: '🇳🇿',
  SGD: '🇸🇬',
};

// Popular currencies to show at the top
const popularCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'];

interface CurrencySelectorProps {
  className?: string;
  showExchangeRate?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  className = '', 
  showExchangeRate = false 
}) => {
  const { selectedCurrency, setSelectedCurrency, supportedCurrencies } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter currencies based on search
  const filteredCurrencies = supportedCurrencies.filter(currency => 
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort currencies: popular ones first, then alphabetically
  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => {
    const aIsPopular = popularCurrencies.includes(a.code);
    const bIsPopular = popularCurrencies.includes(b.code);
    
    if (aIsPopular && !bIsPopular) return -1;
    if (!aIsPopular && bIsPopular) return 1;
    
    // If both are popular or both are not, maintain popular order or sort alphabetically
    if (aIsPopular && bIsPopular) {
      return popularCurrencies.indexOf(a.code) - popularCurrencies.indexOf(b.code);
    }
    
    return a.code.localeCompare(b.code);
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle currency selection
  const handleCurrencySelect = (currency: CurrencyInfo) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Currency Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-sm sm:text-base"
        aria-label="Select currency"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg sm:text-xl" aria-hidden="true">
          {currencyFlags[selectedCurrency.code] || '💱'}
        </span>
        <span className="font-medium text-white hidden sm:inline">
          {selectedCurrency.code}
        </span>
        <ChevronDownIcon 
          className={`w-3 h-3 sm:w-4 sm:h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden z-50 animate-fadeIn max-h-80 sm:max-h-96">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search currencies..."
                className="w-full pl-10 pr-3 py-2 bg-slate-900 text-white rounded-md border border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                aria-label="Search currencies"
              />
            </div>
          </div>

          {/* Currency List */}
          <ul 
            className="max-h-64 overflow-y-auto"
            role="listbox"
            aria-label="Currency options"
          >
            {sortedCurrencies.length > 0 ? (
              sortedCurrencies.map((currency) => {
                const isSelected = currency.code === selectedCurrency.code;
                const isPopular = popularCurrencies.includes(currency.code);
                
                return (
                  <li key={currency.code}>
                    <button
                      onClick={() => handleCurrencySelect(currency)}
                      className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700 transition-colors duration-150 ${
                        isSelected ? 'bg-slate-700' : ''
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl" aria-hidden="true">
                          {currencyFlags[currency.code] || '💱'}
                        </span>
                        <div className="text-left">
                          <div className="font-medium text-white">
                            {currency.code}
                          </div>
                          <div className="text-sm text-slate-400">
                            {currency.name}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {showExchangeRate && currency.code !== 'USD' && (
                          <span className="text-xs text-slate-500">
                            1 USD = {currency.rate.toFixed(2)} {currency.code}
                          </span>
                        )}
                        {isSelected && (
                          <CheckIcon className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                        )}
                      </div>
                    </button>
                    
                    {isPopular && sortedCurrencies.indexOf(currency) === popularCurrencies.length - 1 && 
                     sortedCurrencies.length > popularCurrencies.length && (
                      <div className="border-t border-slate-700 my-1" />
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-8 text-center text-slate-400">
                No currencies found
              </li>
            )}
          </ul>

          {/* Exchange Rate Footer (optional) */}
          {showExchangeRate && selectedCurrency.code !== 'USD' && (
            <div className="p-3 border-t border-slate-700 bg-slate-900">
              <p className="text-xs text-slate-400 text-center">
                Exchange rate: 1 USD = {selectedCurrency.rate.toFixed(4)} {selectedCurrency.code}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;