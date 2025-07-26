import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoadingSpinner } from '../LoadingSpinner';
import { analytics } from '../../lib/analytics';

// Pattern: Props interface with clear naming
interface ExampleFormProps {
  onSuccess?: (data: FormData) => void;
  className?: string;
}

// Pattern: Form data type definition
interface FormData {
  email: string;
  name: string;
  acceptTerms: boolean;
}

// Pattern: Form validation errors
type FormErrors = Record<keyof FormData, string>;

export const ExampleForm: React.FC<ExampleFormProps> = ({ 
  onSuccess, 
  className = '' 
}) => {
  // Pattern: Typed state management
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pattern: Context usage (available if needed)
  // const { userEmail } = useApp();

  // Pattern: Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {} as FormErrors;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Pattern: Form submission with error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Pattern: Analytics tracking
      analytics.track('form_submitted', {
        formType: 'example',
        timestamp: new Date().toISOString()
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pattern: Success callback
      onSuccess?.(formData);
      
      // Reset form
      setFormData({
        email: '',
        name: '',
        acceptTerms: false
      });
      setErrors({} as FormErrors);
    } catch (error) {
      // Pattern: Error handling with user-friendly message
      setErrors({
        email: 'Something went wrong. Please try again.',
        name: '',
        acceptTerms: ''
      });
      
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pattern: Input change handler
  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'acceptTerms' 
      ? e.target.checked 
      : e.target.value;
      
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Pattern: Early return for loading state
  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Pattern: Main render with Tailwind styling
  return (
    <form 
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      noValidate
    >
      {/* Pattern: Input with error state */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          className={`
            w-full px-4 py-3 bg-zinc-800/50 border rounded-lg
            text-white placeholder-zinc-500 
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${errors.email ? 'border-red-500' : 'border-zinc-700'}
          `}
          placeholder="you@example.com"
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      {/* Pattern: Text input */}
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange('name')}
          className={`
            w-full px-4 py-3 bg-zinc-800/50 border rounded-lg
            text-white placeholder-zinc-500 
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${errors.name ? 'border-red-500' : 'border-zinc-700'}
          `}
          placeholder="John Doe"
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-sm text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      {/* Pattern: Checkbox with label */}
      <div className="flex items-start">
        <input
          id="terms"
          type="checkbox"
          checked={formData.acceptTerms}
          onChange={handleInputChange('acceptTerms')}
          className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 
                     text-indigo-500 focus:ring-2 focus:ring-indigo-500"
          aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
        />
        <label htmlFor="terms" className="ml-3 text-sm text-zinc-300">
          I accept the terms and conditions
        </label>
      </div>
      {errors.acceptTerms && (
        <p id="terms-error" className="ml-7 text-sm text-red-400">
          {errors.acceptTerms}
        </p>
      )}

      {/* Pattern: Submit button with loading state */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-indigo-600 text-white font-medium 
                   rounded-lg hover:bg-indigo-700 focus:outline-none 
                   focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-all duration-200"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Form'}
      </button>

      {/* Pattern: Honeypot field for bot detection */}
      <input
        type="text"
        name="website"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
    </form>
  );
};

export default ExampleForm;