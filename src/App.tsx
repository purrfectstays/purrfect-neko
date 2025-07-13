import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import MainSite from './components/MainSite';
import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import EmailVerification from './components/EmailVerification';
import QualificationQuizSecure from './components/QualificationQuizSecure';
// Removed unused verification components
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
import EarlyAccessResources from './components/EarlyAccessResources';
import FreeCatTravelChecklist from './components/FreeCatTravelChecklist';
import CatteryEvaluationGuide from './components/CatteryEvaluationGuide';
import ResourceAccessButton from './components/ResourceAccessButton';
import TemplatePreview from './components/TemplatePreview';
import { initGA, trackPageView } from './lib/analytics';
import { useScrollTracking } from './hooks/useScrollTracking';
import { monitoring } from './lib/monitoring';
import { env } from './lib/environment';
import { setupGlobalErrorHandler } from './lib/errorHandler';

const HomeHandler: React.FC = () => {
  const { currentStep } = useApp();
  // Removed token verification logic - no longer needed
  
  function renderCurrentStep() {
    switch (currentStep) {
      case 'landing':
        return (
          <>
            <TemplatePreview />
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
            <TemplatePreview />
            <Footer />
          </>
        );
    }
  }
  
  return (
    <>
      {renderCurrentStep()}
      <ChatbotSupport />
      <ResourceAccessButton />
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
          {/* Main route now shows the optimized landing page */}
          <Route path="/" element={<HomeHandler />} />
          
          {/* Old welcome page moved to /welcome for reference */}
          <Route path="/welcome" element={<MainSite />} />
          
          {/* Landing page sub-routes */}
          <Route path="/landingpage/quiz" element={<QualificationQuizSecure />} />
          <Route path="/landingpage/success" element={<SuccessPage />} />
          
          {/* Legacy routes for backward compatibility */}
          {/* Removed verification routes - no longer needed */}
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
          
          {/* Template Preview route */}
          <Route path="/template-preview" element={<TemplatePreview />} />
          
          {/* Legacy Landing Page route */}
          <Route path="/legacy-landing" element={
            <div className="min-h-screen bg-zinc-900">
              <LandingPage />
              <Footer />
            </div>
          } />
          
          {/* Early Access Resources routes */}
          <Route path="/early-access-resources" element={<EarlyAccessResources />} />
          <Route path="/cat-travel-checklist" element={<FreeCatTravelChecklist />} />
          <Route path="/cattery-evaluation-guide" element={<CatteryEvaluationGuide />} />
          
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