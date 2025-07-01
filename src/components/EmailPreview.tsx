import React, { useState } from 'react';
import { Mail, Send, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const EmailPreview: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [isTestingVerification, setIsTestingVerification] = useState(false);
  const [isTestingWelcome, setIsTestingWelcome] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: 'success' | 'error' | 'pending' }>({});

  const sendTestVerificationEmail = async () => {
    if (!testEmail || !/\S+@\S+\.\S+/.test(testEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsTestingVerification(true);
    setTestResults(prev => ({ ...prev, verification: 'pending' }));

    try {
      // This would call your actual email function in a real scenario
      // For preview purposes, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTestResults(prev => ({ ...prev, verification: 'success' }));
      alert(`Test verification email would be sent to: ${testEmail}`);
    } catch {
      setTestResults(prev => ({ ...prev, verification: 'error' }));
      alert('Failed to send test email');
    } finally {
      setIsTestingVerification(false);
    }
  };

  const sendTestWelcomeEmail = async () => {
    if (!testEmail || !/\S+@\S+\.\S+/.test(testEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsTestingWelcome(true);
    setTestResults(prev => ({ ...prev, welcome: 'pending' }));

    try {
      // This would call your actual email function in a real scenario
      // For preview purposes, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTestResults(prev => ({ ...prev, welcome: 'success' }));
      alert(`Test welcome email would be sent to: ${testEmail}`);
    } catch {
      setTestResults(prev => ({ ...prev, welcome: 'error' }));
      alert('Failed to send test email');
    } finally {
      setIsTestingWelcome(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-400" />;
      case 'pending': return <AlertTriangle className="h-5 w-5 text-yellow-400 animate-pulse" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">📧 Email Template Preview</h1>
          <p className="text-xl text-zinc-300 mb-8">
            Test email templates with logo attachments
          </p>
        </div>

        {/* Email Testing Section */}
        <div className="bg-zinc-800 rounded-xl p-8 border border-zinc-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Mail className="h-6 w-6" />
            <span>Email Testing</span>
          </h2>

          <div className="mb-6">
            <label htmlFor="testEmail" className="block text-white font-medium mb-2">
              Test Email Address
            </label>
            <input
              type="email"
              id="testEmail"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email to receive test emails"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Verification Email Test */}
            <div className="bg-zinc-700/50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Verification Email</h3>
                {getStatusIcon(testResults.verification)}
              </div>
              <p className="text-zinc-300 text-sm mb-4">
                Tests the email verification template with logo attachment
              </p>
              <button
                onClick={sendTestVerificationEmail}
                disabled={isTestingVerification || !testEmail}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isTestingVerification ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Test</span>
                  </>
                )}
              </button>
            </div>

            {/* Welcome Email Test */}
            <div className="bg-zinc-700/50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Welcome Email</h3>
                {getStatusIcon(testResults.welcome)}
              </div>
              <p className="text-zinc-300 text-sm mb-4">
                Tests the welcome email template with logo attachment
              </p>
              <button
                onClick={sendTestWelcomeEmail}
                disabled={isTestingWelcome || !testEmail}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isTestingWelcome ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Test</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Email Template Preview */}
        <div className="bg-zinc-800 rounded-xl p-8 border border-zinc-700">
          <h2 className="text-2xl font-bold text-white mb-6">📋 Template Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">✅ What's Included</h3>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Professional logo via CID attachment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Responsive HTML design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Dark theme branding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Cross-email client compatibility</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Security headers and validation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Rate limiting protection</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">🔧 Technical Implementation</h3>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Logo fetched from /logo.png</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Base64 encoded attachment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Content-ID: "cid:logo" reference</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Graceful fallback if logo fails</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Dual domain support (custom/default)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Input sanitization & validation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>Note:</strong> To test actual email sending, you'll need to trigger the registration flow or use the Supabase Edge Functions directly.
              This preview shows the testing interface for validating email template functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;