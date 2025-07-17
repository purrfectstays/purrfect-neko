import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Users, Clock, Shield, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import OptimizedImage from './OptimizedImage';

const rotatingWords = [
  "Perfect",
  "Trusted", 
  "Ideal",
  "Safe",
  "Caring"
];

const HeroSection: React.FC = () => {
  const { setCurrentStep } = useApp();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex(prev => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="font-manrope font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight">
                The Future of{' '}
                <span 
                  className={`text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300 ${
                    isAnimating ? 'opacity-50 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
                  }`}
                >
                  {rotatingWords[currentWordIndex]}
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-lg">
                  Cattery Bookings
                </span>
              </h1>
              
              <p className="font-manrope text-lg sm:text-xl lg:text-2xl text-zinc-300 leading-relaxed">
                <span className="text-green-400 font-semibold">Cat Parents:</span> Find and book premium cattery care effortlessly<br />
                <span className="text-purple-400 font-semibold">Cattery Owners:</span> Connect with ideal clients and grow your business
              </p>
            </div>

            {/* Dual Value Props */}
            <div className="grid md:grid-cols-2 gap-6 py-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-6 w-6 text-green-400" />
                  <h3 className="font-manrope font-bold text-green-400">For Cat Parents</h3>
                </div>
                <p className="font-manrope text-zinc-300 text-sm">
                  Platform designed to be free for cat parents • Real-time availability • Verified catteries • Transparent pricing
                </p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                  <h3 className="font-manrope font-bold text-purple-400">For Cattery Owners</h3>
                </div>
                <p className="font-manrope text-zinc-300 text-sm">
                  Help shape our platform • Early access benefits • Premium listing tools • Automated bookings
                </p>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 py-8">
              <div className="flex items-center space-x-2 text-zinc-300">
                <Users className="h-5 w-5 text-indigo-400" />
                <span className="font-manrope">Building our early access community</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-manrope">Backed by industry expertise</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <Clock className="h-5 w-5 text-green-400" />
                <span className="font-manrope">Beta launching Q4 2025</span>
              </div>
            </div>

            {/* Enhanced CTA */}
            <div className="space-y-6">
              <button
                onClick={() => window.location.href = '/join'}
                className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-manrope font-bold text-lg px-8 py-4 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 inline-flex items-center space-x-3"
              >
                <span>Join in 60 Seconds</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="space-y-2">
                <p className="text-sm text-zinc-400 font-manrope">
                  🔒 No commitment required • 🎯 Free to join • 💎 Early access benefits
                </p>
                <p className="text-xs text-indigo-300 font-manrope">
                  Join our exclusive early access community shaping the future of cattery bookings
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image Section - Premium Cattery Showcase */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative max-w-md w-full">
              <OptimizedImage 
                src="/7054d274-40cc-49d1-ba82-70530de86643.jpg" 
                alt="Two beautiful cats relaxing together in a premium cattery environment with comfortable bedding and natural light"
                className="w-full h-96 object-cover object-center rounded-2xl shadow-2xl border-4 border-indigo-500/20"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 448px"
              />
              <div className="absolute -bottom-6 -left-6 bg-zinc-800/95 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/30 shadow-xl">
                <p className="font-manrope text-base font-semibold text-white">
                  🏠 Premium cattery comfort
                </p>
              </div>
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-manrope font-bold text-sm shadow-lg animate-bounce-slow">
                ⭐ 5-Star Care
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;