import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Calendar, Share2, Copy, Check, FileText, Shield, Gift, Trophy, Users, MapPin, TrendingUp, Star } from 'lucide-react';
import RegionalUrgency from './RegionalUrgency';

const SuccessPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Purrfect Stays - The Ultimate Cattery Booking Platform',
      text: 'I just joined the waitlist for Purrfect Stays, the revolutionary platform connecting cat parents with premium catteries! 🐱✨',
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: open Twitter share dialog
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        window.open(twitterUrl, '_blank');
      }
    } catch (error) {
      console.log('Share cancelled or failed');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      // Clear existing timeout and set new one
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.origin;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      // Clear existing timeout and set new one
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <main role="main" aria-labelledby="success-heading">
          <div className="text-center mb-8">
            <div 
              className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
              aria-hidden="true"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            
            <h1 
              id="success-heading"
              className="text-4xl font-bold text-white mb-4"
            >
              Welcome to Our Founding Community! <span aria-hidden="true">🎉</span>
            </h1>
          
          <p className="text-xl text-slate-300 mb-4">
            Thank you for helping us build the cattery platform the world needs!
          </p>
          
          <p className="text-lg text-green-400 mb-6 font-semibold">
            🎊 You're now part of an exclusive group shaping the future of cattery bookings from day one!
          </p>
          
          {/* Immediate Value - Free Guides CTA */}
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Gift className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Your Exclusive Welcome Gift!</h3>
            </div>
            <p className="text-slate-300 mb-6 text-center">
              As a thank you for joining, get instant access to our premium cat care guides - 
              normally reserved for paid members.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/early-access-resources'}
                onKeyDown={(e) => handleKeyDown(e, () => window.location.href = '/early-access-resources')}
                className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all inline-flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                aria-label="Access your free community guides and resources"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>Access Your Free Guides Now</span>
              </button>
              <button
                onClick={() => window.location.href = '/cat-travel-checklist'}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>View Travel Checklist</span>
              </button>
            </div>
          </div>
        </div>

        {/* Founding Community Message */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6 mb-8 text-center">
          <h3 className="text-xl font-semibold text-green-400 mb-3">
            🚀 You're a Founding Member!
          </h3>
          <p className="text-slate-300">
            Your quiz responses directly influence what we build. Every answer helps us prioritize features, 
            recruit the right catteries in your region, and create the platform cat parents and owners actually want. 
            This is community-driven development at its finest!
          </p>
        </div>

        {/* Community Position Status */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center justify-center">
              <Trophy className="h-6 w-6 mr-2" />
              Your Community Status
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">✓</div>
              <div className="text-sm text-slate-400">Registration Complete</div>
              <div className="text-xs text-green-400 mt-1">Welcome to the journey</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">🏠</div>
              <div className="text-sm text-slate-400">Your Location</div>
              <div className="text-xs text-purple-400 mt-1">Global community</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-green-400 mb-1">FOUNDING</div>
              <div className="text-sm text-slate-400">Member Tier</div>
              <div className="text-xs text-green-400 mt-1">💎 Premium benefits</div>
            </div>
          </div>

          <div className="bg-zinc-800/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Development Phase</span>
              <span className="text-sm text-indigo-400">Community Building</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{width: '25%'}}></div>
            </div>
            <div className="text-xs text-slate-400 mt-2">Phase 1: Market research & community feedback • Q4 2025 target launch</div>
          </div>
        </div>

        {/* Regional Position Card */}
        <RegionalUrgency variant="card" showDetails={true} className="mb-8" />

        {/* What's Next Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            What's Next?
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h4 className="text-white font-medium">Access Your Premium Cat Care Resources</h4>
                <p className="text-slate-400 text-sm">Use your exclusive travel checklist and cattery evaluation guide right now - these are normally paid resources.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h4 className="text-white font-medium">Shape Platform Development</h4>
                <p className="text-slate-400 text-sm">We'll regularly ask for your feedback on features, interface design, and cattery requirements based on your region.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h4 className="text-white font-medium">First Access to the Real Platform</h4>
                <p className="text-slate-400 text-sm">When we launch Q4 2025, you'll be the first to book with our verified cattery network and test real features.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Early Access Benefits Reminder */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-400 mb-3 text-center">
            🎯 What You Get as a Founding Member:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Free cat care guides (available now)</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Cattery evaluation resources</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">First platform access (Q4 2025)</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Direct input on development</span>
            </div>
          </div>
        </div>

        {/* Viral Referral Mechanics */}
        <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-xl p-6 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-green-400 mb-2 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Boost Your Position & Get Rewards
            </h3>
            <p className="text-slate-300 text-sm">
              Invite friends to help your region reach launch readiness faster and unlock exclusive benefits!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">📈 Position Boosts</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center justify-between bg-zinc-800/50 rounded p-2">
                  <span>1 referral</span>
                  <span className="text-green-400 font-semibold">Move up 10 positions</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-800/50 rounded p-2">
                  <span>3 referrals</span>
                  <span className="text-purple-400 font-semibold">Premium member group</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-800/50 rounded p-2">
                  <span>5 referrals</span>
                  <span className="text-yellow-400 font-semibold">Beta testing access</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-800/50 rounded p-2">
                  <span>10 referrals</span>
                  <span className="text-indigo-400 font-semibold">Advisory board seat</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">🌍 Regional Impact</h4>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Regional Development</span>
                  <span className="text-sm text-purple-400">Community Building</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <div className="text-xs text-slate-400">Early stage: Gathering community insights and feedback</div>
              </div>
              
              <div className="text-sm text-slate-300 space-y-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-2" />
                  <span>Phase 1: Market research & community building</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-purple-400 mr-2" />
                  <span>Phase 2: Platform development & cattery partnerships</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/30 rounded-lg p-4 text-center">
            <h4 className="text-lg font-semibold text-white mb-2">Share with Fellow Cat Lovers</h4>
            <div className="bg-zinc-900 rounded p-3 mb-3">
              <code className="text-green-400 text-sm">purrfectstays.org</code>
            </div>
            <p className="text-xs text-slate-400">Help grow our community by sharing with other cat parents and cattery owners!</p>
          </div>
        </div>

        {/* Global Community Dashboard */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-xl p-6 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-purple-400 mb-2 flex items-center justify-center">
              <Users className="h-6 w-6 mr-2" />
              Global Cat Community Leaderboard
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">🌍 Global Reach</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-zinc-800/50 rounded p-3">
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-bold mr-3">🌎</span>
                    <span className="text-slate-300">North America</span>
                  </div>
                  <span className="text-green-400 font-semibold">Building</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-800/50 rounded p-3 border-l-4 border-purple-500">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-3">🌍</span>
                    <span className="text-slate-300">Europe</span>
                  </div>
                  <span className="text-purple-400 font-semibold">Growing</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-800/50 rounded p-3">
                  <div className="flex items-center">
                    <span className="text-orange-400 font-bold mr-3">🌏</span>
                    <span className="text-slate-300">Asia Pacific</span>
                  </div>
                  <span className="text-orange-400 font-semibold">Starting</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-purple-400">Expanding globally with founding community input</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">📊 Your Community Role</h4>
              <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Founding Member</span>
                  <span className="text-sm text-purple-400">Confirmed</span>
                </div>
                <div className="text-xs text-slate-400 mb-3">Thank you for joining our early community!</div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Phase 1</span>
                    <span className="text-green-400">Community Building</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Phase 2</span>
                    <span className="text-slate-400">Market Research</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Phase 3</span>
                    <span className="text-slate-400">Platform Development</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-green-400">🎯 Building together globally!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Social Sharing */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-3">
            Share & Help Your Region Win! 🚀
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            Every share helps London reach 1,000 members and unlock beta access for your area first!
          </p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleShare}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on Social Media</span>
            </button>
            <button 
              onClick={handleCopyLink}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Referral Link'}</span>
            </button>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
};

export default SuccessPage;