import React from 'react';
import { Cookie, BarChart3, Cog, Shield, X, Check, ArrowLeft } from 'lucide-react';
import { navigateToLandingPage } from '../../utils/navigation';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back to Landing Page */}
        <div className="mb-8">
          <button
            onClick={navigateToLandingPage}
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Landing Page</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Cookie className="h-8 w-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Effective Date: January 1, 2025 • Research Phase Cookie Usage
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mt-6">
            <p className="text-indigo-200 text-sm">
              <strong>Research Phase Notice:</strong> Our cookie usage is focused on improving the platform 
              and understanding user preferences during our early access research program.
            </p>
          </div>
        </div>

        <div className="space-y-12 text-zinc-300">
          {/* What Are Cookies */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Cookie className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">What Are Cookies?</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-zinc-300 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you interact with our platform during the research phase.
              </p>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">Research Phase Context</h3>
                <p className="text-zinc-300">
                  During our early access research program, cookies help us understand user behavior, 
                  test different features, and optimize the platform for future launch. All cookie usage 
                  is aligned with our research objectives and privacy commitments.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-8">Types of Cookies We Use</h2>
            
            <div className="grid gap-6">
              {/* Essential Cookies */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-green-400">Essential Cookies</h3>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">REQUIRED</span>
                </div>
                <p className="text-zinc-300 mb-4">
                  These cookies are necessary for the platform to function properly and cannot be disabled.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2">Authentication</h4>
                    <p className="text-zinc-300 text-sm">Session management and security tokens</p>
                  </div>
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2">Form Progress</h4>
                    <p className="text-zinc-300 text-sm">Saving quiz progress and registration steps</p>
                  </div>
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2">Security</h4>
                    <p className="text-zinc-300 text-sm">CSRF protection and secure browsing</p>
                  </div>
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2">Preferences</h4>
                    <p className="text-zinc-300 text-sm">Language and accessibility settings</p>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-blue-400">Analytics & Research Cookies</h3>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">RESEARCH</span>
                </div>
                <p className="text-zinc-300 mb-4">
                  These cookies help us understand how users interact with our platform during the research phase.
                </p>
                <div className="space-y-4">
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2">Google Analytics</h4>
                    <p className="text-zinc-300 text-sm mb-3">
                      Tracks page views, user journeys, and platform performance to optimize user experience.
                    </p>
                    <div className="grid md:grid-cols-3 gap-2 text-xs">
                      <div className="bg-zinc-600/50 rounded p-2">
                        <span className="text-blue-400">_ga:</span> <span className="text-zinc-400">2 years</span>
                      </div>
                      <div className="bg-zinc-600/50 rounded p-2">
                        <span className="text-blue-400">_ga_*:</span> <span className="text-zinc-400">2 years</span>
                      </div>
                      <div className="bg-zinc-600/50 rounded p-2">
                        <span className="text-blue-400">_gid:</span> <span className="text-zinc-400">24 hours</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2">Platform Research</h4>
                    <p className="text-zinc-300 text-sm">
                      Custom analytics to understand feature usage, quiz completion rates, and user preferences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Functionality Cookies */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Cog className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-purple-400">Functionality Cookies</h3>
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">ENHANCED</span>
                </div>
                <p className="text-zinc-300 mb-4">
                  These cookies enhance your experience by remembering your choices and preferences.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2">User Preferences</h4>
                    <p className="text-zinc-300 text-sm">Chatbot interactions, theme preferences, form auto-save</p>
                  </div>
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2">Research Progress</h4>
                    <p className="text-zinc-300 text-sm">Quiz progress, early access status, feature test participation</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Research-Specific Usage */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-6">Research Phase Cookie Usage</h2>
            
            <div className="space-y-6">
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Platform Development Research</h3>
                <p className="text-zinc-300 mb-4">
                  Cookies help us understand how users navigate our research platform, which features are most engaging, 
                  and where improvements are needed before commercial launch.
                </p>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• <strong>User Journey Analysis:</strong> Understanding the path from landing page to quiz completion</li>
                  <li>• <strong>Feature Testing:</strong> A/B testing different platform elements and messaging</li>
                  <li>• <strong>Performance Optimization:</strong> Identifying slow-loading pages or problematic flows</li>
                  <li>• <strong>Conversion Research:</strong> Understanding what motivates early access sign-ups</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">Community Building Insights</h3>
                <p className="text-zinc-300 mb-4">
                  We use cookie data to understand our growing early access community and tailor communications effectively.
                </p>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• <strong>Geographic Distribution:</strong> Understanding where our early access members are located</li>
                  <li>• <strong>User Type Patterns:</strong> Analyzing cat parent vs cattery owner engagement</li>
                  <li>• <strong>Feature Preferences:</strong> Which platform features generate the most interest</li>
                  <li>• <strong>Communication Effectiveness:</strong> How users respond to different messaging approaches</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-6">Third-Party Services</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Google Analytics</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  We use Google Analytics to understand platform usage and optimize user experience.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-zinc-300 text-sm">Anonymized IP addresses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-zinc-300 text-sm">No personal data shared</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-zinc-300 text-sm">Research-focused configuration</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Supabase Platform</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Our backend platform uses cookies for secure authentication and data storage.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-zinc-300 text-sm">Secure session management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-zinc-300 text-sm">GDPR compliant infrastructure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-zinc-300 text-sm">EU data protection standards</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-6">Managing Your Cookie Preferences</h2>
            
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Browser Controls</h3>
                <p className="text-zinc-300 mb-4">
                  Most browsers allow you to control cookies through their settings. You can:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-zinc-300 text-sm">
                    <li>• View which cookies are stored on your device</li>
                    <li>• Delete existing cookies</li>
                    <li>• Block cookies from specific sites</li>
                    <li>• Block all cookies (may affect functionality)</li>
                  </ul>
                  <ul className="space-y-2 text-zinc-300 text-sm">
                    <li>• Set cookies to expire when you close your browser</li>
                    <li>• Enable private/incognito browsing</li>
                    <li>• Configure cookie notifications</li>
                    <li>• Manage third-party cookie settings</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">Impact on Research Platform</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                      <X className="h-4 w-4 text-red-400" />
                      <span>Blocking Essential Cookies</span>
                    </h4>
                    <p className="text-zinc-300 text-sm">May prevent platform functionality, login, and quiz progress saving</p>
                  </div>
                  <div className="bg-zinc-700/50 rounded p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                      <X className="h-4 w-4 text-red-400" />
                      <span>Blocking Analytics Cookies</span>
                    </h4>
                    <p className="text-zinc-300 text-sm">Reduces our ability to improve the platform based on usage patterns</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Opting Out */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-6">Opting Out of Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Google Analytics Opt-Out</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on:
                </p>
                <div className="bg-zinc-700/50 rounded p-3">
                  <p className="text-indigo-300 text-sm font-mono">tools.google.com/dlpage/gaoptout</p>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Contact Us for Opt-Out</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  You can also contact us directly to opt out of research analytics while maintaining platform functionality:
                </p>
                <div className="bg-zinc-700/50 rounded p-3">
                  <p className="text-white font-mono text-sm">privacy@purrfectstays.org</p>
                  <p className="text-zinc-400 text-xs mt-1">Subject: Analytics Opt-Out Request</p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates and Contact */}
          <section className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 border border-indigo-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">Policy Updates and Contact</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Policy Updates</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  We may update this cookie policy during our research phase to reflect new functionality or research needs.
                </p>
                <ul className="text-zinc-300 text-sm space-y-1">
                  <li>• Updates posted with new effective date</li>
                  <li>• Significant changes communicated via email</li>
                  <li>• Commercial launch will bring updated policy</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Questions About Cookies</h3>
                <p className="text-zinc-300 text-sm mb-3">
                  For questions about our cookie usage or to exercise your privacy rights:
                </p>
                <div className="bg-zinc-700/50 rounded p-3">
                  <p className="text-white font-mono text-sm">privacy@purrfectstays.org</p>
                  <p className="text-zinc-400 text-xs mt-1">Response within 48 hours</p>
                </div>
              </div>
            </div>
          </section>

          {/* Research Transparency */}
          <section className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-8 border border-amber-500/30">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Research Phase Transparency</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                <strong>Current Status:</strong> Our cookie usage during the research phase is minimal and focused on 
                improving the platform for commercial launch. We prioritize transparency and user control.
              </p>
              <p>
                <strong>Commercial Launch:</strong> When we transition to a live platform (Q1 2026), we will update 
                our cookie practices and provide clear options for managing your preferences.
              </p>
              <p>
                <strong>Your Control:</strong> You maintain full control over your cookie preferences throughout the 
                research phase and beyond. We respect your choices and privacy.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;