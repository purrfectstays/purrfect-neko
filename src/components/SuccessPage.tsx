import React, { useState } from 'react';
import { CheckCircle, Calendar, Share2, Copy, Check } from 'lucide-react';
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
            Congratulations! 🎉
          </h1>
          
          <p className="text-xl text-slate-300 mb-4">
            Thank you for taking the time to complete our qualification quiz!
          </p>
          
          <p className="text-lg text-green-400 mb-8 font-semibold">
            🎊 You've successfully joined the Purrfect Stays waitlist and secured your spot in our exclusive early access program!
          </p>
        </div>

        {/* Thank You Message */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6 mb-8 text-center">
          <h3 className="text-xl font-semibold text-green-400 mb-3">
            🙏 Thank You for Joining Us!
          </h3>
          <p className="text-slate-300">
            Your responses help us build a platform that truly serves the needs of cat parents and cattery owners. 
            We're excited to have you as part of our founding community and can't wait to share this journey with you!
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
                <h4 className="text-white font-medium">Platform Development Updates</h4>
                <p className="text-slate-400 text-sm">We'll send you exclusive updates on our development progress and new features.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h4 className="text-white font-medium">Beta Access Invitation</h4>
                <p className="text-slate-400 text-sm">As an early access member, you'll be among the first to test our platform.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h4 className="text-white font-medium">Exclusive Benefits</h4>
                <p className="text-slate-400 text-sm">Enjoy special pricing, priority support, and influence over our feature roadmap.</p>
              </div>
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