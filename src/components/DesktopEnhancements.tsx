import React from 'react';
import { ArrowRight, Star, Users, Clock, Shield, TrendingUp, MapPin, Zap } from 'lucide-react';

// Desktop-specific enhanced features
const DesktopFeatures: React.FC = () => {
  return (
    <div className="hidden lg:block bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-8 mx-4 mb-8">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Why Choose Purrfect Stays?
      </h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="h-8 w-8 text-green-400" />
            <h4 className="font-bold text-green-400">Verified Catteries</h4>
          </div>
          <p className="text-zinc-300 text-sm">
            Every cattery is thoroughly vetted, licensed, and reviewed by our expert team
          </p>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="h-8 w-8 text-blue-400" />
            <h4 className="font-bold text-blue-400">Real-Time Availability</h4>
          </div>
          <p className="text-zinc-300 text-sm">
            See live availability, book instantly, and get immediate confirmation
          </p>
        </div>
        
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="h-8 w-8 text-purple-400" />
            <h4 className="font-bold text-purple-400">Location-Based Search</h4>
          </div>
          <p className="text-zinc-300 text-sm">
            Find the perfect cattery near you with interactive maps and distance filtering
          </p>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Star className="h-8 w-8 text-yellow-400" />
            <h4 className="font-bold text-yellow-400">Trusted Reviews</h4>
          </div>
          <p className="text-zinc-300 text-sm">
            Read authentic reviews from verified cat parents in your area
          </p>
        </div>
        
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="h-8 w-8 text-indigo-400" />
            <h4 className="font-bold text-indigo-400">Smart Matching</h4>
          </div>
          <p className="text-zinc-300 text-sm">
            AI-powered recommendations based on your cat's specific needs and preferences
          </p>
        </div>
        
        <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="h-8 w-8 text-pink-400" />
            <h4 className="font-bold text-pink-400">Growth Partnership</h4>
          </div>
          <p className="text-zinc-300 text-sm">
            For cattery owners: Grow your business with our marketing and booking tools
          </p>
        </div>
      </div>
    </div>
  );
};

// Desktop-specific statistics and social proof
const DesktopStats: React.FC = () => {
  return (
    <div className="hidden lg:block bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 mx-4 mb-8 border border-indigo-500/30">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Join the Growing Community
      </h3>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-400 mb-2">500+</div>
          <div className="text-zinc-300">Early Access Members</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
          <div className="text-zinc-300">Partner Catteries</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">99%</div>
          <div className="text-zinc-300">Satisfaction Rate</div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-zinc-300 mb-4">
          "Finally, a platform that understands both cat parents and cattery owners"
        </p>
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-sm text-zinc-400 mt-2">Sarah M., Auckland</p>
      </div>
    </div>
  );
};

// Desktop-enhanced call-to-action
const DesktopCTA: React.FC = () => {
  return (
    <div className="hidden lg:block bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 mx-4 mb-8 text-center">
      <h3 className="text-2xl font-bold text-white mb-4">
        Ready to Transform Your Cat Care Experience?
      </h3>
      
      <p className="text-lg text-zinc-300 mb-6 max-w-2xl mx-auto">
        Join our exclusive early access community and help shape the future of cattery bookings. 
        Get premium features, priority support, and special launch pricing.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center space-x-3">
          <span>Start Your Journey</span>
          <ArrowRight className="h-5 w-5" />
        </button>
        
        <div className="text-sm text-zinc-400">
          <p>🔒 No commitment • 🎯 Free to join • 💎 Early access benefits</p>
        </div>
      </div>
    </div>
  );
};

// Main desktop enhancements component
const DesktopEnhancements: React.FC = () => {
  return (
    <div className="desktop-enhancements">
      <DesktopFeatures />
      <DesktopStats />
      <DesktopCTA />
    </div>
  );
};

export default DesktopEnhancements;