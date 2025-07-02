import React from 'react';
import { Shield, Lock, Eye, Users, Database, Mail, ArrowLeft } from 'lucide-react';
import { navigateToLandingPage } from '../../utils/navigation';

const PrivacyPolicy: React.FC = () => {
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
            <Shield className="h-8 w-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Effective Date: January 1, 2025 • Research Phase Privacy Framework
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mt-6">
            <p className="text-indigo-200 text-sm">
              <strong>Research Phase Notice:</strong> This privacy policy covers our early access research program. 
              Your participation helps shape our platform development and privacy practices.
            </p>
          </div>
        </div>

        <div className="space-y-12 text-zinc-300">
          {/* What We Collect */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="h-6 w-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">What Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Early Access Research Data</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• <strong>Contact Information:</strong> Email address for early access communication</li>
                  <li>• <strong>User Type:</strong> Cat parent or cattery owner designation</li>
                  <li>• <strong>Geographic Location:</strong> Country/region for platform development planning</li>
                  <li>• <strong>Research Responses:</strong> Quiz answers and feature preference feedback</li>
                  <li>• <strong>Platform Interactions:</strong> Usage patterns to improve user experience</li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Technical Information</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• <strong>Analytics Data:</strong> Google Analytics for platform optimization</li>
                  <li>• <strong>Device Information:</strong> Browser type, device type for compatibility</li>
                  <li>• <strong>Usage Metrics:</strong> Page views, time spent, interaction patterns</li>
                  <li>• <strong>Cookies:</strong> Essential functionality and analytics (see Cookie Policy)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Research & Development</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Platform feature development and prioritization</li>
                  <li>• Pricing model research and optimization</li>
                  <li>• User experience design and testing</li>
                  <li>• Market demand analysis and validation</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">Early Access Communication</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Beta launch invitations and updates</li>
                  <li>• Feature previews and feedback requests</li>
                  <li>• Early access member benefits delivery</li>
                  <li>• Platform development progress updates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Information Sharing & Disclosure</h2>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-400 mb-3">We Do NOT Sell Your Data</h3>
              <p className="text-zinc-300">
                Your personal information is never sold to third parties. We are building a community-driven platform, 
                not a data-selling business.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Service Providers</h4>
                <p className="text-zinc-300 text-sm">
                  We share minimal data with trusted service providers (Supabase for data storage, Resend for emails, 
                  Google Analytics for platform optimization) under strict data protection agreements.
                </p>
              </div>

              <div className="bg-zinc-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Legal Requirements</h4>
                <p className="text-zinc-300 text-sm">
                  We may disclose information when required by law or to protect our rights and the safety of our users.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="h-6 w-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Data Security</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">Technical Safeguards</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• SSL/TLS encryption for all data transmission</li>
                  <li>• Secure cloud infrastructure (Supabase)</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Access controls and authentication</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">Operational Security</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Minimal data collection principle</li>
                  <li>• Regular data backup and recovery procedures</li>
                  <li>• Employee access restrictions</li>
                  <li>• Incident response and notification procedures</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Your Privacy Rights</h2>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">You Have the Right To:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• <strong>Access:</strong> Request copies of your personal data</li>
                  <li>• <strong>Rectification:</strong> Correct inaccurate information</li>
                  <li>• <strong>Deletion:</strong> Request removal of your data</li>
                  <li>• <strong>Portability:</strong> Export your data in common formats</li>
                </ul>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• <strong>Objection:</strong> Object to certain data processing</li>
                  <li>• <strong>Restriction:</strong> Limit how we process your data</li>
                  <li>• <strong>Withdrawal:</strong> Remove consent at any time</li>
                  <li>• <strong>Complaint:</strong> Contact data protection authorities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Early Access Specific */}
          <section className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 border border-indigo-500/30">
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="h-6 w-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Early Access Research Program</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-zinc-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Research Participation</h3>
                <p className="text-zinc-300 mb-4">
                  As an early access member, your feedback directly influences platform development. 
                  This includes survey responses, feature preferences, and usage patterns.
                </p>
                <div className="bg-amber-500/20 border border-amber-500/30 rounded p-3">
                  <p className="text-amber-200 text-sm">
                    <strong>Important:</strong> Your research participation data may be used in aggregated, 
                    anonymized reports to stakeholders and investors. Individual responses are never shared.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Early Access Benefits</h3>
                <p className="text-zinc-300">
                  Your early access status and associated benefits (special pricing, feature access) 
                  are tied to your email address and will be honored during platform launch.
                </p>
              </div>
            </div>
          </section>

          {/* Contact & Updates */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-6">Contact & Policy Updates</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Privacy Questions</h3>
                <p className="text-zinc-300 text-sm mb-3">
                  For privacy-related questions or to exercise your rights, contact us at:
                </p>
                <div className="bg-zinc-700/50 rounded p-3">
                  <p className="text-white font-mono text-sm">privacy@purrfectstays.org</p>
                  <p className="text-zinc-400 text-xs mt-1">Response within 48 hours</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Policy Updates</h3>
                <p className="text-zinc-300 text-sm mb-3">
                  We may update this policy during our research phase. Changes will be communicated via:
                </p>
                <ul className="text-zinc-300 text-sm space-y-1">
                  <li>• Email notification to early access members</li>
                  <li>• Website announcement banner</li>
                  <li>• Updated effective date at top of policy</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Research Phase Notice */}
          <section className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-8 border border-amber-500/30">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Research Phase Transparency</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                <strong>Current Status:</strong> We are in active research and development phase. 
                This privacy policy reflects our commitment to protecting your data while building 
                the platform with community input.
              </p>
              <p>
                <strong>Platform Launch:</strong> When we transition from research to live platform 
                (targeted Q1 2026), we will update this policy and obtain fresh consent for any 
                new data processing activities.
              </p>
              <p>
                <strong>Your Control:</strong> You can withdraw from our research program at any time 
                by contacting us. Your early access benefits will be preserved if you choose to 
                re-engage before platform launch.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;