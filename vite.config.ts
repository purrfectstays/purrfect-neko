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
    // Mobile-first performance optimizations
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Mobile-critical chunks (loaded first)
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react/jsx-runtime')) {
            return 'react-core';
          }
          
          // Essential routing for mobile
          if (id.includes('react-router-dom')) {
            return 'mobile-routing';
          }
          
          // Core utilities and hooks
          if (id.includes('/hooks/') || 
              id.includes('/lib/') ||
              id.includes('/services/')) {
            return 'mobile-utils';
          }
          
          // Mobile-first components
          if (id.includes('MobileFirst') || 
              id.includes('TemplatePreview') ||
              id.includes('RegistrationForm')) {
            return 'mobile-components';
          }
          
          // Desktop enhancement chunks (loaded later)
          if (id.includes('DesktopEnhancements') ||
              id.includes('Analytics') ||
              id.includes('Dashboard')) {
            return 'desktop-features';
          }
          
          // Heavy external libraries
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
          
          if (id.includes('lucide-react')) {
            return 'mobile-components'; // Bundle with components to ensure React is loaded first
          }
          
          // Quiz and other heavy features
          if (id.includes('Quiz') || 
              id.includes('EarlyAccess') ||
              id.includes('Evaluation')) {
            return 'heavy-features';
          }
          
          // Default vendor chunk for other node_modules
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
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    // CSS code splitting
    cssCodeSplit: true,
  },
  // Performance optimizations
  server: {
  },
  // Image optimization hints
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.webp'],
  
  // Ensure proper React resolution
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
});