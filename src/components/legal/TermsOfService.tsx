import React from 'react';
import { FileText, Users, Zap, Crown, AlertTriangle, Scale, ArrowLeft } from 'lucide-react';
import { navigateToLandingPage } from '../../utils/navigation';

const TermsOfService: React.FC = () => {
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
            <FileText className="h-8 w-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Effective Date: January 1, 2025 • Early Access Research Program Terms
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mt-6">
            <p className="text-indigo-200 text-sm">
              <strong>Research Phase Terms:</strong> These terms govern your participation in our early access research program 
              and community-driven platform development.
            </p>
          </div>
        </div>

        <div className="space-y-12 text-zinc-300">
          {/* Acceptance and Research Program */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Early Access Research Program</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Program Overview</h3>
                <p className="text-zinc-300 mb-4">
                  By accessing our platform, you are participating in our early access research program. 
                  This is not a fully operational commercial platform but a research environment designed 
                  to test concepts, gather feedback, and develop the future Purrfect Stays platform.
                </p>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• <strong>Research Phase:</strong> Current phase focused on concept validation and community building</li>
                  <li>• <strong>Beta Launch:</strong> Targeted for Q4 2025 with limited early access member participation</li>
                  <li>• <strong>Commercial Launch:</strong> Planned for Q1 2026 with full platform functionality</li>
                  <li>• <strong>Community Input:</strong> Your feedback directly influences platform development</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">Acceptance of Terms</h3>
                <p className="text-zinc-300">
                  By using our platform, submitting information, or participating in our research activities, 
                  you agree to these terms. If you do not agree, please do not use our platform or provide any information.
                </p>
              </div>
            </div>
          </section>

          {/* Early Access Benefits & Obligations */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Crown className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Early Access Member Benefits & Responsibilities</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Your Benefits</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Priority access to beta testing (Q4 2025)</li>
                  <li>• Founding member pricing and features</li>
                  <li>• Direct influence on platform development</li>
                  <li>• Early access member recognition</li>
                  <li>• Beta feature testing opportunities</li>
                  <li>• Priority customer support</li>
                  <li>• Community advisory group participation</li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Your Responsibilities</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Provide honest, constructive feedback</li>
                  <li>• Participate in research activities when requested</li>
                  <li>• Maintain confidentiality of unreleased features</li>
                  <li>• Use the platform for legitimate research purposes</li>
                  <li>• Report bugs and issues during testing</li>
                  <li>• Respect other community members</li>
                  <li>• Follow platform guidelines and policies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Platform Evolution & Changes */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="h-6 w-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Platform Evolution & Changes</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Development Process</h3>
                <p className="text-zinc-300 mb-4">
                  As a research-phase platform, we reserve the right to modify, update, or completely change 
                  features, pricing models, and functionality based on community feedback and research findings.
                </p>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• <strong>Feature Changes:</strong> Features may be added, modified, or removed during research</li>
                  <li>• <strong>Pricing Research:</strong> We are actively researching pricing models with community input</li>
                  <li>• <strong>Platform Direction:</strong> Major decisions influenced by early access member feedback</li>
                  <li>• <strong>Communication:</strong> Changes communicated through email and platform announcements</li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Grandfathered Benefits</h3>
                <p className="text-zinc-300">
                  Early access members will retain their founding member status and associated benefits 
                  even as the platform evolves. Specific benefits will be clearly communicated before 
                  commercial launch.
                </p>
              </div>
            </div>
          </section>

          {/* Data and Research */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Research Data and Feedback</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">Feedback and Data Usage</h3>
                <p className="text-zinc-300 mb-4">
                  Your participation generates valuable research data that helps us build a better platform. 
                  By participating, you grant us the right to:
                </p>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Use aggregated, anonymized feedback in product development</li>
                  <li>• Include anonymized insights in investor and stakeholder reports</li>
                  <li>• Analyze usage patterns to improve user experience</li>
                  <li>• Share general research findings with the broader cat community</li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">What We Don't Do</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• We never share individual responses or personal data</li>
                  <li>• We don't sell your information to third parties</li>
                  <li>• We don't use your data for unrelated commercial purposes</li>
                  <li>• We don't share specific feedback without explicit permission</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Pricing Research and Future Commitments */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Scale className="h-6 w-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Pricing Research and Commitments</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Current Research Phase</h3>
                <p className="text-zinc-300 mb-4">
                  We are actively researching pricing models including subscription tiers, commission-based systems, 
                  and hybrid approaches. Your input directly influences our final pricing structure.
                </p>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• <strong>Cat Parents:</strong> Platform will remain free for cat parents</li>
                  <li>• <strong>Cattery Owners:</strong> Final pricing model determined by community research</li>
                  <li>• <strong>Early Access:</strong> Founding member rates secured regardless of final model</li>
                  <li>• <strong>Transparency:</strong> All pricing decisions communicated clearly to members</li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Future Pricing Commitments</h3>
                <p className="text-zinc-300">
                  Early access members will receive founding member pricing that will be more favorable 
                  than standard pricing regardless of which model we ultimately choose. Specific rates 
                  will be communicated at least 90 days before commercial launch.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers and Limitations */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Research Phase Disclaimers</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Platform Status</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• This is a research and development platform, not a commercial service</li>
                  <li>• No actual cattery bookings or transactions are processed during research phase</li>
                  <li>• Platform features may change significantly based on research findings</li>
                  <li>• Beta testing (Q4 2025) will include limited functionality with select members</li>
                  <li>• Full commercial platform expected Q1 2026</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">Limitation of Liability</h3>
                <p className="text-zinc-300 text-sm">
                  During the research phase, our platform is provided "as-is" for research and feedback purposes. 
                  We are not liable for any issues related to research phase participation, though we are committed 
                  to protecting your data and honoring early access commitments.
                </p>
              </div>
            </div>
          </section>

          {/* Community Guidelines */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Community Guidelines</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Encouraged Behavior</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Provide constructive, honest feedback</li>
                  <li>• Share relevant experiences and insights</li>
                  <li>• Ask questions about platform development</li>
                  <li>• Suggest features or improvements</li>
                  <li>• Participate in community discussions</li>
                  <li>• Report bugs or issues promptly</li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Prohibited Behavior</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Sharing confidential or unreleased information</li>
                  <li>• Attempting to disrupt platform functionality</li>
                  <li>• Providing false or misleading information</li>
                  <li>• Violating others' privacy or rights</li>
                  <li>• Using platform for commercial promotion</li>
                  <li>• Harassing other community members</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact and Resolution */}
          <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-6">Contact and Dispute Resolution</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Platform Questions</h3>
                <p className="text-zinc-300 text-sm mb-3">
                  For questions about terms, early access benefits, or platform development:
                </p>
                <div className="bg-zinc-700/50 rounded p-3 mb-4">
                  <p className="text-white font-mono text-sm">support@purrfectstays.org</p>
                  <p className="text-zinc-400 text-xs mt-1">Response within 24 hours</p>
                </div>
                
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Legal Questions</h3>
                <div className="bg-zinc-700/50 rounded p-3">
                  <p className="text-white font-mono text-sm">legal@purrfectstays.org</p>
                  <p className="text-zinc-400 text-xs mt-1">Response within 48 hours</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Dispute Resolution</h3>
                <p className="text-zinc-300 text-sm mb-3">
                  We are committed to resolving any disputes fairly and quickly:
                </p>
                <ol className="text-zinc-300 text-sm space-y-2 list-decimal list-inside">
                  <li>Contact our support team for direct resolution</li>
                  <li>Escalation to management for complex issues</li>
                  <li>Mediation through neutral third party if needed</li>
                  <li>Final binding arbitration as last resort</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Terms Updates and Future */}
          <section className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 border border-indigo-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">Terms Updates and Platform Evolution</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Research Phase Updates</h3>
                <p className="text-zinc-300 mb-4">
                  These terms may be updated during our research phase to reflect platform evolution. 
                  We will notify all early access members of significant changes via email.
                </p>
                <ul className="text-zinc-300 text-sm space-y-1">
                  <li>• Minor updates: 7 days advance notice</li>
                  <li>• Major changes: 30 days advance notice</li>
                  <li>• Platform launch: New commercial terms with grandfathered benefits</li>
                </ul>
              </div>

              <div className="bg-zinc-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Transition to Commercial Platform</h3>
                <p className="text-zinc-300">
                  When we launch the commercial platform (targeted Q1 2026), we will provide new terms 
                  of service that govern the live platform. Early access members will have 90 days to 
                  review and accept commercial terms while retaining their founding member benefits.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-8 border border-amber-500/30">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Thank You for Building With Us</h2>
            <p className="text-zinc-300 text-lg leading-relaxed">
              Your participation in our early access research program is invaluable. Together, we're building 
              a platform that truly serves the cat community. These terms protect both you and us during this 
              exciting development journey, ensuring transparency, fairness, and mutual benefit.
            </p>
            <p className="text-amber-200 text-sm mt-4">
              <strong>Questions?</strong> We're here to help. Contact us anytime at support@purrfectstays.org
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;