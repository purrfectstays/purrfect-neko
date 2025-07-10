import React from 'react';
import { Download, FileText, Shield, CheckCircle, Star, Crown, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const EarlyAccessResources: React.FC = () => {
  const { userEmail, isVerified } = useApp();

  // Redirect to registration if not signed up
  const redirectToSignup = () => {
    window.location.href = '/register';
  };

  // Navigate to specific guides
  const navigateToGuide = (guide: string) => {
    switch (guide) {
      case 'travel-checklist':
        window.location.href = '/cat-travel-checklist';
        break;
      case 'evaluation-guide':
        window.location.href = '/cattery-evaluation-guide';
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Crown className="h-5 w-5 text-purple-400" />
            <span className="text-purple-400 font-semibold text-sm">EARLY ACCESS MEMBER EXCLUSIVE</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Premium Cat Care Resources
          </h1>
          
          <p className="text-xl text-zinc-300 mb-6 max-w-3xl mx-auto">
            These professional-grade resources are always available to you. Bookmark this page or use the floating resource button on any page for quick access.
          </p>

          {userEmail && (
            <div className="bg-zinc-800/50 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center space-x-2">
                {isVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Shield className="h-5 w-5 text-yellow-400" />
                )}
                <span className="text-sm text-zinc-300">
                  Signed in as: {userEmail}
                </span>
              </div>
              {!isVerified && (
                <p className="text-xs text-yellow-400 mt-1">
                  Check your email to verify your account for full access
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Cat Travel Checklist */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-8 border border-indigo-500/20 hover:border-indigo-400/40 transition-all">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-indigo-500/20 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Cat Travel Checklist</h3>
                <p className="text-indigo-400 font-semibold">Ultimate Preparation Guide</p>
              </div>
            </div>
            
            <p className="text-zinc-300 mb-6">
              Comprehensive 4-phase checklist to ensure stress-free boarding for your cat. 
              Interactive format with progress tracking and expert tips.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-zinc-300">2-3 weeks before travel preparation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-zinc-300">Last week essentials checklist</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-zinc-300">Day of drop-off protocols</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-zinc-300">Complete packing guide</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigateToGuide('travel-checklist')}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-800 transition-all inline-flex items-center justify-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Access Interactive Guide</span>
              </button>
              <button
                onClick={() => window.open('/cat-travel-checklist.pdf', '_blank')}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Cattery Evaluation Guide */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Cattery Evaluation Guide</h3>
                <p className="text-purple-400 font-semibold">Professional Assessment Framework</p>
              </div>
            </div>
            
            <p className="text-zinc-300 mb-6">
              Professional 100-point scoring system to evaluate catteries across 4 key categories. 
              Includes red/green flags and weighted assessment criteria.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-zinc-300">Facility & cleanliness assessment (25%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-zinc-300">Staff & care quality evaluation (30%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-zinc-300">Health & medical protocols (25%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-zinc-300">Communication & transparency (20%)</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigateToGuide('evaluation-guide')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-800 transition-all inline-flex items-center justify-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Access Interactive Guide</span>
              </button>
              <button
                onClick={() => window.open('/cattery-evaluation-guide.pdf', '_blank')}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 border border-indigo-500/20">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">
            🚀 Quick Access Menu
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => window.location.href = '/cat-travel-checklist'}
              className="flex items-center space-x-3 bg-indigo-600/80 hover:bg-indigo-700 text-white p-4 rounded-lg transition-all"
            >
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Open Travel Checklist</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/cattery-evaluation-guide'}
              className="flex items-center space-x-3 bg-purple-600/80 hover:bg-purple-700 text-white p-4 rounded-lg transition-all"
            >
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Open Evaluation Guide</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-3 bg-green-600/80 hover:bg-green-700 text-white p-4 rounded-lg transition-all"
            >
              <Crown className="h-5 w-5" />
              <span className="font-semibold">Back to Platform</span>
            </button>
          </div>
        </div>
        
        {/* Additional Benefits */}
        <div className="mt-8 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 rounded-xl p-8 border border-zinc-600">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">
            More Founding Community Benefits
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-lg inline-block mb-3">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Cattery Directory Preview</h4>
              <p className="text-sm text-zinc-400">
                Early access to browse verified catteries in your area before public launch
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500/20 p-3 rounded-lg inline-block mb-3">
                <Star className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Beta Testing Invites</h4>
              <p className="text-sm text-zinc-400">
                First access to test new features and provide feedback that shapes the platform
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 p-3 rounded-lg inline-block mb-3">
                <Crown className="h-6 w-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Founder Updates</h4>
              <p className="text-sm text-zinc-400">
                Direct communication with founders about development progress and milestones
              </p>
            </div>
          </div>
        </div>

        {/* CTA for non-members */}
        {!userEmail && (
          <div className="mt-12 text-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-8 border border-indigo-500/20">
            <h3 className="text-2xl font-bold mb-4 text-white">Want Access to These Exclusive Resources?</h3>
            <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
              Join our early access community to get instant access to these comprehensive cat care guides 
              and be first in line for our cattery booking platform launch.
            </p>
            
            <button
              onClick={redirectToSignup}
              className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-800 transition-all inline-flex items-center space-x-2"
            >
              <span>Join Early Access Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-zinc-500 text-sm py-8">
        <p>© 2025 Purrfect Stays • Exclusive resources for early access members</p>
      </div>
    </div>
  );
};

export default EarlyAccessResources;