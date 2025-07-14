import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import { initGA, trackPageView } from './lib/analytics';
import { useScrollTracking } from './hooks/useScrollTracking';
import { monitoring } from './lib/monitoring';
import { env } from './lib/environment';
import { setupGlobalErrorHandler } from './lib/errorHandler';

// Eager load critical components
import MainSite from './components/MainSite';
import TemplatePreview from './components/TemplatePreview';
import Footer from './components/Footer';
import ChatbotSupport from './components/ChatbotSupport';
import ResourceAccessButton from './components/ResourceAccessButton';

// Lazy load heavy components
const LandingPage = lazy(() => import('./components/LandingPage'));
const RegistrationForm = lazy(() => import('./components/RegistrationForm'));
const EmailVerification = lazy(() => import('./components/EmailVerification'));
const QualificationQuizSecure = lazy(() => import('./components/QualificationQuizSecure'));
const SuccessPage = lazy(() => import('./components/SuccessPage'));
const ExploreCatteries = lazy(() => import('./components/ExploreCatteries'));
const SupportPage = lazy(() => import('./components/SupportPage'));
const PrivacyPolicy = lazy(() => import('./components/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/legal/TermsOfService'));
const CookiePolicy = lazy(() => import('./components/legal/CookiePolicy'));
const QRCodePage = lazy(() => import('./components/QRCodePage'));
const LaunchReadinessTest = lazy(() => import('./components/LaunchReadinessTest'));
const DiagnosticTool = lazy(() => import('./components/DiagnosticTool'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const CurrencyDemo = lazy(() => import('./components/CurrencyDemo'));
const EarlyAccessResources = lazy(() => import('./components/EarlyAccessResources'));
const FreeCatTravelChecklist = lazy(() => import('./components/FreeCatTravelChecklist'));
const CatteryEvaluationGuide = lazy(() => import('./components/CatteryEvaluationGuide'));

// Loading component for lazy loaded components
const LoadingSpinner = () => (
  <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  </div>
);

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
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <RegistrationForm />
          </Suspense>
        );
      case 'verification':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <EmailVerification />
          </Suspense>
        );
      case 'quiz':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <QualificationQuizSecure />
          </Suspense>
        );
      case 'success':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SuccessPage />
          </Suspense>
        );
      case 'explore-catteries':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ExploreCatteries />
          </Suspense>
        );
      case 'privacy':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PrivacyPolicy />
          </Suspense>
        );
      case 'terms':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TermsOfService />
          </Suspense>
        );
      case 'cookies':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <CookiePolicy />
          </Suspense>
        );
      case 'qr':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <QRCodePage />
          </Suspense>
        );
      case 'launch-test':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LaunchReadinessTest />
          </Suspense>
        );
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
          <Route path="/landingpage/quiz" element={
            <Suspense fallback={<LoadingSpinner />}>
              <QualificationQuizSecure />
            </Suspense>
          } />
          <Route path="/landingpage/success" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SuccessPage />
            </Suspense>
          } />
          
          {/* Legacy routes for backward compatibility */}
          {/* Removed verification routes - no longer needed */}
          <Route path="/quiz" element={
            <Suspense fallback={<LoadingSpinner />}>
              <QualificationQuizSecure />
            </Suspense>
          } />
          <Route path="/success" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SuccessPage />
            </Suspense>
          } />
          
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