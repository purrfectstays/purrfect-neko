// Pattern: Core TypeScript interface patterns used in Purrfect Stays

// Pattern: Database entity interfaces
export interface WaitlistUser {
  id: string;
  email: string;
  name: string;
  location: string;
  user_type: 'cat-parent' | 'cattery-owner';
  is_verified: boolean;
  waitlist_position: number;
  created_at: string;
  updated_at: string;
  quiz_completed: boolean;
  verification_token?: string;
  metadata?: Record<string, any>;
}

// Pattern: Form data interfaces (input types)
export interface RegistrationFormData {
  email: string;
  name: string;
  location: string;
  userType: 'cat-parent' | 'cattery-owner';
  acceptTerms: boolean;
}

// Pattern: Quiz-related interfaces
export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'select' | 'boolean';
  options?: string[];
  required: boolean;
  category: string;
  order: number;
}

export interface QuizResponse {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  created_at: string;
}

export interface QuizResponseData {
  user_id: string;
  responses: Record<string, string>;
  completed_at: string;
}

// Pattern: Service response types
export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface ListResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
  error: string | null;
}

// Pattern: API response wrappers
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pattern: Component prop interfaces
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormComponentProps extends ComponentProps {
  onSubmit?: (data: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  initialValues?: Record<string, any>;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Pattern: State management interfaces
export interface AppState {
  currentStep: AppStep;
  userEmail: string | null;
  user: WaitlistUser | null;
  isSubmitting: boolean;
  connectionStatus: ConnectionStatus;
}

export type AppStep = 
  | 'landing'
  | 'registration'
  | 'email-verification'
  | 'quiz'
  | 'success';

export type ConnectionStatus = 
  | 'connected'
  | 'connecting'
  | 'error'
  | 'offline'
  | 'cors-error';

// Pattern: Form validation interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormValidationRules {
  [fieldName: string]: FieldValidation;
}

// Pattern: Loading and error state interfaces
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string | number;
  retryable?: boolean;
}

// Pattern: Geolocation interfaces
export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  region: string;
  accuracy?: number;
}

export interface RegionalWaitlistData {
  totalUsers: number;
  recentSignups: number;
  topCities: Array<{
    city: string;
    count: number;
  }>;
  urgencyLevel: 'high' | 'medium' | 'low';
}

// Pattern: Email service interfaces
export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailOptions {
  to: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Pattern: Analytics interfaces
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: string;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsConfig {
  trackingId: string;
  enabled: boolean;
  debug?: boolean;
}

// Pattern: Configuration interfaces
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export interface AppConfig {
  supabase: SupabaseConfig;
  resend: {
    apiKey: string;
    fromEmail: string;
  };
  analytics: AnalyticsConfig;
  app: {
    url: string;
    name: string;
    version: string;
  };
}

// Pattern: Hook return type interfaces
export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
  reset: () => void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  handleChange: (field: keyof T) => (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  reset: () => void;
}

// Pattern: Utility type patterns
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type ApiCallback<T> = (data: T) => void;
export type ErrorCallback = (error: Error) => void;

// Pattern: Event handler types
export type FormSubmitHandler<T = any> = (data: T) => void | Promise<void>;
export type ClickHandler = () => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type KeyboardHandler = (e: React.KeyboardEvent) => void;

// Pattern: Component size and variant types
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type ComponentColor = 'indigo' | 'zinc' | 'green' | 'red' | 'yellow' | 'blue';

// Pattern: Status and state enums as types
export type RequestStatus = 'idle' | 'pending' | 'success' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Pattern: Database join types
export interface WaitlistUserWithQuiz extends WaitlistUser {
  quiz_responses?: QuizResponse[];
  quiz_completed_at?: string;
  quiz_score?: number;
}

// Pattern: Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}