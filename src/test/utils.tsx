import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the AppContext values for testing
export const mockAppContextValue = {
  currentStep: 'landing' as const,
  setCurrentStep: vi.fn(),
  user: null,
  setUser: vi.fn(),
  waitlistUser: null,
  setWaitlistUser: vi.fn(),
  quizData: null,
  setQuizData: vi.fn(),
  waitlistCount: 50,
  setWaitlistCount: vi.fn(),
  verificationToken: null,
  setVerificationToken: vi.fn(),
  selectedCurrency: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1,
  },
  setSelectedCurrency: vi.fn(),
  supportedCurrencies: [
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.73 },
  ],
};

// Mock the AppProvider for testing
const MockAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement('div', { 'data-testid': 'mock-app-provider' }, children);
};

// Custom render function that includes providers
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return <MockAppProvider>{children}</MockAppProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data factories
export const createMockWaitlistUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  is_verified: true,
  quiz_completed: false,
  position: 1,
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockQuizResponse = (overrides = {}) => ({
  id: 'test-response-id',
  user_id: 'test-user-id',
  question_id: 'test-question',
  answer: 'test-answer',
  created_at: new Date().toISOString(),
  ...overrides,
});

// Supabase mocks
export const mockSupabaseClient = {
  from: vi.fn(() => ({
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    select: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockResolvedValue({ data: [], error: null }),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  })),
  auth: {
    signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
    signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: null, error: null }),
      download: vi.fn().mockResolvedValue({ data: null, error: null }),
      remove: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
};

// Email service mocks
export const mockEmailService = {
  sendVerificationCode: vi.fn().mockResolvedValue({ success: true }),
  verifyCode: vi.fn().mockResolvedValue({ success: true, isValid: true }),
  sendWelcomeEmail: vi.fn().mockResolvedValue({ success: true }),
};

// Geolocation mocks
export const mockGeolocationService = {
  getCurrentLocation: vi.fn().mockResolvedValue({
    country: 'US',
    region: 'California',
    city: 'San Francisco',
  }),
  getLocationByIP: vi.fn().mockResolvedValue({
    country: 'US',
    region: 'California', 
    city: 'San Francisco',
  }),
};

// Wait for async operations to complete
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock timers helper
export const mockTimers = () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
};

// Test data helpers
export const validEmailAddresses = [
  'test@example.com',
  'user+tag@domain.co.uk',
  'name.lastname@company.org',
];

export const invalidEmailAddresses = [
  'invalid-email',
  '@domain.com',
  'test@',
  'test..test@domain.com',
];

export const validNames = [
  'John Doe',
  'Jane Smith',
  'María García',
  '李小明',
];

export const invalidNames = [
  '',
  '   ',
  'a',
  'a'.repeat(101), // Too long
];