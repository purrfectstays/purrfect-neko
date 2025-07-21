import React from 'react';
import { TrendingUp, Shield, Users, Star, Crown } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

const SocialProof: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-zinc-900 to-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start lg:items-center">
          {/* Trust Indicators */}
          <div className="space-y-8">
            <div>
              <h2 className="font-manrope font-bold text-3xl text-white mb-6">
                Join the Early Access Community
              </h2>
              <p className="font-manrope text-lg text-zinc-300 mb-8">
                Be part of an exclusive group of cat enthusiasts and industry professionals 
                who are shaping the future of cattery bookings from day one.
              </p>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-center space-x-4 p-4 lg:p-6 bg-zinc-800/50 rounded-xl border border-yellow-800/30 hover:border-yellow-600/50 transition-all duration-300">
                <div className="flex-shrink-0">
                  <Crown className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-manrope font-semibold text-white text-base lg:text-lg">Early Access Exclusive</h4>
                  <p className="font-manrope text-sm lg:text-base text-zinc-400 mt-1">Limited spots with early access benefits</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 lg:p-6 bg-zinc-800/50 rounded-xl border border-green-800/30 hover:border-green-600/50 transition-all duration-300">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-manrope font-semibold text-white text-base lg:text-lg">Rapid Community Growth</h4>
                  <p className="font-manrope text-sm lg:text-base text-zinc-400 mt-1">Cat parents and cattery owners joining daily from across the country</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 lg:p-6 bg-zinc-800/50 rounded-xl border border-blue-800/30 hover:border-blue-600/50 transition-all duration-300">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-manrope font-semibold text-white text-base lg:text-lg">Industry Expertise</h4>
                  <p className="font-manrope text-sm lg:text-base text-zinc-400 mt-1">Built by cat lovers with deep cattery industry knowledge</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 lg:p-6 bg-zinc-800/50 rounded-xl border border-purple-800/30 hover:border-purple-600/50 transition-all duration-300">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-manrope font-semibold text-white text-base lg:text-lg">Community-First Approach</h4>
                  <p className="font-manrope text-sm lg:text-base text-zinc-400 mt-1">Every feature is designed based on real user feedback and needs</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-6 border border-indigo-500/20">
                <h4 className="font-manrope font-bold text-lg text-white mb-4 flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <span>Early Access Member Privileges:</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-manrope text-zinc-300 text-sm">Shape product development</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-manrope text-zinc-300 text-sm">First access to new features</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-manrope text-zinc-300 text-sm">Exclusive beta access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-manrope text-zinc-300 text-sm">Direct founder communication</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-manrope text-zinc-300 text-sm">Priority customer support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-manrope text-zinc-300 text-sm">Early access member recognition</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Trust Signals */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
              <h4 className="font-manrope font-bold text-lg text-green-400 mb-3">
                🛡️ Why Trust Purrfect Stays?
              </h4>
              <div className="space-y-2">
                <p className="font-manrope text-zinc-300 text-sm">
                  ✅ <strong>Transparent Development:</strong> Regular updates on our progress and milestones
                </p>
                <p className="font-manrope text-zinc-300 text-sm">
                  ✅ <strong>Industry Research:</strong> Building relationships with cattery professionals
                </p>
                <p className="font-manrope text-zinc-300 text-sm">
                  ✅ <strong>Data Security:</strong> Enterprise-grade security for all user information
                </p>
                <p className="font-manrope text-zinc-300 text-sm">
                  ✅ <strong>No-Risk Commitment:</strong> Free to join, unsubscribe anytime
                </p>
              </div>
            </div>
          </div>

          {/* Countdown Timer - Better Desktop Alignment */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm lg:max-w-md">
              <CountdownTimer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;