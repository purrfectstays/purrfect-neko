import React from 'react';
import { Users, MapPin } from 'lucide-react';
import PerformanceOptimizedImage from '../PerformanceOptimizedImage';

const CommunityEngagementSection: React.FC = () => {
  const scrollToRegistration = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="py-16 bg-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-12">
          <h3 className="text-2xl font-bold text-white font-loading">
            Building Together: Community Engagement
          </h3>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8">
            <div className="bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-700 mobile-optimized">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center hw-accelerated">
                  <Users className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
              </div>
              <h4 className="font-semibold text-white mb-2 text-center">Community Input</h4>
              <p className="text-zinc-300-accessible text-sm text-center">
                Every founding member shapes features through our qualification quiz and ongoing feedback
              </p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-700 mobile-optimized">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center hw-accelerated">
                  <MapPin className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
              </div>
              <h4 className="font-semibold text-white mb-2 text-center">Regional Expansion</h4>
              <p className="text-zinc-300-accessible text-sm text-center">
                Launch cities determined by founding community demand and cattery partner availability
              </p>
            </div>
          </div>

          <div className="relative">
            <PerformanceOptimizedImage
              src="/landingpageimage1.jpg"
              alt="Multiple cats enjoying community spaces together in premium cattery environment"
              width={500}
              height={300}
              className="w-full h-[300px] object-cover rounded-2xl shadow-xl border-2 border-purple-500/20 prevent-cls"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Overlay badge */}
            <div className="absolute bottom-6 left-6 bg-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg mobile-optimized">
              👥 Community together
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button 
            type="button"
            onClick={scrollToRegistration}
            className="critical-button px-8 py-3 font-semibold touch-target-optimized"
            aria-label="Join the movement - scroll to registration form"
          >
            JOIN THE MOVEMENT
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunityEngagementSection;