import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ValueProposition from './ValueProposition';
import SocialProof from './SocialProof';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main>
        <HeroSection />
        <ValueProposition />
        <SocialProof />
      </main>
      {/* Add bottom padding to prevent chatbot overlap */}
      <div className="h-20"></div>
    </div>
  );
};

export default LandingPage;