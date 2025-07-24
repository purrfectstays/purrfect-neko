import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
          <div className="text-center max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Something went wrong</h2>
            
            {/* Debug Info - Show actual error */}
            {this.state.error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4 text-left">
                <h3 className="text-red-400 font-semibold mb-2">Error Details:</h3>
                <pre className="text-red-300 text-sm whitespace-pre-wrap break-words">
                  {this.state.error.name}: {this.state.error.message}
                  {'\n\nStack:\n'}{this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <div className="mt-3">
                    <h4 className="text-red-400 font-semibold mb-1">Component Stack:</h4>
                    <pre className="text-red-300 text-sm whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}
            
            <button 
              onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg mr-2"
            >
              Try again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;