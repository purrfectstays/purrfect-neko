import React, { useState } from 'react';
import { CheckCircle, Calendar, Share2, Copy, Check, FileText, Shield, Gift } from 'lucide-react';
import RegionalUrgency from './RegionalUrgency';

const SuccessPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

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
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.origin;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Our Founding Community! 🎉
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
                className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all inline-flex items-center justify-center space-x-2"
              >
                <FileText className="h-4 w-4" />
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
            🎯 Your Early Access Benefits Are Now Active!
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Premium cat care guides (instant access)</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Professional cattery evaluation tools</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Priority platform beta access</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Direct founder communication</span>
            </div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-3">
            Help Us Grow Our Community! 🚀
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            Share Purrfect Stays with fellow cat parents and cattery owners to help us build the ultimate platform.
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
      </div>
    </div>
  );
};

export default SuccessPage;