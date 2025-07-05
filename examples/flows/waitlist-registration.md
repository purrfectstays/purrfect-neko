# Waitlist Registration Flow Example

This document outlines the complete waitlist registration flow in the Purrfect Stays application, serving as a reference for similar multi-step processes.

## Flow Overview

```
Landing → Registration → Email Verification → Qualification Quiz → Success
```

## Step-by-Step Implementation

### 1. Landing Page
**File**: `src/components/LandingPage.tsx`
**Purpose**: Entry point with call-to-action

**Key Patterns**:
- Hero section with value proposition
- Call-to-action button triggering step transition
- Analytics tracking for landing page views
- Responsive design with Tailwind CSS

```typescript
// Pattern: Step transition using context
const { setCurrentStep } = useApp();

const handleGetStarted = () => {
  analytics.track('cta_clicked', { location: 'hero' });
  setCurrentStep('registration');
};
```

### 2. Registration Form
**File**: `src/components/RegistrationForm.tsx`  
**Purpose**: Collect user information and create waitlist entry

**Key Patterns**:
- Form validation with TypeScript interfaces
- Error handling for duplicate emails
- Progress indication
- Honeypot field for bot protection
- Rate limiting protection

```typescript
// Pattern: Form data interface
interface RegistrationData {
  email: string;
  name: string;
  location: string;
  userType: 'cat-parent' | 'cattery-owner';
}

// Pattern: Form submission with error handling
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    const { user, verificationToken } = await WaitlistService.registerUser(formData);
    
    // Continue to verification step
    setCurrentStep('email-verification');
    
    // Send verification email
    await EmailVerificationService.sendVerificationEmail(
      user.email,
      verificationToken
    );
  } catch (error) {
    handleError(error);
  } finally {
    setIsSubmitting(false);
  }
};
```

### 3. Email Verification
**File**: `src/components/EmailVerification.tsx`
**Purpose**: Verify user's email address

**Key Patterns**:
- Token-based verification
- Resend email functionality with cooldown
- Real-time status updates
- Connection status monitoring

```typescript
// Pattern: Verification state management
const [verificationStatus, setVerificationStatus] = useState<
  'pending' | 'verified' | 'error'
>('pending');

// Pattern: Polling for verification status
useEffect(() => {
  const pollVerification = async () => {
    try {
      const user = await WaitlistService.getUserByEmail(userEmail);
      if (user?.is_verified) {
        setVerificationStatus('verified');
        setCurrentStep('quiz');
      }
    } catch (error) {
      console.error('Verification check failed:', error);
    }
  };

  const interval = setInterval(pollVerification, 3000);
  return () => clearInterval(interval);
}, [userEmail]);
```

### 4. Qualification Quiz
**File**: `src/components/Quiz.tsx` (Lazy loaded)
**Purpose**: Gather additional user information

**Key Patterns**:
- Dynamic question rendering from data
- Progress tracking through questions
- Answer validation and storage
- Lazy loading for performance

```typescript
// Pattern: Question data structure
interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'select';
  options?: string[];
  required: boolean;
}

// Pattern: Quiz state management
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [answers, setAnswers] = useState<Record<string, string>>({});
const [isComplete, setIsComplete] = useState(false);

// Pattern: Answer submission
const submitQuiz = async () => {
  try {
    await WaitlistService.submitQuizResponse({
      user_id: user.id,
      responses: answers,
      completed_at: new Date().toISOString()
    });
    
    setCurrentStep('success');
    
    // Send welcome email
    await EmailService.sendWelcomeEmail(user.email, user.name);
  } catch (error) {
    handleError(error);
  }
};
```

### 5. Success Page
**File**: `src/components/SuccessPage.tsx`
**Purpose**: Confirmation and next steps

**Key Patterns**:
- Waitlist position display
- Social sharing integration
- Clear next steps for users
- Analytics completion tracking

## Service Layer Integration

### WaitlistService
**File**: `src/services/waitlistService.ts`

```typescript
// Pattern: User registration with transaction-like behavior
static async registerUser(userData: RegistrationData): Promise<{
  user: WaitlistUser;
  verificationToken: string;
}> {
  // 1. Create user record
  // 2. Generate verification token
  // 3. Return both for email sending
}

// Pattern: Quiz response storage
static async submitQuizResponse(response: QuizResponseData): Promise<void> {
  // 1. Validate response data
  // 2. Store in database
  // 3. Update user completion status
}
```

### EmailVerificationService
**File**: `src/services/emailVerificationService.ts`

```typescript
// Pattern: Email sending with fallback
static async sendVerificationEmail(
  email: string, 
  token: string
): Promise<void> {
  try {
    // Send via Supabase Edge Function
    await supabase.functions.invoke('send-verification-email', {
      body: { email, token }
    });
  } catch (error) {
    // Fallback handling
    console.error('Email send failed:', error);
  }
}
```

## State Management

### AppContext Pattern
**File**: `src/context/AppContext.tsx`

```typescript
// Pattern: Multi-step flow state
interface AppState {
  currentStep: Step;
  userEmail: string | null;
  user: WaitlistUser | null;
  isSubmitting: boolean;
}

// Pattern: Step transitions
const setCurrentStep = (step: Step) => {
  setState(prev => ({ ...prev, currentStep: step }));
  
  // Analytics tracking
  analytics.track('step_completed', { 
    step, 
    timestamp: new Date().toISOString() 
  });
};
```

## Error Handling Strategy

### Form Validation
```typescript
// Pattern: Field-specific error state
const [errors, setErrors] = useState<Record<string, string>>({});

const validateField = (field: string, value: string): string => {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email';
      }
      return '';
    // ... other validations
  }
};
```

### Service Error Handling
```typescript
// Pattern: User-friendly error messages
const handleServiceError = (error: any): string => {
  if (error.code === '23505') {
    return 'This email is already registered';
  }
  
  if (error.message?.includes('Failed to fetch')) {
    return 'Connection error. Please check your internet connection.';
  }
  
  return 'Something went wrong. Please try again.';
};
```

## Performance Optimizations

### Lazy Loading
```typescript
// Pattern: Code splitting for heavy components
const Quiz = lazy(() => import('./Quiz'));

// Pattern: Suspense boundary
<Suspense fallback={<LoadingSpinner />}>
  <Quiz />
</Suspense>
```

### Debounced Validation
```typescript
// Pattern: Debounced email validation
const debouncedEmailCheck = useMemo(
  () => debounce(async (email: string) => {
    const exists = await WaitlistService.checkEmailExists(email);
    if (exists) {
      setErrors(prev => ({
        ...prev,
        email: 'This email is already registered'
      }));
    }
  }, 500),
  []
);
```

## Analytics Integration

### Event Tracking
```typescript
// Pattern: Consistent event naming
analytics.track('registration_started', {
  user_type: formData.userType,
  location: formData.location,
  timestamp: new Date().toISOString()
});

analytics.track('email_verified', {
  email: userEmail,
  verification_time: verificationDuration,
  attempts: resendCount
});

analytics.track('quiz_completed', {
  completion_time: quizDuration,
  question_count: questions.length,
  user_type: user.userType
});
```

This flow demonstrates the complete user journey with proper error handling, state management, and service integration patterns used throughout the Purrfect Stays application.