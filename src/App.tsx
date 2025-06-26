import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import EmailVerification from './components/EmailVerification';
import QualificationQuizSecure from './components/QualificationQuizSecure';
import VerifyEmail from './components/VerifyEmail';
import EmailVerificationHandler from './components/EmailVerificationHandler';
import SuccessPage from './components/SuccessPage';
import ExploreCatteries from './components/ExploreCatteries';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import CookiePolicy from './components/legal/CookiePolicy';
import TestingDashboard from './components/TestingDashboard';
import ChatbotSupport from './components/ChatbotSupport';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import GitHubIntegration from './components/GitHubIntegration';
import { initGA, trackPageView } from './lib/analytics';
import { useScrollTracking } from './hooks/useScrollTracking';
import { monitoring } from './lib/monitoring';
import { env } from './lib/environment';

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
      testing: 'Testing Dashboard',
      github: 'GitHub Integration'
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
          
          {/* GitHub integration route */}
          <Route path="/github" element={<GitHubIntegration />} />
          
          {/* Legal pages routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          
          {/* Main app routes */}
          <Route path="/" element={
            <>
              {renderCurrentStep()}
              <ChatbotSupport />
            </>
          } />
          
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );

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
      case 'testing':
        return <TestingDashboard />;
      case 'github':
        return <GitHubIntegration />;
      default:
        return (
          <>
            <LandingPage />
            <Footer />
          </>
        );
    }
  }
};

function App() {
  useEffect(() => {
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