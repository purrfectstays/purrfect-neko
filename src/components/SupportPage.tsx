import React, { useState } from 'react';
import { Mail, MessageCircle, Clock, Phone, HelpCircle, Users, Zap, FileText, ArrowLeft } from 'lucide-react';
import { navigateToLandingPage } from '../utils/navigation';

const SupportPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('general');

  const supportCategories = {
    general: {
      icon: HelpCircle,
      title: 'General Questions',
      color: 'indigo',
      faqs: [
        {
          question: 'What is the early access research program?',
          answer: 'Our early access program allows you to participate in shaping the future Purrfect Stays platform. You provide feedback on features, pricing models, and user experience while securing founding member benefits for the commercial launch.'
        },
        {
          question: 'When will the platform launch?',
          answer: 'Beta testing begins Q4 2025 for early access members, with full commercial launch targeted for Q1 2026. Your research participation helps determine exact timing and feature priorities.'
        },
        {
          question: 'Is early access really free?',
          answer: 'Yes! Early access participation is completely free. You help us build the platform and secure founding member benefits without any cost or commitment.'
        },
        {
          question: 'What happens to my data if I stop participating?',
          answer: 'You can withdraw from the research program at any time. We will delete your personal data upon request, though anonymized insights may remain in our research. Your early access benefits are preserved if you choose to re-engage before launch.'
        }
      ]
    },
    technical: {
      icon: Zap,
      title: 'Technical Support',
      color: 'green',
      faqs: [
        {
          question: 'I cannot complete the registration form',
          answer: 'Try refreshing the page and ensure cookies are enabled. If the issue persists, contact us at support@purrfectstays.org with details about your browser and the specific error you are seeing.'
        },
        {
          question: 'The quiz is not saving my progress',
          answer: 'Quiz progress is automatically saved as you complete each section. Ensure cookies are enabled and avoid using private/incognito browsing. If you experience issues, we can restore your progress manually.'
        },
        {
          question: 'I did not receive the verification email',
          answer: 'Check your spam/junk folder first. Our emails come from noreply@purrfectstays.org. If you still cannot find it, contact support and we will resend or verify your account manually.'
        },
        {
          question: 'Truffle the chatbot is not responding',
          answer: 'Try refreshing the page. Truffle requires JavaScript to be enabled. If issues persist, you can contact human support directly through the methods listed below.'
        }
      ]
    },
    privacy: {
      icon: FileText,
      title: 'Privacy & Legal',
      color: 'purple',
      faqs: [
        {
          question: 'How is my personal data used?',
          answer: 'Your data is used solely for platform research and development. We analyze aggregated, anonymized patterns to improve features and user experience. Individual responses are never shared. See our Privacy Policy for complete details.'
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you have full control over your data. Contact privacy@purrfectstays.org to request account deletion. We will remove all personal information while preserving anonymized research insights.'
        },
        {
          question: 'What cookies do you use?',
          answer: 'We use essential cookies for platform functionality, analytics cookies for research (Google Analytics), and functionality cookies for user preferences. See our Cookie Policy for detailed information and opt-out options.'
        },
        {
          question: 'How do you protect my information?',
          answer: 'We use enterprise-grade security including SSL encryption, secure cloud infrastructure (Supabase), access controls, and regular security audits. Your data is protected according to GDPR and international privacy standards.'
        }
      ]
    },
    business: {
      icon: Users,
      title: 'Cattery Owners',
      color: 'amber',
      faqs: [
        {
          question: 'How can I participate as a cattery owner?',
          answer: 'Complete the early access registration and select "Cattery Owner" as your user type. You will be invited to participate in business-focused research including pricing model discussions and feature prioritization.'
        },
        {
          question: 'What pricing model will you use?',
          answer: 'We are actively researching pricing models including subscription tiers, commission-based systems, and hybrid approaches. As an early access member, your input directly influences our final decision. All early access members get founding member rates regardless of the final model.'
        },
        {
          question: 'When can I start listing my cattery?',
          answer: 'Cattery listings will be available during beta testing (Q4 2025). Early access members get priority access to create profiles and test all business features before public launch.'
        },
        {
          question: 'Will there be a commission on bookings?',
          answer: 'We are researching different pricing approaches. Commission-based pricing is one option under consideration, but no final decisions have been made. Your feedback as a cattery owner helps determine the most fair and sustainable model for everyone.'
        }
      ]
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'General questions and technical support',
      contact: 'support@purrfectstays.org',
      responseTime: 'Response within 24 hours',
      color: 'indigo'
    },
    {
      icon: FileText,
      title: 'Privacy & Legal',
      description: 'Data protection and legal questions',
      contact: 'privacy@purrfectstays.org',
      responseTime: 'Response within 48 hours',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Business Inquiries',
      description: 'Partnerships and cattery owner questions',
      contact: 'business@purrfectstays.org',
      responseTime: 'Response within 24 hours',
      color: 'green'
    },
    {
      icon: MessageCircle,
      title: 'Chat with Truffle',
      description: 'AI assistant for immediate help',
      contact: 'Available 24/7 on platform',
      responseTime: 'Instant responses',
      color: 'amber'
    }
  ];

  const currentCategory = supportCategories[selectedCategory as keyof typeof supportCategories];
  const IconComponent = currentCategory.icon;

  return (
    <div className="min-h-screen bg-zinc-900 py-20">
      <div className="max-w-6xl mx-auto px-4">
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
            <MessageCircle className="h-8 w-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Support & Help</h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Get help with our early access research program
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mt-6 max-w-3xl mx-auto">
            <p className="text-indigo-200 text-sm">
              <strong>Research Phase Support:</strong> We provide comprehensive support during our early access program. 
              Your questions help us improve both the platform and our support processes.
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How to Reach Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className={`bg-${method.color}-500/10 border border-${method.color}-500/30 rounded-xl p-6 text-center`}>
                <div className="flex justify-center mb-4">
                  <method.icon className={`h-8 w-8 text-${method.color}-400`} />
                </div>
                <h3 className={`text-lg font-semibold text-${method.color}-400 mb-2`}>{method.title}</h3>
                <p className="text-zinc-300 text-sm mb-3">{method.description}</p>
                <div className="bg-zinc-700/50 rounded p-3 mb-3">
                  <p className="text-white font-mono text-sm">{method.contact}</p>
                </div>
                <p className="text-zinc-400 text-xs">{method.responseTime}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-400">Choose a category to find answers to common questions</p>
          </div>

          {/* Category Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(supportCategories).map(([key, category]) => {
              const IconComp = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-all duration-300 ${
                    selectedCategory === key
                      ? `bg-${category.color}-500/20 border-${category.color}-500/50 text-${category.color}-400`
                      : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <IconComp className="h-5 w-5" />
                  <span className="font-medium">{category.title}</span>
                </button>
              );
            })}
          </div>

          {/* FAQ Content */}
          <div className={`bg-${currentCategory.color}-500/10 border border-${currentCategory.color}-500/30 rounded-xl p-8`}>
            <div className="flex items-center space-x-3 mb-6">
              <IconComponent className={`h-6 w-6 text-${currentCategory.color}-400`} />
              <h3 className={`text-2xl font-bold text-${currentCategory.color}-400`}>{currentCategory.title}</h3>
            </div>
            
            <div className="space-y-6">
              {currentCategory.faqs.map((faq, index) => (
                <div key={index} className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                  <h4 className="text-lg font-semibold text-white mb-3">{faq.question}</h4>
                  <p className="text-zinc-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Research Program Support */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 border border-indigo-500/30">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Research Program Support</h2>
              <p className="text-zinc-300 max-w-3xl mx-auto">
                As an early access research participant, you receive specialized support designed around 
                platform development and community building.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-6 w-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-green-400">Community Support</h3>
                </div>
                <p className="text-zinc-300 text-sm mb-4">
                  Connect with other early access members and share feedback through our community channels.
                </p>
                <ul className="text-zinc-400 text-xs space-y-1">
                  <li>• Early access member discussions</li>
                  <li>• Feature feedback sessions</li>
                  <li>• Beta testing coordination</li>
                </ul>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="h-6 w-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-purple-400">Priority Support</h3>
                </div>
                <p className="text-zinc-300 text-sm mb-4">
                  Early access members receive priority response times and direct access to the development team.
                </p>
                <ul className="text-zinc-400 text-xs space-y-1">
                  <li>• Faster response times</li>
                  <li>• Direct developer contact</li>
                  <li>• Bug report prioritization</li>
                </ul>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-6 w-6 text-amber-400" />
                  <h3 className="text-lg font-semibold text-amber-400">Extended Hours</h3>
                </div>
                <p className="text-zinc-300 text-sm mb-4">
                  Research phase support available with extended hours to accommodate global early access members.
                </p>
                <ul className="text-zinc-400 text-xs space-y-1">
                  <li>• Extended email support</li>
                  <li>• Global timezone coverage</li>
                  <li>• Research session support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Support */}
        <section className="mb-16">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Urgent Issues</h2>
              <p className="text-zinc-300">
                For urgent technical issues or security concerns during the research phase
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Technical Emergencies</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Platform downtime, data loss, or critical functionality issues
                </p>
                <div className="bg-zinc-700/50 rounded p-3">
                  <p className="text-white font-mono text-sm">urgent@purrfectstays.org</p>
                  <p className="text-zinc-400 text-xs mt-1">Response within 2 hours</p>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Security Concerns</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Data breaches, security vulnerabilities, or privacy issues
                </p>
                <div className="bg-zinc-700/50 rounded p-3">
                  <p className="text-white font-mono text-sm">security@purrfectstays.org</p>
                  <p className="text-zinc-400 text-xs mt-1">Response within 1 hour</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Hours */}
        <section className="text-center">
          <div className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Clock className="h-6 w-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Support Hours</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">General Support</h3>
                <p className="text-zinc-300 text-sm">Monday - Friday</p>
                <p className="text-zinc-300 text-sm">9:00 AM - 6:00 PM EST</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Research Support</h3>
                <p className="text-zinc-300 text-sm">Monday - Sunday</p>
                <p className="text-zinc-300 text-sm">Extended hours for global members</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Emergency Support</h3>
                <p className="text-zinc-300 text-sm">24/7 monitoring</p>
                <p className="text-zinc-300 text-sm">Urgent issues only</p>
              </div>
            </div>

            <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-200 text-sm">
                <strong>Note:</strong> Response times may vary during research phase development sprints. 
                We always acknowledge receipt within 4 hours and provide status updates for complex issues.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupportPage;