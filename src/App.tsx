import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import { initGA, trackPageView } from './lib/analytics';
import { useScrollTracking } from './hooks/useScrollTracking';
import { monitoring } from './lib/monitoring';
import { env } from './lib/environment';
import { setupGlobalErrorHandler } from './lib/errorHandler';
import './lib/performanceMonitor'; // Initialize performance monitoring

// Eager load critical components
import MainSite from './components/MainSite';
import TemplatePreview from './components/TemplatePreview';
import TemplatePreviewOptimized from './components/TemplatePreviewOptimized';
import Footer from './components/Footer';
import ChatbotSupport from './components/ChatbotSupport';
import ResourceAccessButton from './components/ResourceAccessButton';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load heavy components
const LandingPage = lazy(() => import('./components/LandingPage'));
const RegistrationForm = lazy(() => import('./components/RegistrationForm'));
const EmailVerification = lazy(() => import('./components/EmailVerification'));
const QualificationQuizEnhanced = lazy(() => import('./components/QualificationQuizEnhanced'));
const SuccessPage = lazy(() => import('./components/SuccessPage'));
const MobileRapidFlow = lazy(() => import('./components/MobileRapidFlow'));
const MobileRapidFlowOptimized = lazy(() => import('./components/MobileRapidFlowOptimized'));
const MobileRapidFlowUltra = lazy(() => import('./components/MobileRapidFlowUltra'));
const HeroSectionOptimized = lazy(() => import('./components/HeroSectionOptimized'));
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

// Guide pages
const GuidesLanding = lazy(() => import('./components/guides/GuidesLanding'));
const ChoosingCatteryGuide = lazy(() => import('./components/guides/ChoosingCatteryGuide'));
const BudgetPlanningGuide = lazy(() => import('./components/guides/BudgetPlanningGuide'));
const PreparationChecklistGuide = lazy(() => import('./components/guides/PreparationChecklistGuide'));
const StartingCatteryBusinessGuide = lazy(() => import('./components/guides/StartingCatteryBusinessGuide'));
const MarketingStrategiesGuide = lazy(() => import('./components/guides/MarketingStrategiesGuide'));
const PremiumServiceExcellenceGuide = lazy(() => import('./components/guides/PremiumServiceExcellenceGuide'));

// Loading component for lazy loaded components
const LoadingComponent = () => (
  <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
    <LoadingSpinner size="lg" />
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
            <TemplatePreviewOptimized />
            <Footer />
          </>
        );
      case 'registration':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <RegistrationForm />
          </Suspense>
        );
      case 'verification':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <EmailVerification />
          </Suspense>
        );
      case 'quiz':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <QualificationQuizEnhanced />
          </Suspense>
        );
      case 'success':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <SuccessPage />
          </Suspense>
        );
      case 'explore-catteries':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <ExploreCatteries />
          </Suspense>
        );
      case 'privacy':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <PrivacyPolicy />
          </Suspense>
        );
      case 'terms':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <TermsOfService />
          </Suspense>
        );
      case 'cookies':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <CookiePolicy />
          </Suspense>
        );
      case 'qr':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <QRCodePage />
          </Suspense>
        );
      case 'launch-test':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <LaunchReadinessTest />
          </Suspense>
        );
      default:
        return (
          <>
            <TemplatePreviewOptimized />
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
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <QualificationQuizEnhanced />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/landingpage/success" element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <SuccessPage />
              </Suspense>
            </ErrorBoundary>
          } />
          
          {/* NEW: Ultra-Optimized Mobile Rapid Flow - Primary Registration Path */}
          <Route path="/join" element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <MobileRapidFlowUltra />
              </Suspense>
            </ErrorBoundary>
          } />
          
          {/* A/B Testing versions */}
          <Route path="/join-v1" element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <MobileRapidFlow />
              </Suspense>
            </ErrorBoundary>
          } />
          
          <Route path="/join-v2" element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <MobileRapidFlowOptimized />
              </Suspense>
            </ErrorBoundary>
          } />
          
          {/* Optimized landing with new hero */}
          <Route path="/hero-demo" element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <HeroSectionOptimized />
              </Suspense>
            </ErrorBoundary>
          } />
          
          {/* Redirect old registration paths to new rapid flow */}
          <Route path="/register" element={<Navigate to="/join" replace />} />
          <Route path="/registration" element={<Navigate to="/join" replace />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/quiz" element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <QualificationQuizEnhanced />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/success" element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <SuccessPage />
              </Suspense>
            </ErrorBoundary>
          } />
          
          {/* Legal pages routes */}
          <Route path="/privacy" element={
            <ErrorBoundary>
              <PrivacyPolicy />
            </ErrorBoundary>
          } />
          <Route path="/terms" element={
            <ErrorBoundary>
              <TermsOfService />
            </ErrorBoundary>
          } />
          <Route path="/cookies" element={
            <ErrorBoundary>
              <CookiePolicy />
            </ErrorBoundary>
          } />
          <Route path="/support" element={
            <ErrorBoundary>
              <SupportPage />
            </ErrorBoundary>
          } />
          
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
          
          {/* Original vs Optimized comparison routes */}
          <Route path="/original-landing" element={
            <div className="min-h-screen bg-zinc-900">
              <TemplatePreview />
              <Footer />
            </div>
          } />
          
          <Route path="/optimized-landing" element={
            <div className="min-h-screen bg-zinc-900">
              <TemplatePreviewOptimized />
              <Footer />
            </div>
          } />
          
          {/* Early Access Resources routes */}
          <Route path="/early-access-resources" element={<EarlyAccessResources />} />
          <Route path="/cat-travel-checklist" element={<FreeCatTravelChecklist />} />
          <Route path="/cattery-evaluation-guide" element={<CatteryEvaluationGuide />} />
          
          {/* Guides routes */}
          <Route path="/guides" element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <GuidesLanding />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/guides/choosing-cattery" element={
            <Suspense fallback={<LoadingComponent />}>
              <ChoosingCatteryGuide />
            </Suspense>
          } />
          <Route path="/guides/budget-planning" element={
            <Suspense fallback={<LoadingComponent />}>
              <BudgetPlanningGuide />
            </Suspense>
          } />
          <Route path="/guides/preparation-checklist" element={
            <Suspense fallback={<LoadingComponent />}>
              <PreparationChecklistGuide />
            </Suspense>
          } />
          <Route path="/guides/starting-cattery-business" element={
            <Suspense fallback={<LoadingComponent />}>
              <StartingCatteryBusinessGuide />
            </Suspense>
          } />
          <Route path="/guides/marketing-strategies" element={
            <Suspense fallback={<LoadingComponent />}>
              <MarketingStrategiesGuide />
            </Suspense>
          } />
          <Route path="/guides/premium-service-excellence" element={
            <Suspense fallback={<LoadingComponent />}>
              <PremiumServiceExcellenceGuide />
            </Suspense>
          } />
          
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
        hasEmailService: true, // Email service is configured via Edge Functions
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