import React from 'react';
import { ArrowRight, Users, TestTube, TrendingUp } from 'lucide-react';
import Logo from './Logo';
import OptimizedImage from './OptimizedImage';

const MainSite: React.FC = () => {
  const handleViewLandingPage = () => {
    window.location.href = '/landingpage';
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Logo - Much More Prominent */}
            <div className="flex justify-center mb-12">
              <OptimizedImage 
                src="/logo.png" 
                alt="Purrfect Stays Logo" 
                className="h-32 sm:h-40 lg:h-48 w-auto drop-shadow-2xl"
                loading="eager"
              />
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="font-manrope font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Purrfect Stays
                </span>
              </h1>
              
              <p className="font-manrope text-xl sm:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                The future of cattery bookings is being built with your input
              </p>
            </div>

            {/* Explanation Section */}
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/30 max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <TestTube className="h-8 w-8 text-indigo-400" />
                  <h2 className="font-manrope font-bold text-2xl text-white">
                    We're Building Something Special
                  </h2>
                </div>
                
                <p className="font-manrope text-lg text-zinc-300 leading-relaxed">
                  We're creating a revolutionary platform that connects cat parents with premium catteries. 
                  But we're not building it in isolation - we're building it <strong className="text-indigo-400">WITH</strong> the cat community.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                    <Users className="h-8 w-8 text-green-400 mb-4 mx-auto" />
                    <h3 className="font-manrope font-bold text-green-400 mb-2 text-center">Community-Driven</h3>
                    <p className="font-manrope text-sm text-zinc-300 text-center">
                      Early access members help shape features, pricing, and platform direction
                    </p>
                  </div>
                  
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                    <TestTube className="h-8 w-8 text-purple-400 mb-4 mx-auto" />
                    <h3 className="font-manrope font-bold text-purple-400 mb-2 text-center">Research Phase</h3>
                    <p className="font-manrope text-sm text-zinc-300 text-center">
                      Testing different approaches to find what works best for everyone
                    </p>
                  </div>
                  
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6">
                    <TrendingUp className="h-8 w-8 text-indigo-400 mb-4 mx-auto" />
                    <h3 className="font-manrope font-bold text-indigo-400 mb-2 text-center">Data-Driven</h3>
                    <p className="font-manrope text-sm text-zinc-300 text-center">
                      Every decision backed by real feedback from cat parents and cattery owners
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Landing Page Explanation */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/30 max-w-4xl mx-auto">
              <h3 className="font-manrope font-bold text-2xl text-amber-400 mb-4">
                🧪 Our Research Landing Page
              </h3>
              <p className="font-manrope text-lg text-zinc-300 mb-6 leading-relaxed">
                We've created a comprehensive landing page to test different messaging, 
                gather community feedback, and understand what resonates most with cat parents and cattery owners. 
                Your interactions help us refine our approach before the official launch.
              </p>
              
              <div className="bg-zinc-700/50 rounded-lg p-6 mb-6">
                <h4 className="font-manrope font-bold text-white mb-3">What You'll Experience:</h4>
                <ul className="space-y-2 text-zinc-300 font-manrope">
                  <li>• Complete user journey simulation</li>
                  <li>• Pricing model research (help us decide!)</li>
                  <li>• Feature preference gathering</li>
                  <li>• Community feedback collection</li>
                  <li>• Early access registration</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
                <p className="font-manrope text-sm text-green-200">
                  <strong>Your participation directly influences:</strong> Platform features, pricing models, 
                  user experience design, and launch priorities. Every click, every form submission, 
                  every piece of feedback helps us build something truly special for the cat community.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <button
                onClick={handleViewLandingPage}
                className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-manrope font-bold text-xl px-12 py-6 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 inline-flex items-center space-x-4"
              >
                <span>Experience Our Research Landing Page</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <div className="mt-6 space-y-2">
                <p className="text-sm text-zinc-400 font-manrope">
                  🔬 Research Environment • 🎯 Shape the Future • 💎 Early Access Benefits
                </p>
                <p className="text-xs text-indigo-300 font-manrope">
                  Help us build the perfect cattery booking platform for the community
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-manrope text-sm text-zinc-400">
              © 2025 Purrfect Stays. Building the future of cattery bookings with the cat community.
            </p>
            <p className="font-manrope text-xs text-zinc-500 mt-2">
              Research Phase • Community-Driven Development • Early Access Program
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainSite;