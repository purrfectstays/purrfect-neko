import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import EmailVerification from './components/EmailVerification';
import QualificationQuizSecure from './components/QualificationQuizSecure';
import EmailVerificationHandler from './components/EmailVerificationHandler';
import SuccessPage from './components/SuccessPage';
import ExploreCatteries from './components/ExploreCatteries';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import CookiePolicy from './components/legal/CookiePolicy';
import ChatbotSupport from './components/ChatbotSupport';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LaunchReadinessTest from './components/LaunchReadinessTest';
import { initGA, trackPageView } from './lib/analytics';
import { useScrollTracking } from './hooks/useScrollTracking';
import { monitoring } from './lib/monitoring';
import { env } from './lib/environment';

const HomeHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentStep } = useApp();
  const token = searchParams.get('token');
  
  // If there's a token parameter, redirect to verification
  if (token) {
    window.location.href = `/verify?token=${token}`;
    return <div>Redirecting...</div>;
  }
  
  function renderCurrentStep() {
    switch (currentStep) {
      case 'landing':
        return (
          <>
            <LandingPage />
            <Footer />
          </>
        );
      case 'registration':
        return <RegistrationForm />;
      case 'verification':
        return <EmailVerification />;
      case 'quiz':
        return <QualificationQuizSecure />;
      case 'success':
        return <SuccessPage />;
      case 'explore-catteries':
        return <ExploreCatteries />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'cookies':
        return <CookiePolicy />;
      case 'launch-test':
        return <LaunchReadinessTest />;
      default:
        return (
          <>
            <LandingPage />
            <Footer />
          </>
        );
    }
  }
  
  return (
    <>
      {renderCurrentStep()}
      <ChatbotSupport />
    </>
  );
};

const AppContent: React.FC = () => {
  const { currentStep } = useApp();

  // Initialize scroll tracking
  useScrollTracking();

  // Track page views when step changes
  useEffect(() => {
    const pageNames = {
      landing: 'Landing Page',
      registration: 'Registration Form',
      verification: 'Email Verification',
      quiz: 'Qualification Quiz',
      success: 'Success Page',
      'explore-catteries': 'Explore Catteries',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      'launch-test': 'Launch Readiness Test',
    };

    trackPageView(pageNames[currentStep as keyof typeof pageNames] || 'Unknown Page');
  }, [currentStep]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Email verification route */}
          <Route path="/verify" element={<EmailVerificationHandler />} />
          
          {/* Secure quiz route */}
          <Route path="/quiz" element={<QualificationQuizSecure />} />
          
          
          {/* Legal pages routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          
          {/* Testing routes */}
          <Route path="/launch-test" element={<LaunchReadinessTest />} />
          
          {/* Main app routes */}
          <Route path="/" element={<HomeHandler />} />
          
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

function App() {
  useEffect(() => {
    try {
      // Initialize Google Analytics
      if (env.gaMeasurementId) {
        initGA();
      }

      // Initialize monitoring
      monitoring.trackUserAction('app_initialized', {
        version: '1.0.0',
        environment: env.nodeEnv,
        hasAnalytics: !!env.gaMeasurementId,
        hasEmailService: !!env.resendApiKey,
      });

      // Log app initialization (safe for production)
      if (env.isDevelopment) {
        console.log('Purrfect Stays App Initialized', {
          version: '1.0.0',
          environment: env.nodeEnv,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;