import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, QuizData, AppStep } from '../types';
import { WaitlistUser } from '../services/unifiedEmailVerificationService';
import { CurrencyInfo, CurrencyService } from '../services/currencyService';
import { GeolocationService } from '../services/geolocationService';

interface AppContextType {
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  waitlistUser: WaitlistUser | null;
  setWaitlistUser: (user: WaitlistUser | null) => void;
  quizData: QuizData | null;
  setQuizData: (data: QuizData | null) => void;
  waitlistCount: number;
  setWaitlistCount: (count: number) => void;
  verificationToken: string | null;
  setVerificationToken: (token: string | null) => void;
  selectedCurrency: CurrencyInfo;
  setSelectedCurrency: (currency: CurrencyInfo) => void;
  supportedCurrencies: CurrencyInfo[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [waitlistUser, setWaitlistUser] = useState<WaitlistUser | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(47); // Will be updated from Supabase
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  
  // Initialize currency from localStorage or default
  const getInitialCurrency = (): CurrencyInfo => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      try {
        const parsed = JSON.parse(savedCurrency);
        // Validate that it's a valid currency
        const validCurrency = CurrencyService.getSupportedCurrencies().find(c => c.code === parsed.code);
        if (validCurrency) {
          return validCurrency;
        }
      } catch (error) {
        console.error('Failed to parse saved currency:', error);
      }
    }
    return {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      rate: 1.0
    };
  };

  const [selectedCurrency, setSelectedCurrencyState] = useState<CurrencyInfo>(getInitialCurrency());
  const supportedCurrencies = CurrencyService.getSupportedCurrencies();

  // Wrapper for setSelectedCurrency that also saves to localStorage
  const setSelectedCurrency = (currency: CurrencyInfo) => {
    setSelectedCurrencyState(currency);
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
  };

  // Auto-detect user's currency based on location (only if not already set)
  useEffect(() => {
    const detectUserCurrency = async () => {
      // Only auto-detect if user hasn't manually selected a currency
      const savedCurrency = localStorage.getItem('selectedCurrency');
      if (savedCurrency) {
        return; // User has already selected a currency
      }

      try {
        const location = await GeolocationService.getUserLocation();
        const currency = CurrencyService.getCurrencyForCountry(location.countryCode);
        setSelectedCurrency(currency);
      } catch (error) {
        console.error('Failed to detect user currency:', error);
        // Keep default USD
      }
    };

    detectUserCurrency();
  }, []);

  const value = {
    currentStep,
    setCurrentStep,
    user,
    setUser,
    waitlistUser,
    setWaitlistUser,
    quizData,
    setQuizData,
    waitlistCount,
    setWaitlistCount,
    verificationToken,
    setVerificationToken,
    selectedCurrency,
    setSelectedCurrency,
    supportedCurrencies,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};