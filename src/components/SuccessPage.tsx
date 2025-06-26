import React from 'react';
import { CheckCircle, Users, MapPin, Calendar } from 'lucide-react';
import RegionalUrgency from './RegionalUrgency';

const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Purrfect Stays! 🎉
          </h1>
          
          <p className="text-xl text-slate-300 mb-8">
            You've successfully secured your spot in our exclusive early access program.
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
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Share on Social Media
            </button>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
              Copy Referral Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;