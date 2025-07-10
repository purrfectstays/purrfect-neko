import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import MainSite from './components/MainSite';
import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import EmailVerification from './components/EmailVerification';
import QualificationQuizSecure from './components/QualificationQuizSecure';
import EmailVerificationHandler from './components/EmailVerificationHandler';
import VerificationResult from './components/VerificationResult';
import SuccessPage from './components/SuccessPage';
import ExploreCatteries from './components/ExploreCatteries';
import SupportPage from './components/SupportPage';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import CookiePolicy from './components/legal/CookiePolicy';
import QRCodePage from './components/QRCodePage';
import ChatbotSupport from './components/ChatbotSupport';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LaunchReadinessTest from './components/LaunchReadinessTest';
import DiagnosticTool from './components/DiagnosticTool';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CurrencyDemo from './components/CurrencyDemo';
import { initGA, trackPageView } from './lib/analytics';
import { useScrollTracking } from './hooks/useScrollTracking';
import { monitoring } from './lib/monitoring';
import { env } from './lib/environment';
import { setupGlobalErrorHandler } from './lib/errorHandler';

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
      case 'qr':
        return <QRCodePage />;
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

// Component to handle scroll to top on route changes
const ScrollToTop: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
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
      qr: 'QR Code Page',
      'launch-test': 'Launch Readiness Test',
    };

    trackPageView(pageNames[currentStep as keyof typeof pageNames] || 'Unknown Page');
  }, [currentStep]);

  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          {/* Main site route */}
          <Route path="/" element={<MainSite />} />
          
          {/* Landing page routes with full app functionality */}
          <Route path="/landingpage" element={<HomeHandler />} />
          
          {/* Landing page sub-routes */}
          <Route path="/landingpage/verify" element={<EmailVerificationHandler />} />
          <Route path="/landingpage/quiz" element={<QualificationQuizSecure />} />
          <Route path="/landingpage/success" element={<SuccessPage />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/verify" element={<EmailVerificationHandler />} />
          <Route path="/verify-result" element={<VerificationResult />} />
          <Route path="/quiz" element={<QualificationQuizSecure />} />
          <Route path="/success" element={<SuccessPage />} />
          
          {/* Legal pages routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/support" element={<SupportPage />} />
          
          {/* QR Code page */}
          <Route path="/qr" element={<QRCodePage />} />
          
          {/* Testing routes */}
          <Route path="/launch-test" element={<LaunchReadinessTest />} />
          <Route path="/diagnostic" element={<DiagnosticTool />} />
          
          {/* Analytics & Demo routes */}
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/currency-demo" element={<CurrencyDemo />} />
          
          {/* Catch-all redirect to main site */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

function App() {
  useEffect(() => {
    try {
      // Setup global error handler to silence AbortErrors
      setupGlobalErrorHandler();
      
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