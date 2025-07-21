import React from 'react';
import PerformanceOptimizedImage from '../PerformanceOptimizedImage';

const HowItWorksSection: React.FC = () => {
  const scrollToRegistration = () => {
    const registrationElement = document.querySelector('[data-registration-form]');
    if (registrationElement) {
      registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
        if (emailInput) emailInput.focus();
      }, 500);
    }
  };

  const steps = [
    {
      number: "1",
      title: "Search Near You",
      description: "Enter your location and dates to see verified catteries with real-time availability"
    },
    {
      number: "2", 
      title: "Compare & Choose",
      description: "Read reviews from local cat parents, see photos, and compare transparent pricing"
    },
    {
      number: "3",
      title: "Book Instantly", 
      description: "Reserve your spot with confidence - no phone tag, no uncertainty"
    }
  ];

  return (
    <section className="py-16 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 font-loading">
            How Purrfect Stays Will Work for You
          </h2>
          <p className="text-zinc-300-accessible max-w-2xl mx-auto">
            Our platform will make finding quality cat care simple, transparent, and stress-free
          </p>
        </header>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center mobile-optimized">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center hw-accelerated">
                <span className="text-white text-2xl font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-zinc-300-accessible">{step.description}</p>
            </div>
          ))}
        </div>
        
        {/* Process Showcase Image */}
        <div className="mt-16 mb-12 max-w-4xl mx-auto">
          <div className="relative">
            <PerformanceOptimizedImage
              src="/landingpageimage2.jpg"
              alt="Modern cattery facilities showcasing the booking process and premium care environment"
              width={600}
              height={350}
              className="w-full h-[350px] object-cover rounded-2xl shadow-xl border-3 border-green-500/20 prevent-cls"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
            
            {/* Overlay badge */}
            <div className="absolute top-6 left-6 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg mobile-optimized">
              🏢 Premium facilities
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={scrollToRegistration}
            className="critical-button px-8 py-4 font-semibold touch-target-optimized"
            aria-label="Be first to access this - scroll to registration form"
          >
            BE FIRST TO ACCESS THIS
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;