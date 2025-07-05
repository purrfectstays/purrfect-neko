import React from 'react';

// Pattern: Simple UI component with optional props
interface LoadingSpinnerExampleProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'white' | 'zinc';
  className?: string;
}

// Pattern: Size mapping object
const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
} as const;

// Pattern: Color mapping object
const colorClasses = {
  indigo: 'text-indigo-500',
  white: 'text-white',
  zinc: 'text-zinc-400'
} as const;

export const LoadingSpinnerExample: React.FC<LoadingSpinnerExampleProps> = ({ 
  size = 'md',
  color = 'indigo',
  className = ''
}) => {
  // Pattern: Combine classes with template literals
  const spinnerClasses = `
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    ${className}
  `.trim();

  // Pattern: Simple presentational component
  return (
    <div 
      role="status" 
      aria-label="Loading"
      className="inline-flex items-center"
    >
      <svg 
        className={`animate-spin ${spinnerClasses}`}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Pattern: Card component with children
interface CardExampleProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  className?: string;
}

const variantClasses = {
  default: 'bg-zinc-900/50',
  bordered: 'bg-zinc-900/30 border border-zinc-800',
  elevated: 'bg-zinc-900 shadow-xl shadow-indigo-500/10'
} as const;

export const CardExample: React.FC<CardExampleProps> = ({
  title,
  children,
  variant = 'default',
  className = ''
}) => {
  return (
    <div 
      className={`
        rounded-xl p-6
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {title && (
        <h3 className="text-xl font-semibold text-white mb-4">
          {title}
        </h3>
      )}
      <div className="text-zinc-300">
        {children}
      </div>
    </div>
  );
};

// Pattern: Button component with variants
interface ButtonExampleProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const ButtonExample: React.FC<ButtonExampleProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  // Pattern: Complex variant styling
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';
  
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 focus:ring-zinc-600',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50 focus:ring-zinc-700'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledClasses}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
};

// Pattern: Status indicator component
interface StatusIndicatorProps {
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  className = ''
}) => {
  const statusStyles = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'i'
  };

  return (
    <div 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border
        ${statusStyles[status]}
        ${className}
      `}
      role="alert"
    >
      <span className="text-lg font-bold">{icons[status]}</span>
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default LoadingSpinnerExample;