import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, QuizData, AppStep } from '../types';
import { WaitlistUser } from '../services/unifiedEmailVerificationService';

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};