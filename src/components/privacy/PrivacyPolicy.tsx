import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">1. Information We Collect</h2>
              <div className="text-slate-300 space-y-3">
                <p><strong>Personal Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and email address (for waitlist registration)</li>
                  <li>User type (cat parent or cattery owner)</li>
                  <li>Quiz responses (for personalized experience)</li>
                  <li>Location data (country/region for service availability)</li>
                </ul>
                
                <p><strong>Technical Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and browser information</li>
                  <li>Usage analytics (with consent)</li>
                  <li>Cookie data for essential functionality</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">2. How We Use Your Information</h2>
              <div className="text-slate-300">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Manage your waitlist position and communicate updates</li>
                  <li>Personalize your experience based on quiz responses</li>
                  <li>Determine service availability in your region</li>
                  <li>Improve our platform through analytics (with consent)</li>
                  <li>Send verification and welcome emails</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">3. Legal Basis for Processing (GDPR)</h2>
              <div className="text-slate-300 space-y-3">
                <p><strong>Legitimate Interest:</strong> Waitlist management and service provision</p>
                <p><strong>Consent:</strong> Analytics tracking and marketing communications</p>
                <p><strong>Contract:</strong> Providing the service you signed up for</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">4. Data Retention</h2>
              <div className="text-slate-300 space-y-3">
                <p>We retain your personal data only as long as necessary:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Unverified accounts:</strong> 30 days from registration</li>
                  <li><strong>Verified accounts:</strong> Until you request deletion or 2 years of inactivity</li>
                  <li><strong>Verification tokens:</strong> 24 hours from creation</li>
                  <li><strong>Quiz sessions:</strong> 2 hours from completion</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">5. Your Rights (GDPR)</h2>
              <div className="text-slate-300">
                <p>Under GDPR, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at{' '}
                  <a href="mailto:privacy@purrfectstays.org" className="text-indigo-400 hover:text-indigo-300">
                    privacy@purrfectstays.org
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">6. Data Security</h2>
              <div className="text-slate-300">
                <p>We implement appropriate technical and organizational measures:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>HTTPS encryption for data transmission</li>
                  <li>Database-level security with row-level policies</li>
                  <li>Access controls and authentication</li>
                  <li>Regular security audits and updates</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">7. Third-Party Services</h2>
              <div className="text-slate-300 space-y-3">
                <p><strong>Supabase:</strong> Database hosting and authentication (EU-compliant)</p>
                <p><strong>Resend:</strong> Email delivery service</p>
                <p><strong>Google Analytics:</strong> Usage analytics (only with consent)</p>
                <p><strong>Vercel:</strong> Website hosting and deployment</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">8. Contact Information</h2>
              <div className="text-slate-300">
                <p><strong>Data Controller:</strong> Purrfect Stays</p>
                <p><strong>Email:</strong> privacy@purrfectstays.org</p>
                <p><strong>Data Protection Officer:</strong> dpo@purrfectstays.org</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">9. Updates to This Policy</h2>
              <div className="text-slate-300">
                <p>
                  This privacy policy may be updated from time to time. We will notify you of any 
                  material changes by email or through our platform.
                </p>
                <p className="mt-3">
                  <strong>Last updated:</strong> July 1, 2025
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};