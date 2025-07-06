import React, { useState } from 'react';
import UnifiedEmailVerificationService from '../services/unifiedEmailVerificationService';

interface DiagnosticResult {
  timestamp: string;
  test: string;
  success: boolean;
  message: string;
  details?: any;
}

const DiagnosticTool: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testToken, setTestToken] = useState('');

  const addResult = (test: string, success: boolean, message: string, details?: any) => {
    const result: DiagnosticResult = {
      timestamp: new Date().toLocaleTimeString(),
      test,
      success,
      message,
      details
    };
    setResults(prev => [result, ...prev]);
  };

  const runDatabaseTest = async () => {
    try {
      const result = await UnifiedEmailVerificationService.testDatabaseConnection();
      addResult('Database Connection', result.success, result.message, result.details);
    } catch (error) {
      addResult('Database Connection', false, `Exception: ${(error as Error).message}`, error);
    }
  };

  const runTokenTest = async () => {
    if (!testToken.trim()) {
      addResult('Token Verification', false, 'Please enter a test token');
      return;
    }

    try {
      const result = await UnifiedEmailVerificationService.verifyEmail(testToken.trim());
      if (result.success && result.user) {
        addResult('Token Verification', true, 'Token verification successful', { 
          userId: result.user.id, 
          email: result.user.email,
          redirectUrl: result.redirectUrl 
        });
      } else {
        addResult('Token Verification', false, result.error || 'Verification failed');
      }
    } catch (error) {
      addResult('Token Verification', false, `Verification failed: ${(error as Error).message}`, error);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    await runDatabaseTest();
    
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (testToken.trim()) {
      await runTokenTest();
    }
    
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">Email Verification Diagnostic Tool</h2>
      
      {/* Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="testToken" className="block text-sm font-medium text-slate-300 mb-2">
            Test Token (optional - for token verification test):
          </label>
          <input
            id="testToken"
            type="text"
            value={testToken}
            onChange={(e) => setTestToken(e.target.value)}
            placeholder="Enter verification token to test"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white rounded-md font-medium transition-colors"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <button
            onClick={runDatabaseTest}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-md font-medium transition-colors"
          >
            Test Database Only
          </button>
          
          <button
            onClick={runTokenTest}
            disabled={isRunning || !testToken.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-md font-medium transition-colors"
          >
            Test Token Only
          </button>
          
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Test Results:</h3>
        
        {results.length === 0 ? (
          <p className="text-slate-400 italic">No tests run yet. Click "Run All Tests" to start.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md border ${
                  result.success
                    ? 'bg-green-900/20 border-green-700 text-green-200'
                    : 'bg-red-900/20 border-red-700 text-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{result.test}</span>
                  <span className="text-sm text-slate-400">{result.timestamp}</span>
                </div>
                
                <p className="text-sm mb-2">{result.message}</p>
                
                {result.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-slate-400 hover:text-slate-300">
                      Show Details
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-900 rounded overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-slate-700 rounded-md">
        <h4 className="font-medium text-white mb-2">How to Use:</h4>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• <strong>Database Test:</strong> Checks connection, RLS policies, and token search capability</li>
          <li>• <strong>Token Test:</strong> Tests actual email verification with a real token</li>
          <li>• <strong>Get a token:</strong> Register a test account, check browser console for token logs</li>
          <li>• <strong>Check console:</strong> This tool also logs detailed information to browser console</li>
        </ul>
      </div>
    </div>
  );
};

export default DiagnosticTool;