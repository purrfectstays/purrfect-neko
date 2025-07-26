import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error - plugin has no typed declarations
import { visualizer } from 'rollup-plugin-visualizer';
// @ts-expect-error - plugin has no typed declarations
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  // Configure base path - keep root for now since we're handling routing in React
  base: '/',
  
  plugins: [
    react(),
    // Generates bundle analysis at build/dist
    visualizer({ filename: 'dist/bundle-analysis.html', open: false, gzipSize: true, brotliSize: true }),
    // Output gzip and brotli compressed assets ready for hosting
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' })
  ],

  build: {
    // Prevent ANY assets from being inlined as data URIs (CSP compliance)
    assetsInlineLimit: 0,
    // Mobile-first performance optimizations
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // SAFE CHUNKING: Keep React core together to avoid runtime issues
          
          // Core React libs - keep together for compatibility
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'react-core';
          }
          
          // Router - separate chunk for code splitting
          if (id.includes('react-router-dom')) {
            return 'routing';
          }
          
          // React DOM core (separate from runtime)
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom-core';
          }
          
          // Remaining React internals (smaller now)
          if (id.includes('node_modules/react')) {
            return 'react-internals';
          }
          
          // QR Code libraries - heavy image processing
          if (id.includes('node_modules/qrcode') || 
              id.includes('node_modules/canvas') ||
              id.includes('node_modules/pngjs')) {
            return 'qr-libs';
          }
          
          // Chart libraries - heavy visualization
          if (id.includes('node_modules/recharts') || 
              id.includes('node_modules/d3') ||
              id.includes('node_modules/@types/d3')) {
            return 'chart-libs';
          }
          
          // Form and validation libraries
          if (id.includes('node_modules/zod') ||
              id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/@hookform')) {
            return 'form-libs';
          }
          
          // Supabase - heavy library, separate chunk
          if (id.includes('@supabase/supabase-js') ||
              id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          
          // Lucide icons - heavy UI library
          if (id.includes('lucide-react')) {
            return 'ui-icons';
          }
          
          // CSS and styling utilities
          if (id.includes('node_modules/clsx') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/tailwind-merge')) {
            return 'css-utils';
          }
          
          // GUIDES: Split into business vs user guides
          if (id.includes('/guides/StartingCatteryBusinessGuide') ||
              id.includes('/guides/MarketingStrategiesGuide') ||
              id.includes('/guides/PremiumServiceExcellenceGuide')) {
            return 'business-guides';
          }
          
          if (id.includes('/guides/ChoosingCatteryGuide') ||
              id.includes('/guides/BudgetPlanningGuide') ||
              id.includes('/guides/PreparationChecklistGuide') ||
              id.includes('/guides/GuidesLanding')) {
            return 'user-guides';
          }
          
          // QUIZ COMPONENTS: Separate large quiz components
          if (id.includes('QualificationQuiz') || 
              id.includes('Quiz')) {
            return 'quiz-components';
          }
          
          // SUCCESS & ONBOARDING: Success page and related flows
          if (id.includes('SuccessPage') ||
              id.includes('EarlyAccess') ||
              id.includes('ResourceAccess')) {
            return 'success-components';
          }
          
          // MOBILE FLOWS: Large mobile components (800+ lines each)
          if (id.includes('MobileRapidFlow') ||
              id.includes('MobileSticky') ||
              id.includes('UltraLightMobile')) {
            return 'mobile-flows';
          }
          
          // TEMPLATE & PREVIEW: Large template components
          if (id.includes('TemplatePreview') ||
              id.includes('InlineRegistrationForm')) {
            return 'template-components';
          }
          
          // ANALYTICS & DASHBOARD: Heavy analytics components
          if (id.includes('AnalyticsDashboard') ||
              id.includes('LaunchReadinessTest') ||
              id.includes('DiagnosticTool')) {
            return 'analytics-dashboard';
          }
          
          // SUPPORT & CHAT: Heavy interactive components
          if (id.includes('ChatbotSupport') ||
              id.includes('SupportPage') ||
              id.includes('ExploreCatteries')) {
            return 'support-components';
          }
          
          // LEGAL PAGES: Large legal content
          if (id.includes('PrivacyPolicy') ||
              id.includes('TermsOfService') ||
              id.includes('CookiePolicy')) {
            return 'legal-pages';
          }
          
          // EVALUATION & CHECKLISTS: Feature-heavy components
          if (id.includes('CatteryEvaluation') ||
              id.includes('FreeCatTravelChecklist')) {
            return 'evaluation-tools';
          }
          
          // Analytics and tracking libraries
          if (id.includes('analytics') ||
              id.includes('monitoring') ||
              id.includes('tracking')) {
            return 'analytics-libs';
          }
          
          // Charts and visualization libraries
          if (id.includes('recharts') || 
              id.includes('chart') ||
              id.includes('visualization')) {
            return 'chart-libs';
          }
          
          // Remaining vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Use hashed file names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Minify for production - CSP-friendly configuration
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Prevent aggressive inlining that creates data URIs
        inline: false,
        reduce_funcs: false
      },
      format: {
        // Prevent script concatenation that causes CSP issues
        beautify: false,
        comments: false
      }
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Ultra-aggressive chunk size limits for 90+ PageSpeed
    chunkSizeWarningLimit: 250, // Target: No single chunk >250KB
    reportCompressedSize: true,
    // Advanced CSS code splitting
    cssCodeSplit: true,
    // CSS minification for better compression
    cssMinify: true,
    // Experimental: Better tree shaking
    experimentalMinChunkSize: 1000,
  },
  // Performance optimizations
  server: {
  },
  // Image optimization hints
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.webp'],
  
  // Ensure proper React resolution
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
    force: true
  },

  // Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'supabase/',
        'src/lib/supabase.ts', // External service
        'src/main.tsx', // App entry point
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});