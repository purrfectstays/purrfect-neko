import React from 'react';
import CurrencySelector from './CurrencySelector';
import CurrencyDisplay from './CurrencyDisplay';
import { useApp } from '../context/AppContext';

const CurrencySelectorDemo: React.FC = () => {
  const { selectedCurrency } = useApp();
  
  // Sample prices to demonstrate conversion
  const samplePrices = [
    { label: 'Basic Plan', usdAmount: 9.99 },
    { label: 'Pro Plan', usdAmount: 29.99 },
    { label: 'Enterprise Plan', usdAmount: 99.99 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Currency Selector Demo
          </h1>
          <p className="text-slate-400 text-lg">
            Test the currency selector and see live price conversions
          </p>
        </div>

        {/* Currency Selector Demo */}
        <div className="bg-slate-800 rounded-xl p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Select Your Currency
          </h2>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-slate-400 mb-2">Current Selection:</p>
              <p className="text-xl text-white font-medium">
                {selectedCurrency.name} ({selectedCurrency.code})
              </p>
            </div>
            
            <CurrencySelector showExchangeRate={true} />
          </div>

          {/* Exchange Rate Info */}
          {selectedCurrency.code !== 'USD' && (
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-300">
                Current exchange rate: 1 USD = {selectedCurrency.rate.toFixed(4)} {selectedCurrency.code}
              </p>
            </div>
          )}
        </div>

        {/* Price Conversion Examples */}
        <div className="bg-slate-800 rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Live Price Conversions
          </h2>
          
          <div className="space-y-4">
            {samplePrices.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
              >
                <span className="text-white font-medium">{item.label}</span>
                <div className="text-right">
                  <CurrencyDisplay 
                    usdAmount={item.usdAmount} 
                    className="text-xl font-semibold text-indigo-400"
                  />
                  {selectedCurrency.code !== 'USD' && (
                    <div className="text-sm text-slate-400 mt-1">
                      (${item.usdAmount} USD)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="mt-8 bg-slate-800 rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Integration Guide
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 mb-4">
              To use the CurrencySelector in your components:
            </p>
            <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-slate-300">{`import CurrencySelector from './components/CurrencySelector';

// Basic usage
<CurrencySelector />

// With exchange rate display
<CurrencySelector showExchangeRate={true} />

// With custom styling
<CurrencySelector className="my-custom-class" />`}</code>
            </pre>
            <p className="text-slate-300 mt-4">
              The selected currency is automatically synced across all components using React Context.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelectorDemo;