import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ValueProposition from './ValueProposition';
import SocialProof from './SocialProof';
import RegionalUrgency from './RegionalUrgency';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';

const LandingPage: React.FC = () => {
  // Track detailed user behavior for conversion optimization
  useBehaviorTracking('landing_page', {
    trackScrollDepth: true,
    trackTimeOnPage: true,
    trackClickHeatmap: true,
    trackFormInteractions: false
  });

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main>
        <HeroSection />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <RegionalUrgency variant="banner" showDetails={true} />
        </div>
        <ValueProposition />
        <SocialProof />
      </main>
      {/* Add bottom padding to prevent chatbot overlap */}
      <div className="h-20"></div>
    </div>
  );
};

export default LandingPage;