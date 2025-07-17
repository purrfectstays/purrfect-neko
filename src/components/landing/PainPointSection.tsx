import React from 'react';

const PainPointSection: React.FC = () => {
  const scrollToRegistration = () => {
    const registrationElement = document.getElementById('register');
    if (registrationElement) {
      registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
        if (emailInput) emailInput.focus();
      }, 500);
    }
  };

  return (
    <section className="py-16 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <header>
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-loading">
              Finding Quality Cat Care Shouldn't Be This Hard
            </h2>
          </header>
          <p className="text-lg text-zinc-300-accessible leading-relaxed">
            You love your cat like family, but finding trustworthy care feels impossible. Endless Google searches, 
            unanswered calls, no real availability info, and wondering "Is this place actually good?" 
            You deserve better than crossing your fingers and hoping for the best.
          </p>
          <button 
            onClick={scrollToRegistration}
            className="critical-button px-8 py-4 text-lg font-semibold touch-target-optimized hw-accelerated"
            aria-label="Get early access to better cat care - scroll to registration form"
          >
            GET EARLY ACCESS TO BETTER CAT CARE
          </button>
        </div>
      </div>
    </section>
  );
};

export default PainPointSection;